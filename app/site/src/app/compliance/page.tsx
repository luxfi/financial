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
  CardIcon,
  CardTitle,
  CardDescription,
  SpecsTable,
  SpecsRow,
  SpecsLabel,
  SpecsValue,
  CTASection,
  CTATitle,
  CTASubtitle,
} from "../products/styles";

const DOCS = "https://docs.lux.financial/docs";

const CheckIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const GavelIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2l8 8-4 4-8-8 4-4zM10 6L2 14l8 8 8-8" />
  </svg>
);

const FileIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
    <polyline points="14 2 14 8 20 8" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const EyeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const jurisdictions = [
  { region: "United States", regulators: "SEC, FINRA, FinCEN, OCC", rails: "Reg ATS (Form ATS-N), Reg D/CF/S/A+, OATS/CAT reporting, MSB" },
  { region: "United Kingdom", regulators: "FCA", rails: "MLR 2017, EMI / PI authorization, Travel Rule, PS23/6" },
  { region: "Luxembourg", regulators: "CSSF", rails: "MiCA crypto-asset service provider, AIFMD, PSD2" },
  { region: "Isle of Man", regulators: "FSA", rails: "Designated Businesses Act, Class 8 crypto business license" },
  { region: "Liechtenstein", regulators: "FMA", rails: "Blockchain Act (TVTG), Token & Trusted Technology Service Provider" },
  { region: "Bermuda", regulators: "BMA", rails: "Digital Asset Business Act (DABA) Class M / Class F" },
];

const accreditation = [
  { tier: "Reg D 506(b)", limit: "Unlimited accredited + 35 sophisticated", sale: "No general solicitation" },
  { tier: "Reg D 506(c)", limit: "Accredited only, verified", sale: "General solicitation allowed" },
  { tier: "Reg CF", limit: "$5M / 12 months", sale: "Non-accredited OK, investment limits per income" },
  { tier: "Reg A+ Tier 2", limit: "$75M / 12 months", sale: "Non-accredited, SEC-qualified offering circular" },
  { tier: "Reg S", limit: "Offshore only, no US persons", sale: "6 / 12 / 40-day distribution periods" },
];

const pipeline = [
  {
    icon: EyeIcon,
    title: "Identity (KYC)",
    description:
      "Jumio + Onfido document verification, liveness check, and biometric matching. 200+ country coverage, 5,000+ document types.",
  },
  {
    icon: GlobeIcon,
    title: "Sanctions &amp; PEP",
    description:
      "Continuous OFAC SDN, EU, UK, UN, HMT, and PEP screening against Chainalysis and Refinitiv World-Check. Re-scored on every transaction.",
  },
  {
    icon: FileIcon,
    title: "Chain Analytics",
    description:
      "Chainalysis KYT + TRM Labs risk scoring on every address. Mixer, sanctioned-entity, and high-risk-cluster detection before settlement.",
  },
  {
    icon: GavelIcon,
    title: "Accreditation",
    description:
      "506(c) verified-accredited workflow (income, net-worth, licensed-professional). Investment-limit enforcement for Reg CF / Reg A+.",
  },
];

const filings = [
  { name: "Form ATS-N", description: "Alternative Trading System operator disclosure" },
  { name: "OATS / CAT", description: "Order audit trail reporting to FINRA / CAT" },
  { name: "SAR / CTR", description: "Suspicious Activity &amp; Currency Transaction reports" },
  { name: "FBAR / 8938", description: "Foreign account reporting automation for US tax" },
  { name: "Form D", description: "Reg D exempt-offering notice filing" },
  { name: "1042-S / 1099", description: "Automated year-end tax form generation" },
];

export default function CompliancePage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#10B981">Compliance</ProductBadge>
          <HeroTitle>Regulated in 6+ jurisdictions.</HeroTitle>
          <HeroSubtitle>
            KYC, AML, sanctions, Travel Rule, Reg ATS, OATS/CAT, and cross-border
            tax reporting — delivered as SDK calls. You focus on product; our compliance
            engine handles the filings.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact"><CustomButton>Talk to Compliance</CustomButton></Link>
            <Link href={`${DOCS}/compliance-full`} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>Compliance Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Jurisdictions &amp; licenses</SectionTitle>
          <SectionSubtitle>
            Live in the US; licensed, passported, or partnering across Europe, the Crown
            Dependencies, and offshore financial centers.
          </SectionSubtitle>
        </SectionHeader>
        <SpecsTable>
          <SpecsRow $header>
            <SpecsLabel $header>Region</SpecsLabel>
            <SpecsLabel $header>Regulators &amp; rails</SpecsLabel>
          </SpecsRow>
          {jurisdictions.map((j) => (
            <SpecsRow key={j.region}>
              <SpecsLabel>{j.region} — <span style={{ opacity: 0.6 }}>{j.regulators}</span></SpecsLabel>
              <SpecsValue>{j.rails}</SpecsValue>
            </SpecsRow>
          ))}
        </SpecsTable>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Onboarding pipeline</SectionTitle>
          <SectionSubtitle>
            Four independent providers, one unified result. Sub-90-second median onboarding for retail.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={4}>
          {pipeline.map((p) => (
            <Card key={p.title} $accent="#10B981">
              <CardIcon $color="#10B981"><p.icon /></CardIcon>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Securities exemptions — enforced in code.</BlockTitle>
          <BlockText>
            Every offering and secondary trade is tagged with its exempting regulation.
            The matching engine refuses orders that would breach holding periods, investor
            caps, or jurisdictional bans. The audit log proves it.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#10B981"><CheckIcon /></FeatureCheck>
              <FeatureText>ERC-1400 transfer restrictions enforced on-chain</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#10B981"><CheckIcon /></FeatureCheck>
              <FeatureText>Reg D 506(c) verified-accredited status refreshed every 90 days</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#10B981"><CheckIcon /></FeatureCheck>
              <FeatureText>Reg S offshore-only geofence + 40-day distribution lock</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#10B981"><CheckIcon /></FeatureCheck>
              <FeatureText>Rule 144 resale tracking and restricted-legend management</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
        <SpecsTable>
          <SpecsRow $header>
            <SpecsLabel $header>Exemption</SpecsLabel>
            <SpecsLabel $header>Limit / eligibility</SpecsLabel>
          </SpecsRow>
          {accreditation.map((a) => (
            <SpecsRow key={a.tier}>
              <SpecsLabel>{a.tier}</SpecsLabel>
              <SpecsValue>
                <div>{a.limit}</div>
                <div style={{ fontSize: "1.2rem", opacity: 0.7 }}>{a.sale}</div>
              </SpecsValue>
            </SpecsRow>
          ))}
        </SpecsTable>
      </TwoColumnSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Automated filings</SectionTitle>
          <SectionSubtitle>
            Every trade, movement, and investor action is structured for direct export
            to regulators — no month-end scramble.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          {filings.map((f) => (
            <Card key={f.name} $accent="#22C55E">
              <CardTitle>{f.name}</CardTitle>
              <CardDescription>{f.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Travel Rule — via ZK attestation.</BlockTitle>
          <BlockText>
            FATF Recommendation 16 requires originator / beneficiary data sharing on
            crypto transfers &gt; $1k. Lux satisfies it without leaking counterparty
            information by using <Link href="/technology/zap" style={{ color: "#EF4444" }}>ZAP</Link> proofs:
            the receiving VASP learns that KYC data exists and is valid, not what it contains.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#22C55E"><CheckIcon /></FeatureCheck>
              <FeatureText>Sumsub / Notabene / TRP interoperability for legacy VASPs</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E"><CheckIcon /></FeatureCheck>
              <FeatureText>IVMS 101 data schema with selective disclosure</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E"><CheckIcon /></FeatureCheck>
              <FeatureText>Groth16 attestation: ~240-byte proof, verifies in &lt;1ms</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Proof of reserves — on every block.</BlockTitle>
          <BlockText>
            Because Lux Financial is
            <Link href="/non-custodial" style={{ color: "#22C55E" }}> non-custodial</Link>,
            there is nothing to hide: client holdings are on public chains, settlement
            is public, and every account exposes a continuous Merkle-sum proof-of-liabilities.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#22C55E"><CheckIcon /></FeatureCheck>
              <FeatureText>Public Merkle-sum tree — any client can verify inclusion</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E"><CheckIcon /></FeatureCheck>
              <FeatureText>No rehypothecation — MPC signatures required for any movement</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E"><CheckIcon /></FeatureCheck>
              <FeatureText>Third-party attestation by SOC 2 Type II auditor, annually</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <CTASection>
        <CTATitle>Ship regulated. Ship today.</CTATitle>
        <CTASubtitle>
          Get on our broker-dealer network, inherit our compliance stack, and go live in weeks.
        </CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Compliance</CustomButton></Link>
          <Link href={`${DOCS}/compliance-full`} target="_blank" rel="noopener noreferrer">
            <SecondaryButton>Read the Docs</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
