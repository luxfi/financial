"use client";
import Link from "next/link";
import { CustomButton, SecondaryButton } from "@/components/Button";
import {
  PageContainer,
  HeroSection,
  HeroContent,
  ProductBadge,
  HeroTitle,
  HeroSubtitle,
  HeroButtons,
  TwoColumnSection,
  ContentBlock,
  BlockTitle,
  BlockText,
  FeatureList,
  FeatureItem,
  FeatureCheck,
  FeatureText,
  Section,
  SectionHeader,
  SectionTitle,
  SectionSubtitle,
  CardGrid,
  Card,
  CardTitle,
  CardDescription,
  SpecsTable,
  SpecsRow,
  SpecsLabel,
  SpecsValue,
  CTASection,
  CTATitle,
  CTASubtitle,
} from "../../products/styles";

const DOCS = "https://docs.lux.financial/docs";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const keyClasses = [
  { cls: "Root / Master", storage: "HSM (FIPS 140-2 L3)", rotation: "5 years", usage: "Signs intermediate CA certs, nothing else" },
  { cls: "Tenant Signing", storage: "MPC cohort (3-of-5)", rotation: "Proactive every 90 days", usage: "Signs client-directed transactions" },
  { cls: "Data-at-Rest", storage: "KMS + HSM-wrapped DEK", rotation: "Per-object DEK, yearly KEK", usage: "AES-256-GCM envelope encryption" },
  { cls: "TLS / mTLS", storage: "Per-pod ephemeral", rotation: "24h rotation via SPIFFE", usage: "Service-to-service auth" },
  { cls: "API / JWT", storage: "KMS (Ed25519)", rotation: "Daily", usage: "Signs user session JWTs" },
];

const policies = [
  { name: "Velocity", description: "Per-key per-hour signature cap; exceed = auto-disable + pagerduty" },
  { name: "Geo-fence", description: "Require signing request to originate from approved regions" },
  { name: "Destination allowlist", description: "Whitelist counterparties per key; deny everything else" },
  { name: "Amount threshold", description: "Below $X single-factor; above requires multi-party approval" },
  { name: "Time-of-day", description: "Block withdrawals outside business hours for treasury keys" },
  { name: "Dual control", description: "Two human approvers required above policy threshold" },
];

export default function KMSPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#0EA5E9">Technology · KMS</ProductBadge>
          <HeroTitle>Key management, the way a bank would build it.</HeroTitle>
          <HeroSubtitle>
            Per-tenant isolation, HSM root of trust, policy-engine gating, and a cryptographic
            audit log. Every sign operation is signed twice — once by the key, once by the policy.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact"><CustomButton>Talk to Security</CustomButton></Link>
            <Link href={`${DOCS}/blockchain`} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>KMS Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Key hierarchy</SectionTitle>
          <SectionSubtitle>
            Five classes of keys, five different storage models. A leaf key can never
            compromise the root.
          </SectionSubtitle>
        </SectionHeader>
        <SpecsTable>
          <SpecsRow $header>
            <SpecsLabel $header>Class</SpecsLabel>
            <SpecsLabel $header>Storage / rotation / usage</SpecsLabel>
          </SpecsRow>
          {keyClasses.map((k) => (
            <SpecsRow key={k.cls}>
              <SpecsLabel>{k.cls}</SpecsLabel>
              <SpecsValue>
                <div><strong>Storage:</strong> {k.storage}</div>
                <div><strong>Rotation:</strong> {k.rotation}</div>
                <div style={{ opacity: 0.7 }}>{k.usage}</div>
              </SpecsValue>
            </SpecsRow>
          ))}
        </SpecsTable>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Per-tenant isolation.</BlockTitle>
          <BlockText>
            Every tenant gets a dedicated encryption key at the KMS level, backed by a
            dedicated HSM partition (or full HSM on the Enterprise tier). A compromise of
            tenant A&apos;s key material is mathematically uncorrelated with tenant B.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck><FeatureText>Tenant-scoped KEK per organization</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck><FeatureText>Envelope encryption — per-object DEK, KMS-wrapped</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck><FeatureText>Bring-your-own-key (BYOK): import wrapped keys from AWS KMS / GCP KMS</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck><FeatureText>Hold-your-own-key (HYOK): Enterprise-tier external HSM integration</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Policy engine.</BlockTitle>
          <BlockText>
            A signature isn&apos;t just &quot;can this key sign?&quot; — it&apos;s &quot;should this key sign this
            payload right now?&quot; Every sign request is evaluated by a declarative policy
            engine before the key ever moves.
          </BlockText>
          <SpecsTable>
            {policies.map((p) => (
              <SpecsRow key={p.name}>
                <SpecsLabel>{p.name}</SpecsLabel>
                <SpecsValue>{p.description}</SpecsValue>
              </SpecsRow>
            ))}
          </SpecsTable>
        </ContentBlock>
      </TwoColumnSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Cryptographic audit log</SectionTitle>
          <SectionSubtitle>
            Every sign, every policy evaluation, every rotation — sealed into a
            tamper-evident log.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          <Card $accent="#0EA5E9">
            <CardTitle>Hash-chained</CardTitle>
            <CardDescription>
              Each event commits the previous event hash. Deletion is detectable — you
              can&apos;t quietly remove a suspicious sign.
            </CardDescription>
          </Card>
          <Card $accent="#0EA5E9">
            <CardTitle>Blockchain-anchored</CardTitle>
            <CardDescription>
              Every N events, the log root is committed to the Z-Chain. Tampering requires
              rewriting a public blockchain.
            </CardDescription>
          </Card>
          <Card $accent="#0EA5E9">
            <CardTitle>Customer-replicated</CardTitle>
            <CardDescription>
              Enterprise tenants get a read-only replica of their audit log, signed by
              our KMS — export it for your SIEM.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Open-source stack.</BlockTitle>
          <BlockText>
            Lux KMS builds on <code>github.com/luxfi/kms</code> and the shared Hanzo KMS
            (Infisical-based) at <code>kms.hanzo.ai</code>. Secrets are never stored in
            application databases — apps authenticate to KMS with short-lived JWTs and fetch
            wrapped material at runtime.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck><FeatureText>Universal Auth for service-to-service secret fetching</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck><FeatureText>Zero-knowledge secret encryption — operators can&apos;t read tenant secrets</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck><FeatureText>Automatic rotation hooks for DB credentials, API tokens</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Plays well with:</BlockTitle>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck>
              <FeatureText><Link href="/technology/hsm" style={{ color: "#10B981" }}>HSM</Link> — root of trust for all KEKs</FeatureText>
            </FeatureItem>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck>
              <FeatureText><Link href="/technology/mpc" style={{ color: "#8B5CF6" }}>MPC</Link> — signing keys never reconstructed</FeatureText>
            </FeatureItem>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck>
              <FeatureText><Link href="/technology/post-quantum" style={{ color: "#6366F1" }}>Post-quantum</Link> — ML-KEM wrapping for forward secrecy</FeatureText>
            </FeatureItem>
            <FeatureItem><FeatureCheck $color="#0EA5E9"><CheckIcon /></FeatureCheck>
              <FeatureText><Link href="/compliance" style={{ color: "#10B981" }}>Compliance</Link> — audit log exports for SOC 2 / PCI</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <CTASection>
        <CTATitle>Managed keys. Enforced policy.</CTATitle>
        <CTASubtitle>
          Let Lux manage the hard parts of key lifecycle. Inherit HSM rooting and FIPS
          compliance on day one.
        </CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Security</CustomButton></Link>
          <Link href="https://github.com/luxfi/kms" target="_blank" rel="noopener noreferrer">
            <SecondaryButton>github.com/luxfi/kms</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
