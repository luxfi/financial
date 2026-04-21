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
  CTASection,
  CTATitle,
  CTASubtitle,
} from "../products/styles";

const DOCS = "https://docs.lux.financial/docs";

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const KeyIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" />
  </svg>
);
const LockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="11" rx="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);
const ChipIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);
const CircuitIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="2" />
    <path d="M12 4v4M12 16v4M4 12h4M16 12h4" />
  </svg>
);
const AtomIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="1" />
    <ellipse cx="12" cy="12" rx="10" ry="4" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
    <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
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
const AgentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4M8 16h.01M16 16h.01" />
  </svg>
);
const GpuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
  </svg>
);

const layers = [
  { icon: KeyIcon, title: "MPC", desc: "CGGMP21 threshold signing. 2-of-3, 3-of-5, 16-of-N. No single party can sign.", href: "/technology/mpc", color: "#8B5CF6" },
  { icon: LockIcon, title: "KMS", desc: "Per-tenant key vaults with policy engine and audit. HSM-rooted.", href: "/technology/kms", color: "#0EA5E9" },
  { icon: ChipIcon, title: "HSM", desc: "FIPS 140-2 Level 3 hardware modules for root keys and validator keys.", href: "/technology/hsm", color: "#10B981" },
  { icon: CircuitIcon, title: "FHE", desc: "CKKS ring-14, 8 mult levels. Matching and risk checks on ciphertext.", href: "/technology/fhe", color: "#A855F7" },
  { icon: AtomIcon, title: "Post-Quantum", desc: "ML-DSA (FIPS 204), ML-KEM (FIPS 203), SLH-DSA (FIPS 205), Ringtail.", href: "/technology/post-quantum", color: "#6366F1" },
  { icon: ShieldIcon, title: "ZAP", desc: "Zero-knowledge Attestation Protocol. Groth16, ~100μs wire.", href: "/technology/zap", color: "#EF4444" },
  { icon: GpuIcon, title: "GPU Engine", desc: "434M orders/sec parallel matching. CUDA-accelerated EVM and DEX.", href: "/technology/gpu", color: "#FF6B6B" },
  { icon: AgentIcon, title: "MCP", desc: "Every endpoint callable by AI agents via Model Context Protocol.", href: "/technology/mcp", color: "#22D3EE" },
];

export default function TechnologyPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#8B5CF6">Technology</ProductBadge>
          <HeroTitle>The stack underneath.</HeroTitle>
          <HeroSubtitle>
            Eight engineered layers, each one auditable, each one optional. Bring your own
            HSM; plug into our MPC cohort; route trades through our FHE coprocessor.
            One architecture, any deployment.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
            <Link href={DOCS} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>Browse Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Stack at a glance</SectionTitle>
          <SectionSubtitle>
            Client request → identity → policy → execution → settlement. Every layer is
            cryptographically bound to the next.
          </SectionSubtitle>
        </SectionHeader>
        <DiagramContainer>
          <DiagramRow>
            <DiagramNode>Client SDK</DiagramNode>
            <DiagramNode $type="primary">MCP / REST / WS / FIX</DiagramNode>
            <DiagramNode>Gateway (JWT)</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode>KYC &amp; Sanctions</DiagramNode>
            <DiagramNode>Policy Engine</DiagramNode>
            <DiagramNode>ZAP Attestation</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode $type="highlight">CLOB (CEX)</DiagramNode>
            <DiagramNode $type="highlight">AMM/DEX</DiagramNode>
            <DiagramNode $type="highlight">FHE Match</DiagramNode>
            <DiagramNode $type="highlight">GPU Engine</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓</DiagramArrow>
          <DiagramRow>
            <DiagramNode>MPC Cohort</DiagramNode>
            <DiagramNode>HSM Root</DiagramNode>
            <DiagramNode>KMS Policy</DiagramNode>
          </DiagramRow>
          <DiagramArrow>↓ Quasar triple-proof finality</DiagramArrow>
          <DiagramRow>
            <DiagramNode $type="primary">Z-Chain</DiagramNode>
            <DiagramNode $type="primary">A-Chain</DiagramNode>
            <DiagramNode $type="primary">Ethereum / L2s</DiagramNode>
          </DiagramRow>
        </DiagramContainer>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Layers, in depth</SectionTitle>
          <SectionSubtitle>
            Click through for the design rationale, specs, and failure model of each layer.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={4}>
          {layers.map((l) => (
            <Link key={l.title} href={l.href} style={{ textDecoration: "none" }}>
              <Card $accent={l.color}>
                <CardIcon $color={l.color}><l.icon /></CardIcon>
                <CardTitle>{l.title}</CardTitle>
                <CardDescription>{l.desc}</CardDescription>
              </Card>
            </Link>
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Consensus: Quasar</SectionTitle>
          <SectionSubtitle>
            Triple-proof quantum finality — every block carries a BLS aggregate, an ML-DSA
            (FIPS 204) post-quantum signature, and a Ringtail threshold signature.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          <Card $accent="#8B5CF6">
            <CardTitle>BLS12-381 aggregate</CardTitle>
            <CardDescription>
              Classical fast path — single 48-byte signature proves N-of-M validator consent. Verifies in ~200μs.
            </CardDescription>
          </Card>
          <Card $accent="#6366F1">
            <CardTitle>ML-DSA (Dilithium-3)</CardTitle>
            <CardDescription>
              FIPS 204 post-quantum signature. 3.3 KB payload, lattice-based, NIST-approved
              since August 2024.
            </CardDescription>
          </Card>
          <Card $accent="#EC4899">
            <CardTitle>Ringtail (N=768)</CardTitle>
            <CardDescription>
              192-bit post-quantum threshold signature. Non-interactive, aggregate-verifiable,
              lattice-based — our own research, open-sourced.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <CTASection>
        <CTATitle>Dive deeper.</CTATitle>
        <CTASubtitle>
          Every layer has a whitepaper, an audit report, and a reference implementation on GitHub.
        </CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
          <Link href="https://github.com/luxfi" target="_blank" rel="noopener noreferrer">
            <SecondaryButton>github.com/luxfi</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
