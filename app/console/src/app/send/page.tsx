"use client";
import { useState } from "react";
import { Button, Card, Field, Input, Label, Notice, PageHeader, Select } from "@/components/Page";
import { sendTransfer } from "@/lib/client";

type Rail = "swift" | "sepa" | "fedwire" | "fednow" | "ach" | "internal";

export default function SendMoney() {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [rail, setRail] = useState<Rail>("internal");
  const [status, setStatus] = useState<{ kind: "idle" | "ok" | "error"; msg?: string }>({ kind: "idle" });

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus({ kind: "idle" });
    try {
      const r = await sendTransfer({ from, to, amount, rail });
      setStatus({ kind: "ok", msg: `Transfer queued: ${r.id}` });
    } catch (err) {
      setStatus({ kind: "error", msg: (err as Error).message });
    }
  }

  return (
    <>
      <PageHeader title="Send Money" subtitle="Initiate a transfer over any supported rail." />
      <Card style={{ maxWidth: 560 }}>
        <form onSubmit={onSubmit}>
          <Field>
            <Label>From account</Label>
            <Input value={from} onChange={(e) => setFrom(e.target.value)} placeholder="acct_…" required />
          </Field>
          <Field>
            <Label>Beneficiary</Label>
            <Input value={to} onChange={(e) => setTo(e.target.value)} placeholder="IBAN / account number" required />
          </Field>
          <Field>
            <Label>Amount</Label>
            <Input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" required />
          </Field>
          <Field>
            <Label>Rail</Label>
            <Select value={rail} onChange={(e) => setRail(e.target.value as Rail)}>
              <option value="internal">Internal (book transfer)</option>
              <option value="ach">ACH</option>
              <option value="fednow">FedNow</option>
              <option value="fedwire">Fedwire</option>
              <option value="sepa">SEPA</option>
              <option value="swift">SWIFT</option>
            </Select>
          </Field>
          <Button type="submit">Send</Button>
          {status.kind === "ok" ? <Notice style={{ marginTop: 12 }}>{status.msg}</Notice> : null}
          {status.kind === "error" ? <Notice $tone="error" style={{ marginTop: 12 }}>{status.msg}</Notice> : null}
        </form>
      </Card>
    </>
  );
}
