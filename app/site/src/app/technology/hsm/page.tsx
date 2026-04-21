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

const vendors = [
  { vendor: "AWS CloudHSM", cert: "FIPS 140-2 L3", regions: "16 AWS regions, dedicated single-tenant" },
  { vendor: "Azure Dedicated HSM", cert: "FIPS 140-2 L3", regions: "Thales Luna Network HSM" },
  { vendor: "GCP Cloud HSM", cert: "FIPS 140-2 L3", regions: "Marvell LiquidSec" },
  { vendor: "Thales Luna Network HSM 7", cert: "FIPS 140-2 L3 + Common Criteria EAL4+", regions: "On-prem / colo" },
  { vendor: "YubiHSM 2", cert: "FIPS 140-2 L3 (limited)", regions: "Edge / dev / small cohort" },
];

const uses = [
  { use: "Validator keys (Quasar)", key: "BLS12-381 + ML-DSA", policy: "Sign on consensus votes; rate-limited" },
  { use: "Root CA for mTLS", key: "P-384 ECDSA", policy: "Sign intermediate CAs yearly; never exported" },
  { use: "KMS master KEK", key: "AES-256", policy: "Wraps all tenant DEKs" },
  { use: "Compliance attestation", key: "Ed25519", policy: "Signs SOC 2 / ATS-N log roots" },
  { use: "HSM-backed MPC share", key: "CGGMP21 share (secp256k1)", policy: "One share of treasury cohort; quorum required" },
];

export default function HSMPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#10B981">Technology · HSM</ProductBadge>
          <HeroTitle>Hardware is the root of trust.</HeroTitle>
          <HeroSubtitle>
            FIPS 140-2 Level 3 modules hold keys that cannot be extracted — physical tamper
            opens the module, zeroizes the memory, and leaves an audit trail. Validator keys,
            KMS root keys, and attestation keys never touch RAM outside the HSM.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact"><CustomButton>Talk to Security</CustomButton></Link>
            <Link href={`${DOCS}/blockchain`} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>Architecture Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>What FIPS 140-2 Level 3 actually requires</SectionTitle>
          <SectionSubtitle>
            The certification that regulated banks insist on, broken down.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={4}>
          <Card $accent="#10B981">
            <CardTitle>Tamper-evident</CardTitle>
            <CardDescription>
              Physical enclosure shows evidence of attempted entry; the module zeroizes all
              plaintext CSPs on detection.
            </CardDescription>
          </Card>
          <Card $accent="#10B981">
            <CardTitle>Identity-based auth</CardTitle>
            <CardDescription>
              Every operator authenticates per-session with split-knowledge quorum. No
              shared admin password.
            </CardDescription>
          </Card>
          <Card $accent="#10B981">
            <CardTitle>Trusted path</CardTitle>
            <CardDescription>
              Key material enters/exits only via cryptographically authenticated channels —
              never over unprotected interfaces.
            </CardDescription>
          </Card>
          <Card $accent="#10B981">
            <CardTitle>EFP / EFT</CardTitle>
            <CardDescription>
              Environmental failure protection and test — fault injection via voltage,
              temperature, or timing is defended and logged.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Certified modules we deploy</SectionTitle>
          <SectionSubtitle>
            We deploy across multiple vendors for vendor-diversity; a single vendor CVE
            cannot compromise the validator set.
          </SectionSubtitle>
        </SectionHeader>
        <SpecsTable>
          <SpecsRow $header>
            <SpecsLabel $header>Vendor</SpecsLabel>
            <SpecsLabel $header>Certification / deployment</SpecsLabel>
          </SpecsRow>
          {vendors.map((v) => (
            <SpecsRow key={v.vendor}>
              <SpecsLabel>{v.vendor}</SpecsLabel>
              <SpecsValue>
                <div>{v.cert}</div>
                <div style={{ opacity: 0.7 }}>{v.regions}</div>
              </SpecsValue>
            </SpecsRow>
          ))}
        </SpecsTable>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>What lives in the HSM.</BlockTitle>
          <BlockText>
            The HSM is the last line. Only keys that must never leak live there — everything
            else is wrapped and stored in KMS or MPC cohorts.
          </BlockText>
          <SpecsTable>
            <SpecsRow $header>
              <SpecsLabel $header>Use</SpecsLabel>
              <SpecsLabel $header>Algorithm / policy</SpecsLabel>
            </SpecsRow>
            {uses.map((u) => (
              <SpecsRow key={u.use}>
                <SpecsLabel>{u.use}</SpecsLabel>
                <SpecsValue>
                  <div>{u.key}</div>
                  <div style={{ opacity: 0.7 }}>{u.policy}</div>
                </SpecsValue>
              </SpecsRow>
            ))}
          </SpecsTable>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Operational controls.</BlockTitle>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#10B981"><CheckIcon /></FeatureCheck><FeatureText>Quorum login: m-of-n smart-card operators, no single admin</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#10B981"><CheckIcon /></FeatureCheck><FeatureText>Geographic split: shares of master KEK held in separate data centers</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#10B981"><CheckIcon /></FeatureCheck><FeatureText>Tamper-response: any chassis breach zeroizes all plaintext CSPs</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#10B981"><CheckIcon /></FeatureCheck><FeatureText>Secure firmware updates: signed by vendor + our key, dual-attested</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#10B981"><CheckIcon /></FeatureCheck><FeatureText>Audit export: every op signed into the <Link href="/technology/kms" style={{ color: "#0EA5E9" }}>KMS audit log</Link></FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#10B981"><CheckIcon /></FeatureCheck><FeatureText>Disaster recovery: M-of-N key backup across jurisdictions</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <Section>
        <SectionHeader>
          <SectionTitle>HSM + MPC</SectionTitle>
          <SectionSubtitle>
            The HSM holds one MPC share. This is strictly better than either alone.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          <Card $accent="#10B981">
            <CardTitle>HSM alone</CardTitle>
            <CardDescription>
              Strong per-key security; single point of trust. Vendor compromise or insider
              access can be catastrophic.
            </CardDescription>
          </Card>
          <Card $accent="#8B5CF6">
            <CardTitle>MPC alone</CardTitle>
            <CardDescription>
              No single party holds the key; depends on operational security of every
              share-holder&apos;s environment.
            </CardDescription>
          </Card>
          <Card $accent="#22C55E">
            <CardTitle>HSM + MPC (Lux default)</CardTitle>
            <CardDescription>
              One share lives inside an HSM under quorum access, others across independent
              regions. Attacker needs HSM bypass <em>and</em> enough cohort shares.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <CTASection>
        <CTATitle>Hardware-rooted from day one.</CTATitle>
        <CTASubtitle>Deploy on our HSM fleet or bring your own module (HYOK).</CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Security</CustomButton></Link>
          <Link href="/security"><SecondaryButton>Full Security Overview</SecondaryButton></Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
