"use client";
import Link from "next/link";
import styled from "styled-components";

// Open Source catalog — curated OSS projects across the Lux, Hanzo, Zoo, and
// Hanzo S3 organizations. Every entry links back to the GitHub repo.

type Repo = {
  name: string;
  org: "luxfi" | "hanzoai" | "zooai" | "hanzos3" | "lux-apps";
  desc: string;
  lang?: string;
};

type Category = {
  name: string;
  summary: string;
  repos: readonly Repo[];
};

const CATEGORIES: readonly Category[] = [
  {
    name: "Network & L1",
    summary: "The Lux blockchain core: node, consensus, VMs, genesis, validators.",
    repos: [
      { name: "node", org: "luxfi", desc: "Lux blockchain node — multi-consensus, post-quantum ready", lang: "Go" },
      { name: "consensus", org: "luxfi", desc: "Quasar consensus engine — Go implementations of consensus protocols", lang: "Go" },
      { name: "bft", org: "luxfi", desc: "BFT primitives: state machine replication for Byzantine-tolerant services", lang: "Go" },
      { name: "chains", org: "luxfi", desc: "Independent VM plugin binaries for the Lux Network", lang: "Go" },
      { name: "genesis", org: "luxfi", desc: "Lux Network genesis for Mainnet, Testnet, Devnet, Local/Custom", lang: "Go" },
      { name: "validators", org: "luxfi", desc: "Validator management for Lux blockchain", lang: "Go" },
      { name: "cli", org: "luxfi", desc: "Lux Network CLI for launching and scaling blockchain clusters", lang: "Go" },
      { name: "netrunner", org: "luxfi", desc: "Lux Network Runner tool", lang: "Go" },
      { name: "netrunner-sdk", org: "luxfi", desc: "Netrunner SDK for launching Lux Network server groups", lang: "Go" },
      { name: "p2p", org: "luxfi", desc: "P2P networking library for Lux blockchain", lang: "Go" },
      { name: "database", org: "luxfi", desc: "Pluggable storage — BadgerDB, Pebble, Merkle indexing, snapshots", lang: "Go" },
      { name: "plugins-core", org: "luxfi", desc: "Core plugins for Lux Network" },
      { name: "LPs", org: "luxfi", desc: "Lux Proposals — standards and specs for the Lux Network", lang: "MDX" },
    ],
  },
  {
    name: "EVM & Execution",
    summary: "Ethereum-compatible VM, GPU acceleration, custom precompiles.",
    repos: [
      { name: "evm", org: "luxfi", desc: "LUX EVM: launch your own Ethereum-compatible EVM on Lux Network", lang: "Go" },
      { name: "geth", org: "luxfi", desc: "Ethereum virtual machine without network/consensus, for building custom chains", lang: "Go" },
      { name: "coreth", org: "luxfi", desc: "C-Chain execution engine", lang: "Go" },
      { name: "precompile", org: "luxfi", desc: "Lux EVM precompiles for AI mining, Teleport, and quantum signatures", lang: "C" },
      { name: "evmone", org: "luxfi", desc: "Fast EVM implementation with GPU acceleration" },
      { name: "reth", org: "luxfi", desc: "Modular, blazing-fast Ethereum implementation in Rust", lang: "Rust" },
      { name: "hardhat", org: "luxfi", desc: "LUX Hardhat Framework", lang: "JavaScript" },
      { name: "solidity", org: "luxfi", desc: "Lux Solidity Contracts and Libraries", lang: "JavaScript" },
      { name: "fhe-coprocessor", org: "luxfi", desc: "Encrypted execution coprocessor", lang: "Go" },
      { name: "gpu", org: "luxfi", desc: "Go bindings for MLX array framework (Metal/CUDA)", lang: "Go" },
    ],
  },
  {
    name: "Post-Quantum Cryptography",
    summary: "Lattice-based cryptography, NIST FIPS 203/204/205, hybrid certificates.",
    repos: [
      { name: "crypto", org: "luxfi", desc: "Core cryptographic primitives: hashes, ECDSA, BLS, HKDF, lattice PQ", lang: "C" },
      { name: "lamport", org: "luxfi", desc: "Post-quantum Lamport one-time signatures for EVM smart contracts", lang: "Solidity" },
      { name: "ringtail", org: "luxfi", desc: "2-round lattice-based threshold signature from standard assumptions", lang: "Go" },
      { name: "crystals-go", org: "luxfi", desc: "Go implementation of CRYSTALS-Kyber and -Dilithium" },
      { name: "mlkem768", org: "luxfi", desc: "Go implementation of ML-KEM (Kyber)" },
      { name: "lattice", org: "luxfi", desc: "Lux Lattice — multiparty homomorphic encryption for post-quantum safety", lang: "Go" },
      { name: "lattice-estimator", org: "luxfi", desc: "LWE estimator" },
      { name: "qzmq", org: "luxfi", desc: "Quantum-safe ZeroMQ transport with ML-KEM and ML-DSA", lang: "Go" },
      { name: "session", org: "luxfi", desc: "SessionVM — post-quantum secure messaging VM", lang: "Go" },
      { name: "hanzo-crypto", org: "hanzoai", desc: "Modern post-quantum cryptography with NIST-standardized algorithms", lang: "Rust" },
    ],
  },
  {
    name: "Threshold / MPC",
    summary: "Multi-party signing, FROST, CGGMP21, threshold ECDSA/EdDSA.",
    repos: [
      { name: "mpc", org: "luxfi", desc: "MPC nodes / wallet service using CGGMP21 and FROST", lang: "Go" },
      { name: "mpc-nodes", org: "luxfi", desc: "MPC node operator", lang: "Rust" },
      { name: "threshold", org: "luxfi", desc: "CGGMP21, FROST, LSS and other threshold signature schemes", lang: "Go" },
      { name: "multi-party-ecdsa", org: "luxfi", desc: "Multi-party {t,n}-threshold ECDSA for Teleport protocol", lang: "Rust" },
      { name: "multi-party-eddsa", org: "luxfi", desc: "Rust multi-party Ed25519 signature scheme" },
      { name: "cggmp21.rs", org: "luxfi", desc: "State-of-the-art threshold ECDSA in Rust" },
      { name: "safe-frost", org: "luxfi", desc: "FROST threshold signatures for Safe smart accounts", lang: "Solidity" },
    ],
  },
  {
    name: "Bridge & Interop",
    summary: "Cross-chain messaging, trustless asset transfer, light-client verification.",
    repos: [
      { name: "bridge", org: "luxfi", desc: "Bridge powered by trustless MPC network and Teleport protocol", lang: "TypeScript" },
      { name: "teleport", org: "luxfi", desc: "Zero-knowledge MPC cross-chain bridge", lang: "TypeScript" },
      { name: "teleporter", org: "luxfi", desc: "Teleport protocol Docker/Kubernetes orchestration", lang: "Rust" },
      { name: "warp", org: "luxfi", desc: "Warp Protocol v2.0", lang: "Go" },
      { name: "bridge", org: "zooai", desc: "Zoo bridge — MPC network and Teleport protocol", lang: "Go" },
    ],
  },
  {
    name: "DeFi & Exchange",
    summary: "DEX, AMM, lending, futures, market-making, treasury.",
    repos: [
      { name: "exchange", org: "luxfi", desc: "Exchange — decentralized AMM", lang: "TypeScript" },
      { name: "dex", org: "luxfi", desc: "High-performance DEX for Lux Network", lang: "Go" },
      { name: "amm", org: "luxfi", desc: "Lux AMM — forked Uniswap SDKs as @luxamm/*", lang: "TypeScript" },
      { name: "markets", org: "luxfi", desc: "Lux Markets Liquidity Protocol", lang: "Solidity" },
      { name: "finance", org: "luxfi", desc: "Lux DeFi web interface", lang: "HTML" },
      { name: "credit", org: "luxfi", desc: "Lux Credit — zero-interest lending", lang: "TypeScript" },
      { name: "fund", org: "luxfi", desc: "Lux Fund — investment platform", lang: "CSS" },
      { name: "invest", org: "luxfi", desc: "Lux Invest — investment portal", lang: "TypeScript" },
      { name: "futures", org: "luxfi", desc: "Lux Futures", lang: "Go" },
      { name: "forex", org: "luxfi", desc: "Lux Forex", lang: "Go" },
      { name: "treasury", org: "luxfi", desc: "Treasury: 13 providers, banking, payments, FX, cards, compliance", lang: "Go" },
      { name: "broker", org: "luxfi", desc: "Federated broker: 16 providers, smart order routing", lang: "Go" },
      { name: "bank", org: "luxfi", desc: "Open-source banking-as-a-service platform", lang: "Go" },
      { name: "compliance", org: "luxfi", desc: "Regulated financial compliance: KYC/AML, multi-jurisdiction", lang: "Go" },
      { name: "captable", org: "luxfi", desc: "Reusable Go transfer agent engine for cap-table management", lang: "Go" },
      { name: "transfer", org: "luxfi", desc: "Transfer Agent library — ledger, disclosures, voting, dividends, filings", lang: "Go" },
    ],
  },
  {
    name: "FHE & Privacy",
    summary: "Fully homomorphic encryption stack: compiler, GPU backends, ML.",
    repos: [
      { name: "fhe", org: "luxfi", desc: "Lux FHE with GPU acceleration", lang: "Go" },
      { name: "fhevm", org: "luxfi", desc: "Full-stack FHE framework for blockchain applications" },
      { name: "fhe-compiler", org: "luxfi", desc: "LLVM-based FHE compiler for the Lux FHE stack", lang: "LLVM" },
      { name: "fhe-gpu", org: "luxfi", desc: "GPU-accelerated FHE schemes (BFV, BGV, CKKS) based on Microsoft SEAL" },
      { name: "fhe-ml", org: "luxfi", desc: "Machine learning on encrypted data", lang: "Python" },
      { name: "fhe-ntt", org: "luxfi", desc: "Number Theoretic Transform for FHE" },
      { name: "fhe-fft", org: "luxfi", desc: "Fast Fourier Transform for FHE" },
      { name: "fhe-threshold", org: "luxfi", desc: "Threshold FHE protocols" },
      { name: "fhe-hardhat-template", org: "luxfi", desc: "FHE Hardhat template for smart contract development" },
      { name: "fhe-next-template", org: "luxfi", desc: "FHE Next.js template for web3 applications" },
      { name: "fhe-react-template", org: "luxfi", desc: "FHE React template for web3 applications" },
      { name: "fhe-vue-template", org: "luxfi", desc: "FHE Vue.js template for web3 applications" },
      { name: "fhe-dapps", org: "luxfi", desc: "Example decentralized applications using FHE" },
      { name: "fhe-handbook", org: "luxfi", desc: "Comprehensive FHE development guide" },
      { name: "torus", org: "luxfi", desc: "Lux FHE framework (Python compiler and runtime)", lang: "C++" },
      { name: "zchain", org: "luxfi", desc: "Execution service for FHE computations on Z-Chain", lang: "TypeScript" },
    ],
  },
  {
    name: "Wallets & Key Management",
    summary: "Wallet apps, HSM, keychains, hardware integration.",
    repos: [
      { name: "wallet", org: "luxfi", desc: "Open-source Lux DeFi Wallet", lang: "TypeScript" },
      { name: "kit", org: "luxfi", desc: "Lux Kit multichain wallet SDK", lang: "TypeScript" },
      { name: "luxkit", org: "luxfi", desc: "LuxKit multichain wallet SDK/UI toolbox", lang: "TypeScript" },
      { name: "dwallet", org: "luxfi", desc: "Lux desktop wallet", lang: "TypeScript" },
      { name: "extension", org: "luxfi", desc: "Lux Wallet browser extension", lang: "TypeScript" },
      { name: "xwallet", org: "luxfi", desc: "Open-source browser extension wallet for DeFi", lang: "TypeScript" },
      { name: "safe", org: "luxfi", desc: "Lux Safe — quantum-safe multisig wallet", lang: "TypeScript" },
      { name: "safe-ios", org: "luxfi", desc: "Lux Safe iOS app", lang: "Swift" },
      { name: "vault", org: "luxfi", desc: "Lux Quantum Vault Project", lang: "Solidity" },
      { name: "hsm", org: "luxfi", desc: "Unified HSM, KMS and custody for the Lux ecosystem", lang: "Go" },
      { name: "kms", org: "luxfi", desc: "Open-source platform for secure credential management", lang: "TypeScript" },
      { name: "keychain", org: "luxfi", desc: "Shared keychain interfaces and implementations", lang: "Go" },
      { name: "ledger", org: "luxfi", desc: "Lux Ledger app", lang: "Rust" },
      { name: "ledger-app", org: "luxfi", desc: "Lux app for Ledger Nano S, S+, X", lang: "Rust" },
      { name: "go-bip32", org: "luxfi", desc: "BIP-32 HD key derivation library for Go", lang: "Go" },
      { name: "go-bip39", org: "luxfi", desc: "BIP-39 mnemonic generation/validation in pure Go", lang: "Go" },
    ],
  },
  {
    name: "Research & Audits",
    summary: "Whitepapers, formal proofs, independent security audits.",
    repos: [
      { name: "papers", org: "luxfi", desc: "Lux Network research papers", lang: "TeX" },
      { name: "proofs", org: "luxfi", desc: "Formal verification proofs for Lux consensus and contracts", lang: "Lean" },
      { name: "audits", org: "luxfi", desc: "Lux independent security audits", lang: "TeX" },
      { name: "rfc", org: "luxfi", desc: "Request for Comments (RFC) proposals" },
      { name: "papers", org: "zooai", desc: "Zoo Labs Foundation research papers", lang: "TeX" },
      { name: "proofs", org: "zooai", desc: "Formal verification proofs for Zoo Labs", lang: "Lean" },
      { name: "ZIPs", org: "zooai", desc: "Zoo Improvement Proposals — governance framework", lang: "Python" },
      { name: "HIPs", org: "hanzoai", desc: "Hanzo Improvement Proposals — technical specs for AI infrastructure", lang: "HTML" },
    ],
  },
  {
    name: "SDKs",
    summary: "Client libraries across languages.",
    repos: [
      { name: "js-sdk", org: "luxfi", desc: "Lux JavaScript SDK", lang: "TypeScript" },
      { name: "sdk", org: "luxfi", desc: "Lux Chain SDK for building high-performance blockchains", lang: "Go" },
      { name: "sdk-rs", org: "luxfi", desc: "Rust SDK for the Lux blockchain", lang: "Rust" },
      { name: "rs", org: "luxfi", desc: "APIs and VM SDK in Rust", lang: "Rust" },
      { name: "ledger-go", org: "luxfi", desc: "Minimal Ledger HID library — forked from zondax without bloat", lang: "Go" },
      { name: "ledger-js", org: "luxfi", desc: "Lux Ledger App JS clients", lang: "TypeScript" },
      { name: "go-sdk", org: "hanzoai", desc: "Hanzo Go SDK", lang: "Go" },
      { name: "hanzo-go", org: "hanzoai", desc: "Go client for Hanzo APIs" },
      { name: "hanzo-php", org: "hanzoai", desc: "Hanzo PHP SDK", lang: "PHP" },
    ],
  },
  {
    name: "Storage & Data",
    summary: "Object storage (S3-compatible), databases, KV stores.",
    repos: [
      { name: "go-sdk", org: "hanzos3", desc: "Hanzo S3 Go SDK — Go client for S3-compatible storage", lang: "Go" },
      { name: "js-sdk", org: "hanzos3", desc: "Hanzo S3 JavaScript SDK", lang: "JavaScript" },
      { name: "py-sdk", org: "hanzos3", desc: "Hanzo S3 Python SDK", lang: "Python" },
      { name: "rust-sdk", org: "hanzos3", desc: "Hanzo S3 Rust SDK", lang: "Rust" },
      { name: "java-sdk", org: "hanzos3", desc: "Hanzo S3 Java SDK", lang: "Java" },
      { name: "dotnet-sdk", org: "hanzos3", desc: "Hanzo S3 .NET SDK", lang: "C#" },
      { name: "cpp-sdk", org: "hanzos3", desc: "Hanzo S3 C++ SDK", lang: "C++" },
      { name: "cli", org: "hanzos3", desc: "Hanzo S3 CLI for S3-compatible object storage", lang: "Go" },
      { name: "console", org: "hanzos3", desc: "Hanzo Space — web console for Hanzo S3", lang: "JavaScript" },
      { name: "operator", org: "hanzos3", desc: "Kubernetes operator for S3-compatible object storage", lang: "Go" },
      { name: "directpv", org: "hanzos3", desc: "CSI driver for direct attached storage on Kubernetes", lang: "Go" },
      { name: "kes", org: "hanzos3", desc: "Key Encryption Service for server-side encryption", lang: "Go" },
      { name: "badger", org: "luxfi", desc: "Fast key-value DB in Go" },
      { name: "zapdb", org: "luxfi", desc: "Fast key-value DB in Go", lang: "Go" },
      { name: "docdb", org: "hanzoai", desc: "MongoDB-compatible document database", lang: "Go" },
      { name: "datastore", org: "hanzoai", desc: "Real-time analytics database for AI workloads", lang: "C++" },
    ],
  },
  {
    name: "AI & ML",
    summary: "LLM gateways, agent frameworks, inference engines, multimodal models.",
    repos: [
      { name: "gateway", org: "hanzoai", desc: "Unified LLM gateway — 100+ providers, load balancing, caching", lang: "Go" },
      { name: "agent", org: "hanzoai", desc: "Multi-agent SDK with OpenAI-compatible API", lang: "Go" },
      { name: "chat", org: "hanzoai", desc: "AI chat with MCP integration and multi-provider support", lang: "HTML" },
      { name: "cloud", org: "hanzoai", desc: "Unified AI infrastructure and MCP management platform", lang: "Go" },
      { name: "console", org: "hanzoai", desc: "Unified LLM dev environment — debug, fine-tune, monitor", lang: "TypeScript" },
      { name: "engine", org: "hanzoai", desc: "Rust-based LLM and embedding engine for foundational models", lang: "Rust" },
      { name: "edge", org: "hanzoai", desc: "On-device AI inference for mobile, web, and embedded", lang: "Rust" },
      { name: "flow", org: "hanzoai", desc: "Visual drag-and-drop AI workflow builder", lang: "Python" },
      { name: "dev", org: "hanzoai", desc: "AI coding agent in your terminal", lang: "Rust" },
      { name: "code", org: "hanzoai", desc: "Open-source AI code editor — any model, full data control", lang: "TypeScript" },
      { name: "browser", org: "hanzoai", desc: "Open-source Chrome extension for AI-powered web automation" },
      { name: "guard", org: "hanzoai", desc: "LLM I/O sanitization layer for local and cloud AI", lang: "Rust" },
      { name: "BAGEL", org: "hanzoai", desc: "Open-source unified multimodal model" },
      { name: "burn", org: "hanzoai", desc: "Next-generation deep learning framework" },
      { name: "gym", org: "zooai", desc: "Distributed AI research toolkit", lang: "Python" },
      { name: "ai", org: "zooai", desc: "Zoo Chat app", lang: "TypeScript" },
      { name: "agent", org: "zooai", desc: "Autonomous agents for everyone" },
    ],
  },
  {
    name: "Identity & Auth",
    summary: "IAM, OIDC, KMS-backed identity.",
    repos: [
      { name: "id", org: "luxfi", desc: "Lux ID — identity, access, and permission orchestration", lang: "TypeScript" },
      { name: "login", org: "luxfi", desc: "Lux ID Login — custom authentication portal for lux.id", lang: "TypeScript" },
      { name: "auth", org: "hanzoai", desc: "Hanzo IAM Next.js template with OIDC" },
      { name: "authz", org: "hanzoai", desc: "Authorization engine (fork of casbin/casbin v2)", lang: "Go" },
      { name: "hanzo.id", org: "hanzoai", desc: "Hanzo ID — unified identity platform", lang: "TypeScript" },
      { name: "identity", org: "luxfi", desc: "Lux Network identity, soul, and values", lang: "HTML" },
    ],
  },
  {
    name: "Networking & Transport",
    summary: "Zero-allocation protocols, messaging, distributed tracing.",
    repos: [
      { name: "zap", org: "luxfi", desc: "Zero-Allocation Protocol for high-performance AI-agent communication", lang: "Go" },
      { name: "zmq", org: "luxfi", desc: "Pure-Go implementation of ZeroMQ-4", lang: "Go" },
      { name: "czmq", org: "luxfi", desc: "Lux Golang wrapper for CZMQ", lang: "Go" },
      { name: "mdns", org: "luxfi", desc: "mDNS library for Lux network", lang: "Go" },
      { name: "pubsub", org: "luxfi", desc: "Pub/sub primitives", lang: "Go" },
      { name: "trace", org: "luxfi", desc: "Distributed tracing library (OpenTelemetry-compatible)", lang: "Go" },
      { name: "metric", org: "luxfi", desc: "Prometheus metrics helpers and conventions", lang: "Go" },
      { name: "log", org: "luxfi", desc: "High-performance structured leveled logging", lang: "Go" },
    ],
  },
  {
    name: "Infrastructure & Ops",
    summary: "CDK, Helm charts, operators, monitoring, CI.",
    repos: [
      { name: "cdk", org: "luxfi", desc: "LUX Cloud Development Kit supporting LUX in Kubernetes", lang: "TypeScript" },
      { name: "charts", org: "luxfi", desc: "Helm charts for Lux blockchain infrastructure" },
      { name: "charts", org: "hanzoai", desc: "Helm charts for all Hanzo services", lang: "Go Template" },
      { name: "operator", org: "luxfi", desc: "Kubernetes operator for Lux Network", lang: "Rust" },
      { name: "monitoring", org: "luxfi", desc: "Lux Network monitoring dashboards and tooling", lang: "Shell" },
      { name: "dns", org: "hanzoai", desc: "Hanzo DNS — CoreDNS fork with Hanzo plugins", lang: "Go" },
      { name: "ipfs-cluster", org: "luxfi", desc: "Pinset orchestration for IPFS", lang: "Go" },
      { name: "snapshots", org: "luxfi", desc: "Daily snapshots for Lux blockchain networks" },
      { name: "faucet", org: "luxfi", desc: "Lux Network public faucet implementation", lang: "TypeScript" },
    ],
  },
  {
    name: "UI & Design Systems",
    summary: "Component libraries, branding, and shared chrome.",
    repos: [
      { name: "gui", org: "luxfi", desc: "Lux-branded UI chrome on @hanzo/gui (Tamagui)", lang: "TypeScript" },
      { name: "ui", org: "luxfi", desc: "Lux UI Library for AI+Blockchain powered apps", lang: "TypeScript" },
      { name: "brand", org: "luxfi", desc: "Official brand assets and design system for Lux", lang: "TypeScript" },
      { name: "logo", org: "luxfi", desc: "Official Lux logo package with TypeScript/React components", lang: "JavaScript" },
      { name: "gui", org: "hanzoai", desc: "Hanzo GUI — cross-platform UI for all frontends", lang: "TypeScript" },
      { name: "brand", org: "hanzoai", desc: "Official brand assets and design system for Hanzo AI", lang: "TypeScript" },
      { name: "ui", org: "zooai", desc: "Zoo UI library for AI+Blockchain apps" },
      { name: "brand", org: "zooai", desc: "Brand guidelines and assets for Zoo Labs Foundation", lang: "HTML" },
    ],
  },
];

const ORG_LABEL: Record<Repo["org"], string> = {
  luxfi: "luxfi",
  hanzoai: "hanzoai",
  zooai: "zooai",
  hanzos3: "hanzos3",
  "lux-apps": "lux-apps",
};

function repoUrl(r: Repo): string {
  return `https://github.com/${r.org}/${r.name}`;
}

export default function OpenSourcePage() {
  const total = CATEGORIES.reduce((sum, c) => sum + c.repos.length, 0);

  return (
    <Container>
      <Intro>
        <Title>Open Source</Title>
        <Subtitle>
          The whole Lux stack is open source. {total}+ curated repositories
          across four organizations — consensus, cryptography, DeFi, AI, and
          infrastructure.
        </Subtitle>
        <IntroLinks>
          <IntroLink href="https://github.com/luxfi" target="_blank" rel="noopener noreferrer">
            github.com/luxfi
          </IntroLink>
          <IntroLink href="https://github.com/hanzoai" target="_blank" rel="noopener noreferrer">
            github.com/hanzoai
          </IntroLink>
          <IntroLink href="https://github.com/zooai" target="_blank" rel="noopener noreferrer">
            github.com/zooai
          </IntroLink>
          <IntroLink href="https://github.com/hanzos3" target="_blank" rel="noopener noreferrer">
            github.com/hanzos3
          </IntroLink>
        </IntroLinks>
      </Intro>

      {CATEGORIES.map((category) => (
        <Section key={category.name}>
          <SectionHeader>
            <SectionTitle>{category.name}</SectionTitle>
            <SectionSummary>{category.summary}</SectionSummary>
          </SectionHeader>
          <RepoGrid>
            {category.repos.map((repo) => (
              <RepoCard
                key={`${repo.org}/${repo.name}`}
                href={repoUrl(repo)}
                target="_blank"
                rel="noopener noreferrer"
              >
                <RepoHeader>
                  <RepoName>
                    <OrgPrefix>{ORG_LABEL[repo.org]}/</OrgPrefix>
                    {repo.name}
                  </RepoName>
                  {repo.lang && <LangBadge>{repo.lang}</LangBadge>}
                </RepoHeader>
                <RepoDesc>{repo.desc}</RepoDesc>
              </RepoCard>
            ))}
          </RepoGrid>
        </Section>
      ))}

      <CTASection>
        <CTATitle>Want to contribute?</CTATitle>
        <CTAText>
          Every project is accepting PRs. Start with an issue, or read the
          papers that motivate the design.
        </CTAText>
        <CTAButtons>
          <PrimaryButton href="https://github.com/luxfi" target="_blank" rel="noopener noreferrer">
            Browse Lux
          </PrimaryButton>
          <SecondaryButton href="/research">
            Read the research
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
  margin-bottom: 56px;
`;

const SectionHeader = styled.div`
  margin-bottom: 20px;
  padding-bottom: 12px;
  border-bottom: 1px solid #222;
`;

const SectionTitle = styled.h2`
  color: #FAFAFA;
  font-size: 22px;
  font-weight: 700;
  margin-bottom: 6px;
`;

const SectionSummary = styled.p`
  color: #888;
  font-size: 14px;
  line-height: 1.6;
`;

const RepoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`;

const RepoCard = styled(Link)`
  display: block;
  background: #0a0a0a;
  border: 1px solid #222;
  border-radius: 10px;
  padding: 16px;
  text-decoration: none;
  transition: all 0.2s ease;

  &:hover {
    border-color: #333;
    transform: translateY(-1px);
  }
`;

const RepoHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 8px;
  margin-bottom: 8px;
`;

const RepoName = styled.div`
  color: #FAFAFA;
  font-size: 14px;
  font-weight: 600;
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  word-break: break-word;
`;

const OrgPrefix = styled.span`
  color: #666;
  font-weight: 400;
`;

const LangBadge = styled.span`
  flex-shrink: 0;
  font-size: 10px;
  font-weight: 500;
  color: #9CA3AF;
  background: rgba(156, 163, 175, 0.08);
  border: 1px solid rgba(156, 163, 175, 0.2);
  padding: 2px 6px;
  border-radius: 4px;
`;

const RepoDesc = styled.p`
  color: #888;
  font-size: 12px;
  line-height: 1.5;
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
