"use client";
import { useEffect, useState } from "react";
import { Card, Grid, Notice, PageHeader } from "@/components/Page";
import { listAccounts, type AccountBalance } from "@/lib/client";
import styled from "styled-components";

export default function Dashboard() {
  const [accounts, setAccounts] = useState<AccountBalance[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  useEffect(() => {
    listAccounts().then(setAccounts).catch((e) => setError(e.message));
  }, []);
  return (
    <>
      <PageHeader title="Dashboard" subtitle="Account overview across every product." />
      {error ? <Notice $tone="error">{error}</Notice> : null}
      <Grid $cols={3} style={{ marginTop: 16 }}>
        <Card>
          <Label>Total balance</Label>
          <BigNum>{accounts ? sumBalances(accounts) : "—"}</BigNum>
          <Hint>across {accounts?.length ?? "—"} accounts</Hint>
        </Card>
        <Card>
          <Label>Pending transfers</Label>
          <BigNum>—</BigNum>
          <Hint>last 24 hours</Hint>
        </Card>
        <Card>
          <Label>Open cards</Label>
          <BigNum>—</BigNum>
          <Hint>virtual + physical</Hint>
        </Card>
      </Grid>
    </>
  );
}

function sumBalances(a: AccountBalance[]): string {
  if (a.length === 0) return "0.00";
  return a.map((x) => `${x.available} ${x.currency}`).join(", ");
}

const Label = styled.div`
  color: ${({ theme }) => theme.colors.muted};
  font-size: 1.1rem;
  text-transform: uppercase;
  letter-spacing: 0.06em;
`;
const BigNum = styled.div`
  font-size: 2.8rem;
  font-weight: 700;
  margin-top: 8px;
  letter-spacing: -0.02em;
`;
const Hint = styled.div`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.2rem;
  margin-top: 4px;
`;
