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
  CTASection,
  CTATitle,
  CTASubtitle,
} from "./styles";

// Icons
const ExchangeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 3l4 4-4 4M20 7H4M8 21l-4-4 4-4M4 17h16" />
  </svg>
);

const DeFiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M8 12h8M12 8v8" />
  </svg>
);

const AmmIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 18c3-6 6-6 9 0s6 6 9 0" />
  </svg>
);

const VaultIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="12" cy="12" r="4" />
    <path d="M12 8v8M8 12h8" />
  </svg>
);

const CardIconSvg = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
  </svg>
);

const BankIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
  </svg>
);

const HftIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
  </svg>
);

const LayersIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <polygon points="12 2 2 7 12 12 22 7 12 2" />
    <polyline points="2 17 12 22 22 17" />
    <polyline points="2 12 12 17 22 12" />
  </svg>
);

const GpuIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="4" y="4" width="16" height="16" rx="2" />
    <rect x="9" y="9" width="6" height="6" />
    <path d="M9 1v3M15 1v3M9 20v3M15 20v3M20 9h3M20 14h3M1 9h3M1 14h3" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const AgentIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect x="3" y="11" width="18" height="10" rx="2" />
    <circle cx="12" cy="5" r="2" />
    <path d="M12 7v4M8 16h.01M16 16h.01" />
  </svg>
);

const GlobeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ApiIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
  </svg>
);

const DOCS = "https://docs.lux.financial/docs";

// Core trading & venue products
const tradingProducts = [
  {
    icon: ExchangeIcon,
    title: "CEX (Centralized Exchange)",
    description:
      "Alternative Trading System with CLOB matching, REST + WebSocket + FIX 4.4. White-label exchange with your brand, your pricing, our engine.",
    href: `${DOCS}/exchange-api`,
    color: "#8B5CF6",
  },
  {
    icon: DeFiIcon,
    title: "DEX (Decentralized Exchange)",
    description:
      "Non-custodial on-chain trading across EVM chains. Settlement on Lux, Ethereum, and interoperable L2s. Self-custody by default.",
    href: `${DOCS}/dex`,
    color: "#3B82F6",
  },
  {
    icon: AmmIcon,
    title: "AMM (Automated Market Maker)",
    description:
      "Programmable liquidity pools with concentrated liquidity, dynamic fees, and LP incentives. Deploy white-label pools on any supported chain.",
    href: `${DOCS}/dex`,
    color: "#EC4899",
  },
  {
    icon: HftIcon,
    title: "HFT Infrastructure",
    description:
      "Sub-millisecond latency. REST ~5ms, WebSocket ~1ms, FIX 4.4 ~500us, ZAP binary ~100us. Co-location at Equinix NY5 available.",
    href: `${DOCS}/hft`,
    color: "#F59E0B",
  },
];

// Order, execution & data products
const executionProducts = [
  {
    icon: LayersIcon,
    title: "Order Management",
    description:
      "Market, limit (GTC/IOC/FOK/DAY), stop, stop-limit, bracket orders. Full lifecycle: new, modify, cancel, fill, execution report.",
    href: `${DOCS}/orders`,
    color: "#22D3EE",
  },
  {
    icon: HftIcon,
    title: "Smart Order Routing",
    description:
      "TWAP, VWAP, POV, iceberg, and custom algorithmic execution. Best-execution routing across venues with transaction cost analysis.",
    href: `${DOCS}/execution`,
    color: "#22C55E",
  },
  {
    icon: GpuIcon,
    title: "GPU Execution Engine",
    description:
      "GPU-accelerated matching and risk checks. Parallel order-book simulation and portfolio analytics at institutional scale.",
    href: `${DOCS}/gpu`,
    color: "#FF6B6B",
  },
  {
    icon: AgentIcon,
    title: "Agentic Trading (MCP)",
    description:
      "Every trading endpoint exposed over Model Context Protocol. AI agents authenticate via scoped JWTs with the same compliance pipeline as humans.",
    href: `${DOCS}/agentic-trading`,
    color: "#A855F7",
  },
];

// Custody, banking & asset products
const bankingProducts = [
  {
    icon: VaultIcon,
    title: "Treasury & Custody",
    description:
      "MPC custody with 2-of-3 / 3-of-5 threshold signing, HSM-backed (FIPS 140-2 Level 3). Multi-sig vaults, policy engine, insurance.",
    href: `${DOCS}/blockchain`,
    color: "#0EA5E9",
  },
  {
    icon: BankIcon,
    title: "Banking Accounts",
    description:
      "Checking, savings, and treasury accounts. Virtual IBANs, ACH, Wire, SEPA, Faster Payments, SWIFT. FDIC-sweep partners on USD.",
    href: `${DOCS}/broker-dealers`,
    color: "#10B981",
  },
  {
    icon: CardIconSvg,
    title: "Cards (Standard / Premium / Black)",
    description:
      "Virtual + physical card issuance. Tiered programs, spend controls, real-time authorization, FX at interbank, rewards.",
    href: `${DOCS}/broker-dealers`,
    color: "#F97316",
  },
  {
    icon: GlobeIcon,
    title: "Multi-Asset Platform",
    description:
      "Fiat (USD, EUR, GBP, JPY), crypto (BTC, ETH, SOL, LUX + 200 more), stablecoins (USDC, USDT, PYUSD), and digital securities in one ledger.",
    href: `${DOCS}/trading`,
    color: "#EAB308",
  },
];

// Infrastructure & security products
const infraProducts = [
  {
    icon: ShieldIcon,
    title: "Post-Quantum Security",
    description:
      "NIST FIPS 204 (ML-DSA), FIPS 203 (ML-KEM), FIPS 205 (SLH-DSA) plus Ringtail (N=768) 192-bit threshold signatures. Implemented as EVM precompiles.",
    href: `${DOCS}/quantum`,
    color: "#6366F1",
  },
  {
    icon: ShieldIcon,
    title: "FHE Coprocessor",
    description:
      "CKKS fully-homomorphic encryption (ring degree 14, 8 mult levels) for confidential order matching and encrypted portfolio analytics. GPU-accelerated.",
    href: `${DOCS}/fhe`,
    color: "#8B5CF6",
  },
  {
    icon: LayersIcon,
    title: "Blockchain Settlement",
    description:
      "Native multi-chain settlement: Lux Z-Chain, A-Chain, Ethereum, and EVM-compatible L1/L2s. Atomic cross-chain via Teleport.",
    href: `${DOCS}/blockchain`,
    color: "#14B8A6",
  },
  {
    icon: ShieldIcon,
    title: "ZAP (ZK Attestation Protocol)",
    description:
      "Zero-knowledge attestation on the Z/A-Chain. Groth16 proofs for confidential settlement, UTXO privacy, dark-pool operations, and regulatory attestation.",
    href: `${DOCS}/zap`,
    color: "#EF4444",
  },
];

// Compliance, Data & Institutional access products
const complianceProducts = [
  {
    icon: ShieldIcon,
    title: "Compliance Suite",
    description:
      "KYC/KYB (Jumio, Onfido, Plaid), OFAC/EU/UK/PEP screening, FATF Travel Rule, SAR/CTR automation, and OATS/CAT/ATS-N/Form ATS filings.",
    href: `${DOCS}/compliance-full`,
    color: "#10B981",
  },
  {
    icon: LayersIcon,
    title: "Market Data",
    description:
      "Real-time quotes, L2 depth, trade prints, and historical OHLCV across equities, crypto, privates, pre-IPO, fixed income, commodities, and FX via REST, SSE, WebSocket.",
    href: `${DOCS}/market-data`,
    color: "#22D3EE",
  },
  {
    icon: ApiIcon,
    title: "Multi-Language SDKs",
    description:
      "@luxfi/trading for TypeScript, Python, Go, Rust, and C++. Unified liquidity aggregation, smart routing, execution algorithms, and risk management.",
    href: `${DOCS}/sdk`,
    color: "#A855F7",
  },
  {
    icon: BankIcon,
    title: "Broker-Dealer Partners",
    description:
      "Omnibus, fully-disclosed, and institutional account structures for registered BDs. Pre-cleared order flow, drop-copy feeds, and regulatory reporting.",
    href: `${DOCS}/broker-dealers`,
    color: "#0EA5E9",
  },
];


type Product = (typeof tradingProducts)[number];

function ProductGrid({ products }: { products: Product[] }) {
  return (
    <CardGrid $cols={4}>
      {products.map((p) => (
        <Link
          key={p.href + p.title}
          href={p.href}
          target="_blank"
          rel="noopener noreferrer"
          style={{ textDecoration: "none" }}
        >
          <Card $accent={p.color}>
            <CardIcon $color={p.color}>
              <p.icon />
            </CardIcon>
            <CardTitle>{p.title}</CardTitle>
            <CardDescription>{p.description}</CardDescription>
          </Card>
        </Link>
      ))}
    </CardGrid>
  );
}

export default function Products() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge>Products</ProductBadge>
          <HeroTitle>The full financial stack.</HeroTitle>
          <HeroSubtitle>
            Exchange, DEX, AMM, treasury, cards, banking, HFT, and multi-asset
            infrastructure — every layer available standalone or fully white-labeled.
            Regulated. Post-quantum secure. Production-ready today.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact">
              <CustomButton>Talk to Sales</CustomButton>
            </Link>
            <Link href="https://docs.lux.financial" target="_blank" rel="noopener noreferrer">
              <SecondaryButton>View Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Trading Venues</SectionTitle>
          <SectionSubtitle>
            CEX, DEX, AMM, and HFT infrastructure. Every venue type, one API.
          </SectionSubtitle>
        </SectionHeader>
        <ProductGrid products={tradingProducts} />
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Execution & Data</SectionTitle>
          <SectionSubtitle>
            Smart order routing, algos, GPU matching, and agentic access.
          </SectionSubtitle>
        </SectionHeader>
        <ProductGrid products={executionProducts} />
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Custody, Banking & Cards</SectionTitle>
          <SectionSubtitle>
            Treasury, accounts, cards, and multi-asset wallets. Your users, your brand.
          </SectionSubtitle>
        </SectionHeader>
        <ProductGrid products={bankingProducts} />
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Infrastructure & Security</SectionTitle>
          <SectionSubtitle>
            Post-quantum, FHE, multi-chain settlement, and the ZAP ZK attestation protocol.
          </SectionSubtitle>
        </SectionHeader>
        <ProductGrid products={infraProducts} />
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Compliance, Data & Access</SectionTitle>
          <SectionSubtitle>
            Regulated market data, multi-language SDKs, compliance automation, and broker-dealer integration.
          </SectionSubtitle>
        </SectionHeader>
        <ProductGrid products={complianceProducts} />
      </Section>

      <CTASection>
        <CTATitle>Ready to build?</CTATitle>
        <CTASubtitle>
          Pick what you need, leave what you don&apos;t. Every product is production-ready
          and documented end-to-end.
        </CTASubtitle>
        <HeroButtons>
          <Link href="/contact">
            <CustomButton>Talk to Sales</CustomButton>
          </Link>
          <Link href="https://docs.lux.financial" target="_blank" rel="noopener noreferrer">
            <SecondaryButton>Read the Docs</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
