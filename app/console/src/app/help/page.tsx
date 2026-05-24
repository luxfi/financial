"use client";
import { Card, PageHeader } from "@/components/Page";
import { LUX_BRAND } from "@luxbank/brand";

export default function Help() {
  return (
    <>
      <PageHeader title="Help" subtitle="Support and resources." />
      <Card>
        <p style={{ fontSize: "1.4rem", lineHeight: 1.6 }}>
          For account issues, contact{" "}
          <a href={`mailto:${LUX_BRAND.jurisdiction.contact.supportEmail ?? LUX_BRAND.jurisdiction.contact.email}`} style={{ textDecoration: "underline" }}>
            {LUX_BRAND.jurisdiction.contact.supportEmail ?? LUX_BRAND.jurisdiction.contact.email}
          </a>.
        </p>
      </Card>
    </>
  );
}
