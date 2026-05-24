"use client";
import { useState } from "react";
import { Button, Card, Field, Input, Label, Notice, PageHeader } from "@/components/Page";
import { executeFx, quoteFx, type FxQuote } from "@/lib/client";

export default function Fx() {
  const [pair, setPair] = useState("EURUSD");
  const [amount, setAmount] = useState("");
  const [quote, setQuote] = useState<FxQuote | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [execMsg, setExecMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onQuote(e: React.FormEvent) {
    e.preventDefault();
    setError(null); setQuote(null); setExecMsg(null);
    setBusy(true);
    try {
      const q = await quoteFx({ pair, amount });
      setQuote(q);
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }

  async function onExecute() {
    if (!quote) return;
    setBusy(true); setError(null);
    try {
      const r = await executeFx(quote.quoteId);
      setExecMsg(`Executed: ${r.id}`);
      setQuote(null);
    } catch (err) { setError((err as Error).message); }
    finally { setBusy(false); }
  }

  return (
    <>
      <PageHeader title="FX" subtitle="Quote and execute foreign exchange." />
      <Card style={{ maxWidth: 560 }}>
        <form onSubmit={onQuote}>
          <Field>
            <Label>Pair</Label>
            <Input value={pair} onChange={(e) => setPair(e.target.value)} required />
          </Field>
          <Field>
            <Label>Amount</Label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
          </Field>
          <Button type="submit" disabled={busy}>Get quote</Button>
        </form>
        {quote ? (
          <div style={{ marginTop: 16 }}>
            <Notice>
              <div>Rate: <strong>{quote.rate}</strong></div>
              <div>Expires: {quote.expiresAt}</div>
            </Notice>
            <Button style={{ marginTop: 12 }} onClick={onExecute} disabled={busy}>Execute</Button>
          </div>
        ) : null}
        {execMsg ? <Notice style={{ marginTop: 12 }}>{execMsg}</Notice> : null}
        {error ? <Notice $tone="error" style={{ marginTop: 12 }}>{error}</Notice> : null}
      </Card>
    </>
  );
}
