"use client";
import Link from "next/link";
import styled from "styled-components";

// Research page — cross-links every published paper across Lux, Hanzo, Zoo.
// Papers grouped by research domain. Each entry links to the canonical PDF
// on github.com/<org>/papers.

type Paper = {
  title: string;
  slug: string;
  org: "luxfi" | "hanzoai" | "zooai";
  authors?: string;
};

type Domain = {
  name: string;
  summary: string;
  papers: readonly Paper[];
};

const DOMAINS: readonly Domain[] = [
  {
    name: "Consensus",
    summary: "Byzantine-fault-tolerant consensus protocols, metastable sampling, and physics-inspired finality.",
    papers: [
      { title: "The Lux Network", slug: "lux-whitepaper", org: "luxfi" },
      { title: "Lux Consensus: Physics-Inspired Metastable Blockchain Consensus", slug: "lux-consensus", org: "luxfi" },
      { title: "Quasar: Quantum-Secure Multi-Engine Consensus with Triple-Proof Quantum Finality", slug: "lux-quasar-consensus", org: "luxfi" },
      { title: "Quasar Benchmarks", slug: "lux-quasar-benchmarks", org: "luxfi" },
      { title: "Lux FPC Consensus", slug: "lux-fpc-consensus", org: "luxfi" },
      { title: "Quantum Consensus Protocol (LP-307)", slug: "lp-307-quantum-consensus-protocol", org: "luxfi" },
      { title: "Triple-Proof Consensus", slug: "lux-triple-proof-consensus", org: "luxfi" },
      { title: "Quasar Hybrid Consensus on Zoo Network", slug: "zoo-consensus", org: "zooai" },
    ],
  },
  {
    name: "Post-Quantum Cryptography",
    summary: "NIST-standardized lattice cryptography, hybrid certificates, and quantum-secure asset custody.",
    papers: [
      { title: "ETHFALCON: EVM-Optimized Post-Quantum Signatures", slug: "lux-ethfalcon-post-quantum", org: "luxfi" },
      { title: "Ringtail: Lattice-Based Post-Quantum Threshold Signatures", slug: "lux-ringtail-pq", org: "luxfi" },
      { title: "Lattice Cryptography Primer", slug: "lux-lattice-cryptography-primer", org: "luxfi" },
      { title: "Hybrid PQ Architecture", slug: "lux-hybrid-pq-architecture", org: "luxfi" },
      { title: "Hybrid Certificates", slug: "lux-hybrid-certificates", org: "luxfi" },
      { title: "Lux Crypto Agility", slug: "lux-crypto-agility", org: "luxfi" },
      { title: "PQ Migration", slug: "lux-pq-migration", org: "luxfi" },
      { title: "Quantum Threat to Blockchain", slug: "lux-quantum-threat-blockchain", org: "luxfi" },
      { title: "Quantum Secure Assets (LP-305)", slug: "lp-305-quantum-secure-assets", org: "luxfi" },
      { title: "Post-Quantum Securities", slug: "post-quantum-securities", org: "luxfi" },
      { title: "Hanzo Post-Quantum Cryptography", slug: "hanzo-pq-crypto", org: "hanzoai" },
    ],
  },
  {
    name: "Threshold / MPC",
    summary: "Multi-party computation for custody, omnichain signing, and distributed key generation.",
    papers: [
      { title: "Unified Threshold Cryptography for Omnichain Asset Custody", slug: "lux-threshold-mpc", org: "luxfi" },
      { title: "Universal Threshold Signatures", slug: "lux-universal-threshold-signatures", org: "luxfi" },
      { title: "Lux LSS MPC", slug: "lux-lss-mpc", org: "luxfi" },
      { title: "Validator MPC", slug: "lux-validator-mpc", org: "luxfi" },
      { title: "Threshold UX", slug: "lux-threshold-ux", org: "luxfi" },
      { title: "MChain MPC", slug: "lux-mchain-mpc", org: "luxfi" },
      { title: "MPC Custody", slug: "mpc-custody", org: "luxfi" },
      { title: "Hanzo Threshold Signing", slug: "hanzo-threshold-signing", org: "hanzoai" },
      { title: "Zoo MPC: Threshold Custody for AI Model Weights", slug: "zoo-mpc-custody", org: "zooai" },
    ],
  },
  {
    name: "FHE / Privacy",
    summary: "Fully homomorphic encryption, encrypted execution environments, and privacy-preserving compute.",
    papers: [
      { title: "FHE API and Developer Model for Practical Private Applications", slug: "lux-fhe-api", org: "luxfi" },
      { title: "FHE Benchmarks", slug: "lux-fhe-benchmarks", org: "luxfi" },
      { title: "FHE Smart Contracts", slug: "lux-fhe-smart-contracts", org: "luxfi" },
      { title: "FHE-MPC Hybrid", slug: "lux-fhe-mpc-hybrid", org: "luxfi" },
      { title: "Lux TFHE", slug: "lux-tfhe", org: "luxfi" },
      { title: "Threshold FHE Compliance", slug: "threshold-fhe-compliance", org: "luxfi" },
      { title: "Privacy Pool", slug: "lux-privacy-pool", org: "luxfi" },
      { title: "Hanzo FHE Inference", slug: "hanzo-fhe-inference", org: "hanzoai" },
      { title: "Zoo FHE: Privacy-Preserving AI Training and Inference", slug: "zoo-fhe-ai", org: "zooai" },
    ],
  },
  {
    name: "Bridge & Interop",
    summary: "Trustless cross-chain asset transfer, light-client verification, and omnichain messaging.",
    papers: [
      { title: "Teleport Protocol: Trustless Cross-Chain Asset Transfer", slug: "lux-teleport-protocol", org: "luxfi" },
      { title: "Teleport Architecture", slug: "lux-teleport-architecture", org: "luxfi" },
      { title: "Teleport Omnichain", slug: "lux-teleport-omnichain", org: "luxfi" },
      { title: "Warp Messaging", slug: "lux-warp-messaging", org: "luxfi" },
      { title: "Lux Bridge", slug: "lux-bridge", org: "luxfi" },
      { title: "Cross-Chain Security", slug: "lux-cross-chain-security", org: "luxfi" },
      { title: "Omnichain Explorer (LP-103)", slug: "lp-103-omnichain-explorer", org: "luxfi" },
    ],
  },
  {
    name: "DeFi & Exchange",
    summary: "On-chain trading infrastructure, market making, lending, and derivatives.",
    papers: [
      { title: "Lux Lightspeed DEX: HFT at the Speed of Light", slug: "lux-lightspeed-dex", org: "luxfi" },
      { title: "Smart Order Routing", slug: "lux-smart-order-routing", org: "luxfi" },
      { title: "Perpetuals & Derivatives", slug: "lux-perpetuals-derivatives", org: "luxfi" },
      { title: "Liquid Staking", slug: "lux-liquid-staking", org: "luxfi" },
      { title: "Restaking", slug: "lux-restaking", org: "luxfi" },
      { title: "Credit Protocol Spec", slug: "lux-credit-protocol-spec", org: "luxfi" },
      { title: "Credit Lending", slug: "lux-credit-lending", org: "luxfi" },
      { title: "Omnichain Yield", slug: "lux-omnichain-yield", org: "luxfi" },
      { title: "Sovereign DeFi", slug: "lux-sovereign-defi", org: "luxfi" },
      { title: "Hamiltonian Market Maker (HMM)", slug: "hanzo-hmm", org: "hanzoai" },
      { title: "Zoo DEX: Decentralized Exchange for AI Assets", slug: "zoo-dex", org: "zooai" },
    ],
  },
  {
    name: "Securities & ATS",
    summary: "Regulated digital securities, transfer agent operations, and compliance architecture.",
    papers: [
      { title: "Non-Custodial Blockchain ATS", slug: "lux-ats-architecture", org: "luxfi" },
      { title: "Security Token Standard", slug: "lux-security-token-standard", org: "luxfi" },
      { title: "Market NFT", slug: "lux-market-nft", org: "luxfi" },
    ],
  },
  {
    name: "EVM & Execution",
    summary: "Custom precompiles, GPU-accelerated execution, formal VM analysis.",
    papers: [
      { title: "Custom EVM Precompiles for Cryptographic Operations", slug: "lux-evm-precompiles", org: "luxfi" },
      { title: "EVM Precompile Engineering", slug: "lux-evm-precompile-engineering", org: "luxfi" },
      { title: "GPU EVM Whitepaper", slug: "gpu-evm-whitepaper", org: "luxfi" },
      { title: "EVM-GPU Benchmark", slug: "evmgpu-benchmark", org: "luxfi" },
      { title: "DAG-EVM Formal", slug: "dag-evm-formal", org: "luxfi" },
      { title: "Verkle Trees", slug: "lux-verkle-trees", org: "luxfi" },
    ],
  },
  {
    name: "Networking & ZAP",
    summary: "Zero-allocation protocols, secure messaging, and photon-speed transport.",
    papers: [
      { title: "Agentic Consensus (ZAP)", slug: "lux-agentic-consensus-zap", org: "luxfi" },
      { title: "ZAP Benchmarks", slug: "lux-zap-benchmarks", org: "luxfi" },
      { title: "Secure Messaging", slug: "lux-secure-messaging", org: "luxfi" },
      { title: "Photon Protocol", slug: "lux-photon-protocol", org: "luxfi" },
      { title: "Ray Protocol", slug: "lux-ray-protocol", org: "luxfi" },
      { title: "Prism Protocol", slug: "lux-prism-protocol", org: "luxfi" },
      { title: "Wave Protocol", slug: "lux-wave-protocol", org: "luxfi" },
    ],
  },
  {
    name: "Security & Formal Verification",
    summary: "Symbolic execution, model checking, and Lean4 proofs for core protocols.",
    papers: [
      { title: "Master Security Model", slug: "lux-master-security-model", org: "luxfi" },
      { title: "HSM Boundary", slug: "lux-hsm-boundary", org: "luxfi" },
      { title: "Formal Verification (Lean4)", slug: "lux-formal-verification-lean4", org: "luxfi" },
      { title: "Protocol Verification (Tamarin)", slug: "lux-protocol-verification-tamarin", org: "luxfi" },
      { title: "Symbolic Execution (Halmos)", slug: "lux-symbolic-execution-halmos", org: "luxfi" },
      { title: "Model Checking (TLA+)", slug: "lux-model-checking-tla", org: "luxfi" },
      { title: "Smart Contract Auditing", slug: "lux-smart-contract-auditing", org: "luxfi" },
      { title: "Fraud Proofs", slug: "lux-fraud-proofs", org: "luxfi" },
      { title: "Hanzo Formal Verification", slug: "hanzo-formal-verification", org: "hanzoai" },
    ],
  },
  {
    name: "AI Infrastructure",
    summary: "LLM gateways, agent frameworks, multimodal models, and AI-native inference.",
    papers: [
      { title: "Hanzo LLM Gateway: Unified Proxy for 100+ AI Providers", slug: "hanzo-llm-gateway", org: "hanzoai" },
      { title: "Hanzo Agent SDK: Orchestration, Tool Use, Memory", slug: "hanzo-agent-sdk", org: "hanzoai" },
      { title: "Jin: Unified Multimodal AI Architecture", slug: "hanzo-jin-architecture", org: "hanzoai" },
      { title: "Model Context Protocol Server Architecture", slug: "hanzo-mcp-server", org: "hanzoai" },
      { title: "Active Semantic Optimization (ASO)", slug: "hanzo-aso", org: "hanzoai" },
      { title: "Decentralized Semantic Optimization (DSO)", slug: "hanzo-dso", org: "hanzoai" },
      { title: "Hanzo Consensus AI", slug: "hanzo-consensus-ai", org: "hanzoai" },
      { title: "Hanzo AI Safety: Foundations for Safe AGI", slug: "hanzo-ai-safety", org: "hanzoai" },
      { title: "Federated Agents", slug: "hanzo-federated-agents", org: "hanzoai" },
      { title: "Self-Improving Agents", slug: "hanzo-self-improving-agents", org: "hanzoai" },
    ],
  },
  {
    name: "DeSci & Conservation",
    summary: "Decentralized science, federated wildlife research, and open coordination protocols.",
    papers: [
      { title: "Conservation AI: Deep Learning for Wildlife Population Monitoring", slug: "zoo-conservation-ai", org: "zooai" },
      { title: "Decentralized Science on Zoo Network", slug: "zoo-desci-platform", org: "zooai" },
      { title: "Federated Learning for Wildlife Monitoring", slug: "zoo-federated-wildlife", org: "zooai" },
      { title: "Habitat Modeling", slug: "zoo-habitat-modeling", org: "zooai" },
      { title: "Zoo Gym: Decentralized GSPO Training", slug: "zoo-gym-protocol", org: "zooai" },
      { title: "Eco-1: Z-JEPA Hyper-Modal MoE Architecture", slug: "zoo-eco1-zjepa", org: "zooai" },
      { title: "Piggybank Agents: Yield-Bearing AI-Native NFTs", slug: "zoo-agi", org: "zooai" },
    ],
  },
];

const ORG_LABEL: Record<Paper["org"], string> = {
  luxfi: "Lux",
  hanzoai: "Hanzo",
  zooai: "Zoo",
};

function pdfUrl(p: Paper): string {
  // Papers are organized as one directory per paper with a PDF of the same name.
  // Pre-built PDFs live under pdfs/ in each papers repo.
  return `https://github.com/${p.org}/papers/raw/main/pdfs/${p.slug}.pdf`;
}

function sourceUrl(p: Paper): string {
  return `https://github.com/${p.org}/papers/tree/main/${p.slug}`;
}

export default function ResearchPage() {
  return (
    <Container>
      <Intro>
        <Title>Research</Title>
        <Subtitle>
          The scientific foundations of the Lux stack. Every paper is
          open-access, open-source, and reproducible — consensus, cryptography,
          AI, DeFi, and formal proofs across Lux, Hanzo, and Zoo.
        </Subtitle>
        <IntroLinks>
          <IntroLink href="https://github.com/luxfi/papers" target="_blank" rel="noopener noreferrer">
            luxfi/papers
          </IntroLink>
          <IntroLink href="https://github.com/luxfi/proofs" target="_blank" rel="noopener noreferrer">
            luxfi/proofs
          </IntroLink>
          <IntroLink href="https://github.com/luxfi/audits" target="_blank" rel="noopener noreferrer">
            luxfi/audits
          </IntroLink>
          <IntroLink href="https://github.com/hanzoai/papers" target="_blank" rel="noopener noreferrer">
            hanzoai/papers
          </IntroLink>
          <IntroLink href="https://github.com/zooai/papers" target="_blank" rel="noopener noreferrer">
            zooai/papers
          </IntroLink>
        </IntroLinks>
      </Intro>

      {DOMAINS.map((domain) => (
        <Section key={domain.name}>
          <SectionHeader>
            <SectionTitle>{domain.name}</SectionTitle>
            <SectionSummary>{domain.summary}</SectionSummary>
          </SectionHeader>
          <PaperGrid>
            {domain.papers.map((paper) => (
              <PaperCard key={`${paper.org}/${paper.slug}`}>
                <PaperMeta>
                  <OrgBadge $org={paper.org}>{ORG_LABEL[paper.org]}</OrgBadge>
                </PaperMeta>
                <PaperTitle>{paper.title}</PaperTitle>
                <PaperLinks>
                  <PaperLink href={pdfUrl(paper)} target="_blank" rel="noopener noreferrer">
                    PDF
                  </PaperLink>
                  <PaperLink href={sourceUrl(paper)} target="_blank" rel="noopener noreferrer">
                    Source
                  </PaperLink>
                </PaperLinks>
              </PaperCard>
            ))}
          </PaperGrid>
        </Section>
      ))}

      <CTASection>
        <CTATitle>Read the source, run the proofs</CTATitle>
        <CTAText>
          Every repo is public. Every PDF rebuilds from LaTeX. Every proof
          checks in Lean4, TLA+, or Tamarin.
        </CTAText>
        <CTAButtons>
          <PrimaryButton href="https://github.com/luxfi" target="_blank" rel="noopener noreferrer">
            Lux on GitHub
          </PrimaryButton>
          <SecondaryButton href="/open-source">
            Browse all OSS projects
          </SecondaryButton>
        </CTAButtons>
      </CTASection>
    </Container>
  );
}

const Container = styled.main`
  max-width: 1120px;
  margin: 0 auto;
  padding: 96px 24px 96px;
`;

const Intro = styled.div`
  text-align: center;
  margin-bottom: 72px;
`;

const Title = styled.h1`
  color: #FAFAFA;
  font-size: 48px;
  font-weight: 700;
  letter-spacing: -0.02em;
  margin-bottom: 16px;

  @media (max-width: 768px) {
    font-size: 36px;
  }
`;

const Subtitle = styled.p`
  color: #888;
  font-size: 18px;
  line-height: 1.6;
  max-width: 680px;
  margin: 0 auto 32px;
`;

const IntroLinks = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  justify-content: center;
`;

const IntroLink = styled.a`
  display: inline-block;
  color: #FAFAFA;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 999px;
  padding: 8px 16px;
  font-size: 13px;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  text-decoration: none;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #444;
  }
`;

const Section = styled.section`
  margin-bottom: 64px;
`;

const SectionHeader = styled.div`
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid #222;
`;

const SectionTitle = styled.h2`
  color: #FAFAFA;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 8px;
`;

const SectionSummary = styled.p`
  color: #888;
  font-size: 14px;
  line-height: 1.6;
`;

const PaperGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const PaperCard = styled.div`
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 12px;
  padding: 20px;
  transition: border-color 0.2s ease;

  &:hover {
    border-color: #333;
  }
`;

const PaperMeta = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
`;

const OrgBadge = styled.span<{ $org: "luxfi" | "hanzoai" | "zooai" }>`
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 10px;
  font-weight: 600;
  letter-spacing: 0.05em;
  text-transform: uppercase;
  color: ${({ $org }) =>
    $org === "luxfi" ? "#67E8F9" : $org === "hanzoai" ? "#FDE68A" : "#BEF264"};
  background: ${({ $org }) =>
    $org === "luxfi" ? "rgba(103, 232, 249, 0.08)" : $org === "hanzoai" ? "rgba(253, 230, 138, 0.08)" : "rgba(190, 242, 100, 0.08)"};
  border: 1px solid ${({ $org }) =>
    $org === "luxfi" ? "rgba(103, 232, 249, 0.25)" : $org === "hanzoai" ? "rgba(253, 230, 138, 0.25)" : "rgba(190, 242, 100, 0.25)"};
`;

const PaperTitle = styled.h3`
  color: #FAFAFA;
  font-size: 15px;
  font-weight: 600;
  line-height: 1.4;
  margin-bottom: 16px;
`;

const PaperLinks = styled.div`
  display: flex;
  gap: 16px;
`;

const PaperLink = styled.a`
  color: #9CA3AF;
  font-size: 13px;
  font-weight: 500;
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #FAFAFA;
  }
`;

const CTASection = styled.div`
  text-align: center;
  padding: 64px 24px;
  background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
  border: 1px solid #222;
  border-radius: 16px;
  margin-top: 48px;
`;

const CTATitle = styled.h3`
  color: #FAFAFA;
  font-size: 24px;
  font-weight: 700;
  margin-bottom: 12px;
`;

const CTAText = styled.p`
  color: #888;
  font-size: 16px;
  max-width: 520px;
  margin: 0 auto 24px;
  line-height: 1.6;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  flex-wrap: wrap;
`;

const PrimaryButton = styled.a`
  display: inline-block;
  background: #FFFFFF;
  color: #000;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.9);
    transform: translateY(-1px);
  }
`;

const SecondaryButton = styled(Link)`
  display: inline-block;
  background: transparent;
  color: #FAFAFA;
  border: 1px solid #333;
  font-size: 14px;
  font-weight: 600;
  padding: 12px 24px;
  border-radius: 8px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: #555;
  }
`;
