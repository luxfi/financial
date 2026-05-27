'use client';

// Order-entry panel — limit-only, ATS time-price priority. Submits to the
// gateway which runs the pre-trade gate before routing. The response
// carries the Decision, surfaced below the form via GateDecisionView.
//
// Quantity / price are validated client-side against tickSize / lotSize
// so the user sees the error before the server round-trip.

import { useState, useTransition } from 'react';
import { Button, Select } from '@/components/forms';
import { Notice } from '@/components/data';
import {
  gateway,
  type GateDecision,
  type MarketOffering,
  type MarketOrderSide,
  type PlaceOrderResponse,
  type TimeInForce,
} from '@/lib/gateway';
import { GateDecisionView } from './GateDecisionView';

const TIF_OPTIONS: { value: TimeInForce; label: string }[] = [
  { value: 'day', label: 'Day' },
  { value: 'gtc', label: 'GTC' },
  { value: 'ioc', label: 'IOC' },
  { value: 'fok', label: 'FOK' },
];

function validateAgainstTick(
  price: string,
  tickSize: string,
): string | null {
  const p = Number(price);
  const t = Number(tickSize);
  if (!Number.isFinite(p) || p <= 0) return 'Enter a positive price.';
  if (!Number.isFinite(t) || t <= 0) return null;
  // Convert to integer ticks to avoid floating-point drift; round-half-up
  // to nearest tick and compare.
  const ratio = p / t;
  if (Math.abs(ratio - Math.round(ratio)) > 1e-6) {
    return `Price must align to tick size ${tickSize}.`;
  }
  return null;
}

function validateAgainstLot(
  quantity: string,
  lotSize: string,
): string | null {
  const q = Number(quantity);
  const l = Number(lotSize);
  if (!Number.isFinite(q) || q <= 0) return 'Enter a positive quantity.';
  if (!Number.isFinite(l) || l <= 0) return null;
  if (q % l !== 0) return `Quantity must be a multiple of lot size ${lotSize}.`;
  return null;
}

export function OrderEntryPanel({ offering }: { offering: MarketOffering }) {
  const [side, setSide] = useState<MarketOrderSide>('buy');
  const [tif, setTif] = useState<TimeInForce>('day');
  const [price, setPrice] = useState(offering.bestAsk ?? offering.lastTradePrice ?? '');
  const [quantity, setQuantity] = useState('');
  const [busy, startTransition] = useTransition();
  const [err, setErr] = useState<string | null>(null);
  const [decision, setDecision] = useState<GateDecision | null>(null);
  const [confirmation, setConfirmation] = useState<PlaceOrderResponse | null>(null);

  function submit() {
    const priceErr = validateAgainstTick(price, offering.tickSize);
    if (priceErr) {
      setErr(priceErr);
      setDecision(null);
      setConfirmation(null);
      return;
    }
    const qtyErr = validateAgainstLot(quantity, offering.lotSize);
    if (qtyErr) {
      setErr(qtyErr);
      setDecision(null);
      setConfirmation(null);
      return;
    }
    startTransition(async () => {
      setErr(null);
      setDecision(null);
      setConfirmation(null);
      try {
        const res = await gateway.market.placeOrder({
          offeringID: offering.id,
          side,
          type: 'limit',
          timeInForce: tif,
          price,
          quantity,
          clientOrderID: `co-${Date.now()}`,
        });
        setDecision(res.gateDecision);
        setConfirmation(res);
      } catch (e) {
        setErr((e as Error).message);
      }
    });
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        submit();
      }}
      className="flex flex-col gap-3"
      aria-label="Order entry"
    >
      <div className="flex gap-2">
        <Button
          type="button"
          variant={side === 'buy' ? 'primary' : 'ghost'}
          onClick={() => setSide('buy')}
        >
          Buy
        </Button>
        <Button
          type="button"
          variant={side === 'sell' ? 'primary' : 'ghost'}
          onClick={() => setSide('sell')}
        >
          Sell
        </Button>
      </div>

      <div className="grid gap-2" style={{ gridTemplateColumns: '1fr 1fr' }}>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Quantity (lot {offering.lotSize})
          <input
            value={quantity}
            inputMode="decimal"
            onChange={(e) => setQuantity(e.target.value)}
            required
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem] tabular-nums"
          />
        </label>
        <label className="flex flex-col gap-1 text-[1.2rem]">
          Limit price (tick {offering.tickSize})
          <input
            value={price}
            inputMode="decimal"
            onChange={(e) => setPrice(e.target.value)}
            required
            className="h-9 px-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-background)] text-[1.3rem] tabular-nums"
          />
        </label>
      </div>

      <Select
        label="Time in force"
        name="tif"
        value={tif}
        options={TIF_OPTIONS}
        onChange={(e) => setTif(e.target.value as TimeInForce)}
      />

      <Button type="submit" disabled={busy || !offering.open}>
        {busy ? 'Submitting…' : `Place ${side.toUpperCase()} (limit only)`}
      </Button>

      {!offering.open ? (
        <Notice tone="warn">
          This offering is closed for new orders right now.
        </Notice>
      ) : null}

      {err ? <Notice tone="error">{err}</Notice> : null}

      {decision ? (
        <div className="mt-2">
          <GateDecisionView decision={decision} />
        </div>
      ) : null}

      {confirmation && confirmation.order.status === 'open' ? (
        <Notice tone="info">
          Order {confirmation.order.id} is open on the book.
        </Notice>
      ) : null}
    </form>
  );
}
