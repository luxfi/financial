"use client";
import { useEffect, useRef, useState } from "react";
import { Button, Card, Field, Label, Notice, PageHeader, Table } from "@/components/Page";
import { getComplianceState, uploadKycDocument, type ComplianceState } from "@/lib/client";

export default function Compliance() {
  const [state, setState] = useState<ComplianceState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);
  const [docType, setDocType] = useState("passport");
  const [msg, setMsg] = useState<string | null>(null);

  function refresh() {
    setError(null);
    getComplianceState().then(setState).catch((e) => setError(e.message));
  }
  useEffect(refresh, []);

  async function onUpload(e: React.FormEvent) {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    if (!file) { setError("Choose a file first."); return; }
    setUploading(true); setMsg(null); setError(null);
    try {
      const r = await uploadKycDocument({ type: docType, file });
      setMsg(`Uploaded: ${r.id}`);
      refresh();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setUploading(false);
    }
  }

  return (
    <>
      <PageHeader title="Compliance" subtitle="KYC level, document state, attestations." />
      <Card style={{ marginBottom: 16 }}>
        <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
          <KycPill level={state?.kycLevel ?? 0} status={state?.status ?? "none"} />
          <div style={{ flex: 1 }}>
            {error ? <Notice $tone="error">{error}</Notice> : null}
            {!state && !error ? "Loading compliance state…" : null}
          </div>
        </div>
      </Card>
      <Card style={{ marginBottom: 16 }}>
        <h2 style={{ fontSize: "1.6rem", marginBottom: 12 }}>Documents</h2>
        <Table>
          <thead><tr><th>Type</th><th>Status</th></tr></thead>
          <tbody>
            {state?.documents?.length
              ? state.documents.map((d, i) => (<tr key={i}><td>{d.type}</td><td>{d.status}</td></tr>))
              : (<tr><td colSpan={2} style={{ color: "rgba(255,255,255,0.45)" }}>{state ? "No documents on file." : "—"}</td></tr>)}
          </tbody>
        </Table>
      </Card>
      <Card style={{ maxWidth: 560 }}>
        <h2 style={{ fontSize: "1.6rem", marginBottom: 12 }}>Upload document</h2>
        <form onSubmit={onUpload}>
          <Field>
            <Label>Document type</Label>
            <select value={docType} onChange={(e) => setDocType(e.target.value)} style={{ height: 40, padding: "0 12px", borderRadius: 10, background: "#000", color: "#fff", border: "1px solid rgba(255,255,255,0.08)", fontSize: "1.3rem" }}>
              <option value="passport">Passport</option>
              <option value="id_card">National ID card</option>
              <option value="drivers_license">Driver's licence</option>
              <option value="proof_of_address">Proof of address</option>
            </select>
          </Field>
          <Field>
            <Label>File</Label>
            <input ref={fileRef} type="file" accept="image/*,application/pdf" />
          </Field>
          <Button type="submit" disabled={uploading}>{uploading ? "Uploading…" : "Upload"}</Button>
          {msg ? <Notice style={{ marginTop: 12 }}>{msg}</Notice> : null}
        </form>
      </Card>
    </>
  );
}

function KycPill({ level, status }: { level: number; status: string }) {
  const tone = status === "approved" ? "#22C55E" : status === "rejected" ? "#EF4444" : "rgba(255,255,255,0.45)";
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <div style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.45)", textTransform: "uppercase", letterSpacing: "0.06em" }}>KYC</div>
      <div style={{ fontSize: "2.4rem", fontWeight: 700 }}>L{level}</div>
      <div style={{ fontSize: "1.2rem", color: tone }}>{status}</div>
    </div>
  );
}
