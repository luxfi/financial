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

const zapSpecs = [
  { spec: "Proof system", value: "Groth16 over BLS12-381" },
  { spec: "Proof size", value: "~240 bytes" },
  { spec: "Verifier time", value: "~1.5ms on commodity CPU" },
  { spec: "Wire encoding", value: "Binary, tag-length-value, ~100μs over the wire" },
  { spec: "Trusted setup", value: "Per-circuit MPC ceremony (powers of tau + phase 2)" },
  { spec: "Hash / Fiat-Shamir", value: "Poseidon (in-circuit), SHA-256 for interoperability" },
];

const attestations = [
  {
    title: "Accreditation proof",
    description:
      "User proves they&apos;re a Reg D 506(c) accredited investor without revealing income, net worth, or employer. Renewed every 90 days.",
  },
  {
    title: "Sanctions-clear",
    description:
      "Proves the counterparty address is not in the OFAC SDN / EU / UK / UN / HMT lists at timestamp T, without revealing the address.",
  },
  {
    title: "Solvency (proof of reserves)",
    description:
      "Custodian proves total liabilities ≤ total on-chain assets, with per-user Merkle-sum inclusion, without revealing individual balances.",
  },
  {
    title: "KYC attestation (Travel Rule)",
    description:
      "Originator VASP proves FATF-compliant KYC data exists for sender; receiver VASP verifies without receiving the data itself.",
  },
  {
    title: "Jurisdiction proof",
    description:
      "User proves residency in an allowed jurisdiction without revealing their specific country or address.",
  },
  {
    title: "Eligibility (age, income, profession)",
    description:
      "Age ≥ 18, income bracket, licensed-professional status — proven as a predicate, not disclosed.",
  },
];

export default function ZAPPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#EF4444">Technology · ZAP</ProductBadge>
          <HeroTitle>Prove it. Don&apos;t reveal it.</HeroTitle>
          <HeroSubtitle>
            The Zero-knowledge Attestation Protocol is how we satisfy regulators, counterparties,
            and auditors without ever disclosing the underlying data. Groth16 proofs, ~240 bytes,
            ~100μs wire — the network layer for confidential compliance.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
            <Link href={`${DOCS}/zap`} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>ZAP Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Why a wire-level attestation protocol.</BlockTitle>
          <BlockText>
            Every financial action needs a stack of proofs: you&apos;re KYC&apos;d, you&apos;re solvent,
            the counterparty isn&apos;t sanctioned, the offering is exempt. Traditional systems
            move the plaintext data between parties — leaking information, creating copies
            to protect. ZAP moves proofs instead.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#EF4444"><CheckIcon /></FeatureCheck><FeatureText>One protocol for all attestations — KYC, accreditation, solvency, sanctions</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#EF4444"><CheckIcon /></FeatureCheck><FeatureText>Batch-verifiable — 1000 proofs in &lt;20ms</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#EF4444"><CheckIcon /></FeatureCheck><FeatureText>Regulator can verify without access to underlying data</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#EF4444"><CheckIcon /></FeatureCheck><FeatureText>On-chain via EVM precompile (0x0200) or off-chain for private flows</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Specs.</BlockTitle>
          <SpecsTable>
            {zapSpecs.map((s) => (
              <SpecsRow key={s.spec}>
                <SpecsLabel>{s.spec}</SpecsLabel>
                <SpecsValue>{s.value}</SpecsValue>
              </SpecsRow>
            ))}
          </SpecsTable>
        </ContentBlock>
      </TwoColumnSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Attestation circuits</SectionTitle>
          <SectionSubtitle>
            Six standard ZAP circuits. Every one of them maps to a regulatory requirement
            that would otherwise demand plaintext data sharing.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          {attestations.map((a) => (
            <Card key={a.title} $accent="#EF4444">
              <CardTitle>{a.title}</CardTitle>
              <CardDescription>{a.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Z-Chain &amp; A-Chain</SectionTitle>
          <SectionSubtitle>
            Two dedicated privacy-preserving settlement lanes where ZAP is first-class.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={2}>
          <Card $accent="#EF4444">
            <CardTitle>Z-Chain — confidential settlement</CardTitle>
            <CardDescription>
              UTXO-style privacy lane. Amounts and counterparties are hidden; validity proven
              by ZK circuits. Regulatory view keys available for approved auditors. Same
              consensus and validator set as public chain.
            </CardDescription>
          </Card>
          <Card $accent="#EF4444">
            <CardTitle>A-Chain — attestation substrate</CardTitle>
            <CardDescription>
              Account-model chain optimized for ZAP attestation anchoring. Compliance
              attestations, proof-of-reserves commitments, and sanctions snapshots anchor here
              — keeping the high-TPS trading chain lean.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Interop with FHE.</BlockTitle>
          <BlockText>
            <Link href="/technology/fhe" style={{ color: "#A855F7" }}>FHE</Link> keeps the input
            data encrypted; ZAP proves the computation on it was correct. Every encrypted
            match, risk calc, and compliance check emits a ZAP proof that regulators can
            verify without ever receiving the plaintext.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#EF4444"><CheckIcon /></FeatureCheck><FeatureText>Encrypted trade match → ZK proof of valid fill</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#EF4444"><CheckIcon /></FeatureCheck><FeatureText>Encrypted portfolio VaR → ZK proof of limit compliance</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#EF4444"><CheckIcon /></FeatureCheck><FeatureText>Encrypted compliance screen → ZK proof of not-on-list</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Wire protocol.</BlockTitle>
          <BlockText>
            ZAP is a binary protocol, designed for HFT-grade latency. Tag-length-value
            encoding; no JSON, no base64, no protobuf reflection. Ships in the same
            UDP/QUIC channel as FIX traffic.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#EF4444"><CheckIcon /></FeatureCheck><FeatureText>~100μs proof verify at the FIX gateway</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#EF4444"><CheckIcon /></FeatureCheck><FeatureText>QUIC multiplexing — proofs don&apos;t block orders</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#EF4444"><CheckIcon /></FeatureCheck><FeatureText>Pre-computed proofs cached at the edge for repeat attestations</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <CTASection>
        <CTATitle>Attest without exposing.</CTATitle>
        <CTASubtitle>
          Ship regulated products where compliance is cryptographic, not paperwork.
        </CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
          <Link href={`${DOCS}/zap`} target="_blank" rel="noopener noreferrer">
            <SecondaryButton>ZAP Docs</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
