"use client";
import { useEffect, useState } from "react";
import { Card, Notice, PageHeader, Table } from "@/components/Page";
import { listAccounts, type AccountBalance } from "@/lib/client";

export default function Accounts() {
  const [rows, setRows] = useState<AccountBalance[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    listAccounts().then(setRows).catch((e) => setError(e.message));
  }, []);
  return (
    <>
      <PageHeader title="Accounts" subtitle="Multi-currency balances across every account." />
      <Card>
        {error ? <Notice $tone="error">{error}</Notice> : null}
        <Table>
          <thead>
            <tr>
              <th>Currency</th>
              <th>Available</th>
              <th>Pending</th>
            </tr>
          </thead>
          <tbody>
            {rows?.length
              ? rows.map((r) => (
                  <tr key={r.currency}>
                    <td>{r.currency}</td>
                    <td>{r.available}</td>
                    <td>{r.pending}</td>
                  </tr>
                ))
              : (
                <tr><td colSpan={3} style={{ color: "rgba(255,255,255,0.45)" }}>{error ? "—" : "Loading…"}</td></tr>
              )}
          </tbody>
        </Table>
      </Card>
    </>
  );
}
