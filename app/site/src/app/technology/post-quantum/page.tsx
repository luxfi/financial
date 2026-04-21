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

const standards = [
  { std: "FIPS 203 (ML-KEM, Kyber)", kind: "Key encapsulation", role: "TLS handshake, KMS wrapping, MPC transport" },
  { std: "FIPS 204 (ML-DSA, Dilithium)", kind: "Digital signature (lattice)", role: "Quasar consensus, transaction signatures, JWT" },
  { std: "FIPS 205 (SLH-DSA, SPHINCS+)", kind: "Hash-based signature", role: "Long-term root CA, backup signer, stateless" },
  { std: "Ringtail (research)", kind: "Threshold ML-DSA (N=768)", role: "192-bit threshold signing — our contribution" },
];

const threats = [
  {
    title: "Harvest now, decrypt later",
    description:
      "Nation-state adversaries can record encrypted traffic today and decrypt it with CRQCs (cryptographically-relevant quantum computers) in 10-15 years. Classical TLS (ECDHE / RSA-KEM) is already dead for any data with a 10+ year confidentiality horizon.",
  },
  {
    title: "Blockchain signatures",
    description:
      "Every secp256k1 signature on chain reveals the public key. A CRQC extracting the private key from the public key gives arbitrary spend capability — retroactively. We sign every block with both ECDSA and ML-DSA.",
  },
  {
    title: "Long-term records",
    description:
      "Compliance logs, client onboarding data, contract signatures need to survive the transition. We store all long-term records signed with SLH-DSA hash-based signatures — only preimage resistance is assumed.",
  },
];

export default function PostQuantumPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#6366F1">Technology · Post-Quantum</ProductBadge>
          <HeroTitle>Quantum-safe. Today.</HeroTitle>
          <HeroSubtitle>
            Every NIST standard, implemented. ML-KEM for key exchange, ML-DSA for
            signatures, SLH-DSA for long-term roots, and Ringtail for threshold
            post-quantum signing. We don&apos;t wait for the quantum threat — we already outran it.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact"><CustomButton>Talk to Cryptography</CustomButton></Link>
            <Link href={`${DOCS}/quantum`} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>Quantum Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>The four pillars</SectionTitle>
          <SectionSubtitle>
            NIST finalized FIPS 203/204/205 in August 2024. We shipped all three the same month.
          </SectionSubtitle>
        </SectionHeader>
        <SpecsTable>
          <SpecsRow $header>
            <SpecsLabel $header>Standard</SpecsLabel>
            <SpecsLabel $header>Kind / where we use it</SpecsLabel>
          </SpecsRow>
          {standards.map((s) => (
            <SpecsRow key={s.std}>
              <SpecsLabel>{s.std}</SpecsLabel>
              <SpecsValue>
                <div>{s.kind}</div>
                <div style={{ opacity: 0.7 }}>{s.role}</div>
              </SpecsValue>
            </SpecsRow>
          ))}
        </SpecsTable>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Threat model</SectionTitle>
          <SectionSubtitle>
            What a capable quantum adversary actually breaks — and why it matters now.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          {threats.map((t) => (
            <Card key={t.title} $accent="#6366F1">
              <CardTitle>{t.title}</CardTitle>
              <CardDescription>{t.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Hybrid everywhere.</BlockTitle>
          <BlockText>
            We never throw away classical crypto — we combine it. Every TLS handshake is
            X25519 + ML-KEM-768. Every block signature is BLS + ML-DSA-65. A future break
            of either family alone leaves the stack intact. A break of both is still harder
            than breaking either.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#6366F1"><CheckIcon /></FeatureCheck><FeatureText>TLS 1.3: X25519-ML-KEM-768 hybrid (NIST SP 800-227 draft)</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#6366F1"><CheckIcon /></FeatureCheck><FeatureText>Noise_XK + ML-KEM for P2P between validators</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#6366F1"><CheckIcon /></FeatureCheck><FeatureText>Consensus: BLS12-381 + ML-DSA-65 dual signatures</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#6366F1"><CheckIcon /></FeatureCheck><FeatureText>Account signatures: secp256k1 + optional ML-DSA attestation</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Ringtail — our contribution.</BlockTitle>
          <BlockText>
            Threshold post-quantum signing was an open problem: ML-DSA is not naturally
            thresholdable. Ringtail is our lattice-based threshold signature scheme with
            N=768, non-interactive aggregation, and 192-bit security. Open-sourced,
            audited, already running in production.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#6366F1"><CheckIcon /></FeatureCheck><FeatureText>192-bit post-quantum security level</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#6366F1"><CheckIcon /></FeatureCheck><FeatureText>Non-interactive threshold (t-of-n) aggregation</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#6366F1"><CheckIcon /></FeatureCheck><FeatureText>Used for Quasar validator signatures</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#6366F1"><CheckIcon /></FeatureCheck><FeatureText>Runs in the same <Link href="/technology/mpc" style={{ color: "#8B5CF6" }}>MPC</Link> cohort as CGGMP21</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <Section>
        <SectionHeader>
          <SectionTitle>EVM precompiles</SectionTitle>
          <SectionSubtitle>
            Smart contracts can verify post-quantum signatures natively — no expensive circuit-in-EVM emulation.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          <Card $accent="#6366F1">
            <CardTitle>0x0100: ML-DSA verify</CardTitle>
            <CardDescription>
              FIPS 204 verify at ~50k gas. Drop-in for ecrecover-style flows needing PQ signatures.
            </CardDescription>
          </Card>
          <Card $accent="#6366F1">
            <CardTitle>0x0101: ML-KEM encapsulate</CardTitle>
            <CardDescription>
              Sealed-message patterns on chain. Clients post ML-KEM ciphertexts; contracts verify integrity.
            </CardDescription>
          </Card>
          <Card $accent="#6366F1">
            <CardTitle>0x0102: SLH-DSA verify</CardTitle>
            <CardDescription>
              Stateless hash-based signature verify. ~180k gas but hash-only security assumption.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <CTASection>
        <CTATitle>Quantum-safe is a shipping concern, not a research one.</CTATitle>
        <CTASubtitle>
          Sign your contracts, bridge your assets, and settle your trades with
          post-quantum crypto available today.
        </CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Cryptography</CustomButton></Link>
          <Link href="https://github.com/luxfi/crypto" target="_blank" rel="noopener noreferrer">
            <SecondaryButton>github.com/luxfi/crypto</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
