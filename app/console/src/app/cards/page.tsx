"use client";
import { useEffect, useState } from "react";
import { Button, Card, Notice, PageHeader, Table } from "@/components/Page";
import { issueCard, listCards, type Card as CardModel } from "@/lib/client";

export default function Cards() {
  const [rows, setRows] = useState<CardModel[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [issuing, setIssuing] = useState<"virtual" | "physical" | null>(null);

  function refresh() {
    setError(null);
    listCards().then(setRows).catch((e) => setError(e.message));
  }
  useEffect(refresh, []);

  async function onIssue(type: "virtual" | "physical") {
    setIssuing(type);
    try {
      await issueCard({ type });
      refresh();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setIssuing(null);
    }
  }

  return (
    <>
      <PageHeader
        title="Cards"
        subtitle="Issued cards and new issuance."
        actions={
          <>
            <Button $variant="ghost" disabled={issuing !== null} onClick={() => onIssue("virtual")}>
              {issuing === "virtual" ? "Issuing…" : "Issue virtual"}
            </Button>
            <Button disabled={issuing !== null} onClick={() => onIssue("physical")}>
              {issuing === "physical" ? "Issuing…" : "Issue physical"}
            </Button>
          </>
        }
      />
      <Card>
        {error ? <Notice $tone="error">{error}</Notice> : null}
        <Table>
          <thead>
            <tr><th>Last 4</th><th>Brand</th><th>Type</th><th>Status</th></tr>
          </thead>
          <tbody>
            {rows?.length
              ? rows.map((r) => (
                  <tr key={r.id}>
                    <td>•••• {r.last4}</td>
                    <td>{r.brand}</td>
                    <td>{r.type}</td>
                    <td>{r.status}</td>
                  </tr>
                ))
              : (<tr><td colSpan={4} style={{ color: "rgba(255,255,255,0.45)" }}>{error ? "—" : "Loading…"}</td></tr>)}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
