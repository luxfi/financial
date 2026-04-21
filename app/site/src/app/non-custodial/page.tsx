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
  DiagramContainer,
  DiagramRow,
  DiagramNode,
  DiagramArrow,
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

const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const UserIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const NetworkIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="3" />
    <circle cx="4" cy="4" r="2" />
    <circle cx="20" cy="4" r="2" />
    <circle cx="4" cy="20" r="2" />
    <circle cx="20" cy="20" r="2" />
    <path d="M6 6l4 4M18 6l-4 4M6 18l4-4M18 18l-4-4" />
  </svg>
);

const principles = [
  {
    icon: KeyIcon,
    title: "Keys Never Leave the User",
    description:
      "Signing keys are generated on the user device or split across MPC parties. The bank sees ciphertext and signatures — never seed phrases, never plaintext private keys.",
  },
  {
    icon: ShieldIcon,
    title: "Bank as Coordinator, Not Custodian",
    description:
      "Lux routes orders, proves compliance, and records settlement. The user's self-custodied key (or MPC share) is the only thing that can actually move funds.",
  },
  {
    icon: UserIcon,
    title: "You Can Walk Away",
    description:
      "Users export keys, rotate MPC cohorts, or migrate to another wallet at any time. No vendor lock-in. No frozen balances if we disappear.",
  },
  {
    icon: LockIcon,
    title: "Regulated Without Rehypothecation",
    description:
      "Broker-dealer rails, SEC/FINRA reporting, and Travel Rule attestations — all achieved without the platform ever holding plaintext custody of client assets.",
  },
];

const architecture = [
  {
    title: "User Device",
    description:
      "Secure enclave (iOS Secure Enclave, Android StrongBox, TPM, or YubiKey) holds MPC share #1. Biometric or PIN unlock. Never syncs to the cloud.",
  },
  {
    title: "MPC Cohort",
    description:
      "2-of-3 or 3-of-5 CGGMP21 threshold signing. Shares distributed across independent regions + organizational boundaries. No single party can sign alone.",
  },
  {
    title: "HSM Root",
    description:
      "FIPS 140-2 Level 3 HSM holds the deterministic backup share, policy keys, and audit attestation keys. Tamper-evident, geographically replicated.",
  },
  {
    title: "Chain",
    description:
      "Final signature broadcast to Lux Z-Chain / A-Chain / Ethereum. Settlement is on a public ledger — not in our database.",
  },
];

const comparison = [
  {
    label: "Who controls keys?",
    custodial: "The bank (pooled)",
    lux: "User + MPC cohort (threshold)",
  },
  {
    label: "What does the platform see?",
    custodial: "Plaintext balances + addresses",
    lux: "FHE ciphertexts + ZK attestations",
  },
  {
    label: "What happens if we go down?",
    custodial: "Funds frozen",
    lux: "User signs with backup share + recovers",
  },
  {
    label: "Proof of reserves?",
    custodial: "Trust the auditor",
    lux: "On-chain, continuously",
  },
  {
    label: "Can we freeze your account?",
    custodial: "Yes",
    lux: "No — only sanctions screening gates routing",
  },
  {
    label: "Rehypothecation?",
    custodial: "Often (FTX)",
    lux: "Impossible by construction",
  },
];

export default function NonCustodialPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#22C55E">Architecture</ProductBadge>
          <HeroTitle>Non-custodial by construction.</HeroTitle>
          <HeroSubtitle>
            Your keys. Your assets. Our infrastructure. Lux Financial is the
            first regulated bank where plaintext custody of client funds is
            mathematically impossible — the bank physically cannot move your money alone.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Talk to Sales</CustomButton>
            </Link>
            <Link href={`${DOCS}/blockchain`} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>Architecture Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Four Principles</SectionTitle>
          <SectionSubtitle>
            Why non-custodial is the only honest answer after FTX, Celsius, BlockFi, and Voyager.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={4}>
          {principles.map((p) => (
            <Card key={p.title} $accent="#22C55E">
              <CardIcon $color="#22C55E">
                <p.icon />
              </CardIcon>
              <CardTitle>{p.title}</CardTitle>
              <CardDescription>{p.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>The signing path.</BlockTitle>
          <BlockText>
            Every state-changing action on Lux Financial — transfers, trades, withdrawals,
            governance votes — follows the same path: user intent, threshold signing across
            the MPC cohort, HSM-attested policy check, and public ledger settlement.
          </BlockText>
          <FeatureList>
            <FeatureItem>
              <FeatureCheck $color="#22C55E"><CheckIcon /></FeatureCheck>
              <FeatureText>User device generates an MPC share at onboarding — never exported</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E"><CheckIcon /></FeatureCheck>
              <FeatureText>Recovery share is split across 16 independent custodians using Shamir secret sharing</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E"><CheckIcon /></FeatureCheck>
              <FeatureText>Any 16-of-N threshold can recover — no single recovery service can steal keys</FeatureText>
            </FeatureItem>
            <FeatureItem>
              <FeatureCheck $color="#22C55E"><CheckIcon /></FeatureCheck>
              <FeatureText>Compliance policy is a precondition, not a post-hoc override — no admin key</FeatureText>
            </FeatureItem>
          </FeatureList>
        </ContentBlock>
        <DiagramContainer>
          <DiagramRow $center>
            <DiagramNode $type="highlight">User Device (Share 1)</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode>MPC Node A</DiagramNode>
            <DiagramNode>MPC Node B</DiagramNode>
            <DiagramNode>HSM Share</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓ Threshold signature</DiagramArrow>
          <DiagramRow $center>
            <DiagramNode $type="primary">Z-Chain / A-Chain / Ethereum</DiagramNode>
          </DiagramRow>
        </DiagramContainer>
      </TwoColumnSection>

      <Section>
        <SectionHeader>
          <SectionTitle>The Four Layers</SectionTitle>
          <SectionSubtitle>
            Where your key material lives — and where it does not.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={4}>
          {architecture.map((a) => (
            <Card key={a.title}>
              <CardTitle>{a.title}</CardTitle>
              <CardDescription>{a.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Custodial vs Non-Custodial</SectionTitle>
          <SectionSubtitle>
            The difference isn&apos;t marketing — it&apos;s mathematics.
          </SectionSubtitle>
        </SectionHeader>
        <SpecsTable>
          <SpecsRow $header>
            <SpecsLabel $header>Question</SpecsLabel>
            <SpecsLabel $header>Traditional custodian → Lux Financial</SpecsLabel>
          </SpecsRow>
          {comparison.map((c) => (
            <SpecsRow key={c.label}>
              <SpecsLabel>{c.label}</SpecsLabel>
              <SpecsValue>
                <span style={{ opacity: 0.5 }}>{c.custodial}</span>
                <span style={{ margin: "0 0.5rem" }}>→</span>
                <span style={{ color: "#22C55E" }}>{c.lux}</span>
              </SpecsValue>
            </SpecsRow>
          ))}
        </SpecsTable>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>What this unlocks</SectionTitle>
          <SectionSubtitle>
            Non-custodial isn&apos;t just safer — it&apos;s what lets us ship things legacy banks can&apos;t.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          <Link href="/technology/mpc" style={{ textDecoration: "none" }}>
            <Card $accent="#8B5CF6">
              <CardIcon $color="#8B5CF6"><NetworkIcon /></CardIcon>
              <CardTitle>MPC signing</CardTitle>
              <CardDescription>
                CGGMP21 threshold ECDSA and Ringtail threshold ML-DSA. 2-of-3, 3-of-5, or 16-of-N cohorts.
              </CardDescription>
            </Card>
          </Link>
          <Link href="/technology/kms" style={{ textDecoration: "none" }}>
            <Card $accent="#0EA5E9">
              <CardIcon $color="#0EA5E9"><KeyIcon /></CardIcon>
              <CardTitle>KMS &amp; HSM</CardTitle>
              <CardDescription>
                Per-tenant isolation, HSM-backed root of trust, FIPS 140-2 Level 3 modules.
              </CardDescription>
            </Card>
          </Link>
          <Link href="/technology/zap" style={{ textDecoration: "none" }}>
            <Card $accent="#EF4444">
              <CardIcon $color="#EF4444"><ShieldIcon /></CardIcon>
              <CardTitle>ZAP attestations</CardTitle>
              <CardDescription>
                Prove solvency, eligibility, and compliance without ever revealing positions.
              </CardDescription>
            </Card>
          </Link>
          <Link href="/technology/fhe" style={{ textDecoration: "none" }}>
            <Card $accent="#A855F7">
              <CardIcon $color="#A855F7"><LockIcon /></CardIcon>
              <CardTitle>FHE execution</CardTitle>
              <CardDescription>
                CKKS-encrypted orders — the matching engine itself never sees plaintext.
              </CardDescription>
            </Card>
          </Link>
          <Link href="/compliance" style={{ textDecoration: "none" }}>
            <Card $accent="#10B981">
              <CardIcon $color="#10B981"><CheckIcon /></CardIcon>
              <CardTitle>Compliance without custody</CardTitle>
              <CardDescription>
                Travel Rule, OFAC, Reg ATS — satisfied via ZK proofs, not by controlling your keys.
              </CardDescription>
            </Card>
          </Link>
          <Link href="/security" style={{ textDecoration: "none" }}>
            <Card $accent="#F59E0B">
              <CardIcon $color="#F59E0B"><ShieldIcon /></CardIcon>
              <CardTitle>Proof of reserves</CardTitle>
              <CardDescription>
                Continuous on-chain attestation. No quarterly PDFs. No CEX-style blackbox.
              </CardDescription>
            </Card>
          </Link>
        </CardGrid>
      </Section>

      <CTASection>
        <CTATitle>Your keys. Our infrastructure.</CTATitle>
        <CTASubtitle>
          Ship a regulated bank in weeks — without asking users to trust you with their funds.
        </CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Sales</CustomButton></Link>
          <Link href={`${DOCS}/blockchain`} target="_blank" rel="noopener noreferrer">
            <SecondaryButton>Read the Architecture</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
