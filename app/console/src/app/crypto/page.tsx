"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { Button, Card, Field, Grid, Input, Label, Notice, PageHeader, Table } from "@/components/Page";
import { listCryptoBalances, sendCrypto, type CryptoBalance } from "@/lib/client";

export default function Crypto() {
  const [rows, setRows] = useState<CryptoBalance[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState("USDC");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [sendErr, setSendErr] = useState<string | null>(null);
  const [sendOk, setSendOk] = useState<string | null>(null);

  useEffect(() => {
    listCryptoBalances().then(setRows).catch((e) => setError(e.message));
  }, []);

  async function onSend(e: React.FormEvent) {
    e.preventDefault();
    setSendErr(null); setSendOk(null);
    try {
      const r = await sendCrypto({ asset, to, amount });
      setSendOk(`Broadcast: ${r.txid}`);
    } catch (err) {
      setSendErr((err as Error).message);
    }
  }

  return (
    <>
      <PageHeader title="Crypto" subtitle="Wallet balances. Send and receive on-chain." />
      <Grid $cols={2}>
        <Card>
          <h2 style={{ fontSize: "1.6rem", marginBottom: 12 }}>Balances</h2>
          {error ? <Notice $tone="error">{error}</Notice> : null}
          <Table>
            <thead><tr><th>Asset</th><th>Amount</th><th>Fiat</th></tr></thead>
            <tbody>
              {rows?.length
                ? rows.map((r) => (
                    <tr key={r.asset}><td>{r.asset}</td><td>{r.amount}</td><td>{r.fiatValue}</td></tr>
                  ))
                : (<tr><td colSpan={3} style={{ color: "rgba(255,255,255,0.45)" }}>{error ? "—" : "Loading…"}</td></tr>)}
            </tbody>
          </Table>
        </Card>
        <Card>
          <h2 style={{ fontSize: "1.6rem", marginBottom: 12 }}>Send</h2>
          <form onSubmit={onSend}>
            <Field>
              <Label>Asset</Label>
              <Input value={asset} onChange={(e) => setAsset(e.target.value)} required />
            </Field>
            <Field>
              <Label>To address</Label>
              <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="0x… or chain-native" required />
            </Field>
            <Field>
              <Label>Amount</Label>
              <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" required />
            </Field>
            <Button type="submit">Broadcast</Button>
            {sendOk ? <Notice style={{ marginTop: 12 }}>{sendOk}</Notice> : null}
            {sendErr ? <Notice $tone="error" style={{ marginTop: 12 }}>{sendErr}</Notice> : null}
          </form>
          <ReceiveBox>
            <Label>Receive</Label>
            <code style={{ wordBreak: "break-all" }}>(generate address from broker — not yet wired)</code>
          </ReceiveBox>
        </Card>
      </Grid>
    </>
  );
}

const ReceiveBox = styled.div`
  margin-top: 16px;
  padding: 12px;
  border-radius: 8px;
  background: ${({ theme }) => theme.colors.background};
  border: 1px dashed ${({ theme }) => theme.colors.border};
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.secondary};
`;
