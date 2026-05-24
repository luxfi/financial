"use client";
import { useState } from "react";
import { Button, Card, Field, Grid, Input, Label, Notice, PageHeader } from "@/components/Page";

export default function Settings() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [twoFa, setTwoFa] = useState(false);
  const [saved, setSaved] = useState<string | null>(null);

  function onSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSaved("Profile changes queued for the next session.");
  }

  return (
    <>
      <PageHeader title="Settings" subtitle="Profile, security, identity verification." />
      <Grid $cols={2}>
        <Card>
          <h2 style={{ fontSize: "1.6rem", marginBottom: 12 }}>Profile</h2>
          <form onSubmit={onSaveProfile}>
            <Field>
              <Label>Full name</Label>
              <Input value={name} onChange={(e) => setName(e.target.value)} />
            </Field>
            <Field>
              <Label>Email</Label>
              <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
            </Field>
            <Button type="submit">Save</Button>
            {saved ? <Notice style={{ marginTop: 12 }}>{saved}</Notice> : null}
          </form>
        </Card>
        <Card>
          <h2 style={{ fontSize: "1.6rem", marginBottom: 12 }}>Security</h2>
          <Field>
            <Label>Two-factor authentication</Label>
            <Button $variant={twoFa ? "danger" : "primary"} onClick={() => setTwoFa((v) => !v)}>
              {twoFa ? "Disable 2FA" : "Enable 2FA"}
            </Button>
          </Field>
          <Field>
            <Label>Identity verification (KYC)</Label>
            <a href="/compliance">
              <Button $variant="ghost" type="button">Manage KYC</Button>
            </a>
          </Field>
          <Field>
            <Label>Sessions</Label>
            <Button $variant="ghost" type="button">Sign out all devices</Button>
          </Field>
        </Card>
      </Grid>
    </>
  );
}
