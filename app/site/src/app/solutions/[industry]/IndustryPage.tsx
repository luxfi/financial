"use client";
import { useParams } from "next/navigation";
import Link from "next/link";
import styled from "styled-components";
import { CustomButton, SecondaryButton } from "@/components/Button";
import { DeviceSize } from "@/styles/theme/default";

// Industry data with full details
const industryData: Record<string, IndustryContent> = {
  "financial-institutions": {
    title: "Financial Institutions",
    subtitle: "Enterprise Crypto Infrastructure for Banks",
    description: "Launch digital asset services in weeks, not years. JPMorgan, Goldman, and BNY Mellon are already offering crypto custody—don't get left behind. Our infrastructure powers compliant crypto banking for institutions managing $100B+ in assets.",
    icon: "🏦",
    heroImage: "/images/global.jpg",
    stats: [
      { value: "$2B+", label: "Assets Secured" },
      { value: "15+", label: "Chains Supported" },
      { value: "99.99%", label: "Uptime SLA" },
      { value: "SOC 2", label: "Type II" },
    ],
    useCases: [
      { title: "Crypto Custody Services", description: "Like BNY Mellon's Digital Asset Custody—offer institutional-grade safekeeping with $250M insurance coverage and MPC technology." },
      { title: "Cross-Chain Treasury", description: "Move assets across Ethereum, Polygon, and 15+ chains in seconds via Teleport. No bridge risk, no delays, instant finality." },
      { title: "Staking-as-a-Service", description: "Generate 4-8% APY for clients across 20+ PoS networks. Like Coinbase Prime staking, but white-labeled for your brand." },
      { title: "Tokenized Securities", description: "Issue and trade security tokens like JP Morgan's JPM Coin. Full SEC compliance with cap table management." },
    ],
    features: [
      "MPC custody with Fireblocks-grade security",
      "Teleport instant cross-chain settlement",
      "CRYSTALS-Dilithium post-quantum signatures",
      "Staking across ETH, SOL, DOT, AVAX, LUX",
      "Treasury management with auto-rebalancing",
      "HSM integration (AWS CloudHSM, Thales)",
      "White-label client dashboards",
      "SAR/CTR automated reporting",
    ],
    integrations: ["FIS", "Fiserv", "Jack Henry", "Temenos", "SWIFT gpi", "Chainalysis", "Elliptic"],
  },
  "fintech": {
    title: "FinTech",
    subtitle: "Build the Next Revolut or Cash App",
    description: "Launch a crypto-enabled neobank in 60 days. Chime raised $750M, Revolut hit $45B valuation—the market is proven. Our API-first platform powers 50+ fintechs processing $10B+ annually.",
    icon: "💳",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "60 days", label: "Time to Launch" },
      { value: "40+", label: "Fiat Countries" },
      { value: "$10B+", label: "Annual Volume" },
      { value: "50+", label: "Live Fintechs" },
    ],
    useCases: [
      { title: "Crypto Neobank", description: "Build like Revolut—banking app with crypto trading, staking, and instant USDC remittances. One API, full product." },
      { title: "Embedded Wallets", description: "Like Cash App's Bitcoin feature—add non-custodial wallets to any app. Users control keys, you control UX." },
      { title: "Yield Accounts", description: "Offer 5-8% APY like BlockFi (but compliant). Staking yields on ETH, SOL, LUX with institutional custody." },
      { title: "Global Remittances", description: "Wise meets crypto—$5 flat fee to 40+ countries via stablecoin rails. Settlement in minutes, not days." },
    ],
    features: [
      "Revolut-style multi-currency accounts",
      "Embedded crypto trading (limit, market, recurring)",
      "Staking yields with auto-compounding",
      "USDC/USDT instant remittances",
      "Plaid & MX Money integration",
      "White-label iOS/Android apps",
      "Persona & Jumio KYC built-in",
      "Push notifications & in-app chat",
    ],
    integrations: ["Plaid", "MX Money", "Persona", "Jumio", "Sardine", "Unit", "Synapse", "Marqeta"],
  },
  "insurance": {
    title: "Insurance",
    subtitle: "Instant Claims, Global Premiums",
    description: "Lemonade pays claims in 3 seconds. AXA operates in 50 countries. Now you can too. Our platform powers $500M+ in premiums across 40+ insurers—from global carriers to MGAs.",
    icon: "🛡️",
    heroImage: "/images/security.jpg",
    stats: [
      { value: "3 sec", label: "Claims Payout" },
      { value: "200+", label: "Countries" },
      { value: "60%", label: "Cost Reduction" },
      { value: "$500M+", label: "Premiums Processed" },
    ],
    useCases: [
      { title: "Instant Claims", description: "Like Lemonade's AI claims—pay valid claims in seconds, not weeks. Direct ACH, card push, or stablecoin rails." },
      { title: "Global Premium Collection", description: "Collect premiums like AXA—local payment methods in 200+ countries. Alipay in China, Pix in Brazil, cards everywhere." },
      { title: "Treasury Optimization", description: "Float management like Berkshire—earn yield on reserves. Multi-currency accounts, FX hedging, and T-bill ladders." },
      { title: "Reinsurance Settlement", description: "Instant settlement with reinsurers via stablecoin rails. Lloyd's is already exploring blockchain settlement." },
    ],
    features: [
      "Instant ACH, card push, RTP payouts",
      "Local payment methods in 200+ countries",
      "Float management with yield optimization",
      "Real-time FX hedging",
      "Automated premium reconciliation",
      "State insurance compliance (all 50 states)",
      "White-label policyholder portals",
      "Guidewire & Duck Creek integration",
    ],
    integrations: ["Guidewire", "Duck Creek", "Majesco", "Sapiens", "Swiss Re", "Munich Re", "Verisk"],
  },
  "insurtech": {
    title: "InsurTech",
    subtitle: "Build the Next Lemonade or Root",
    description: "Lemonade IPO'd at $1.6B. Root hit $6B valuation. Parametric insurance is a $29B market by 2031. Our smart contract infrastructure powers the next wave of insurance innovation.",
    icon: "⚡",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "0 sec", label: "Parametric Payout" },
      { value: "90%", label: "Claims Automated" },
      { value: "$29B", label: "Market by 2031" },
      { value: "100%", label: "On-Chain Audit" },
    ],
    useCases: [
      { title: "Parametric Insurance", description: "Like Arbol's crop insurance—automatic payouts when rainfall drops below threshold. Chainlink oracles verify, smart contracts pay." },
      { title: "Flight Delay Insurance", description: "Like Etherisc's FlightDelay—instant USDC payout when FlightAware data confirms delay. No claims, no paperwork." },
      { title: "Microinsurance", description: "Like BIMA's $0.50/month mobile insurance for emerging markets. Embedded in apps, instant coverage, M-Pesa payouts." },
      { title: "DeFi Insurance", description: "Like Nexus Mutual—smart contract cover for DeFi protocols. Pooled risk, transparent reserves, community governance." },
    ],
    features: [
      "Chainlink & API3 oracle integration",
      "ERC-20 policy tokens",
      "Automated claims via smart contracts",
      "Instant USDC/USDT payouts",
      "Weather, flight, earthquake data feeds",
      "Embedded insurance APIs",
      "Community risk pools",
      "Transparent on-chain reserves",
    ],
    integrations: ["Chainlink", "API3", "FlightAware", "Tomorrow.io", "USGS", "Etherisc", "Nexus Mutual"],
  },
  "crypto": {
    title: "Crypto Funds & Corporates",
    subtitle: "Infrastructure for the Next a16z or Paradigm",
    description: "a16z manages $35B. Paradigm raised $2.5B. MicroStrategy holds $4B in BTC. Whether you're a crypto hedge fund, VC, or corporate treasury—our infrastructure is battle-tested for institutional scale.",
    icon: "🪙",
    heroImage: "/images/global.jpg",
    stats: [
      { value: "$5B+", label: "AUM Supported" },
      { value: "20+", label: "Staking Networks" },
      { value: "15%+", label: "Avg Staking APY" },
      { value: "100+", label: "DeFi Protocols" },
    ],
    useCases: [
      { title: "Multi-Chain Treasury", description: "Like MicroStrategy's BTC treasury—manage positions across ETH, SOL, LUX, and 50+ assets. Real-time P&L, tax lot tracking, automated rebalancing." },
      { title: "Institutional Staking", description: "Like Coinbase Cloud validators—run ETH, SOL, LUX validators with 99.9% uptime. Slashing insurance, MEV optimization, and institutional SLAs." },
      { title: "DeFi Strategies", description: "Like Maple Finance's institutional lending—deploy to Aave, Compound, Lido with risk guardrails. One dashboard, all protocols." },
      { title: "Fund Administration", description: "Like Anchorage for funds—NAV calculation, investor reporting, K-1 generation. Full audit trail for LPs." },
    ],
    features: [
      "Teleport: instant cross-chain (no bridges)",
      "Portfolio aggregation across 50+ chains",
      "Validator operations with slashing insurance",
      "DeFi position management (Aave, Lido, etc.)",
      "MPC custody with $250M insurance",
      "Tax lot accounting (FIFO, LIFO, HIFO)",
      "LP reporting and K-1 generation",
      "Post-quantum signature migration path",
    ],
    integrations: ["Anchorage", "BitGo", "Fireblocks", "Chainalysis", "Lukka", "Coinbase Prime", "Galaxy"],
  },
  "saas": {
    title: "SaaS Platforms",
    subtitle: "Build Like Stripe Atlas or Shopify Payments",
    description: "Shopify Payments processes $100B+ annually. Stripe Atlas launched 500K+ companies. Embed financial services into your SaaS—subscriptions, payouts, embedded banking—and unlock new revenue streams.",
    icon: "☁️",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "180+", label: "Currencies" },
      { value: "200+", label: "Countries" },
      { value: "$0", label: "FX Markup" },
      { value: "30%+", label: "Revenue Uplift" },
    ],
    useCases: [
      { title: "Global Subscriptions", description: "Like Paddle or Chargebee—bill in local currency, handle tax compliance (VAT/GST), and reduce churn with smart retries." },
      { title: "Marketplace Payouts", description: "Like Stripe Connect—split payments, instant payouts to sellers. Power marketplaces like Airbnb or Uber." },
      { title: "Embedded Banking", description: "Like Mercury for SaaS—offer your users business accounts, cards, and bill pay. New revenue, deeper lock-in." },
      { title: "Usage-Based Billing", description: "Like Metronome—meter API calls, compute hours, or any usage. Real-time invoicing for consumption models." },
    ],
    features: [
      "Merchant of Record (handle tax globally)",
      "Multi-currency subscriptions",
      "Smart dunning & retry logic",
      "Marketplace split payments",
      "Embedded bank accounts & cards",
      "Usage-based metering APIs",
      "Revenue recognition automation",
      "Real-time analytics & webhooks",
    ],
    integrations: ["Stripe", "Paddle", "Chargebee", "Metronome", "QuickBooks", "Xero", "Segment", "Salesforce"],
  },
  "retail": {
    title: "Retail & E-commerce",
    subtitle: "Accept Crypto Like Tesla, Pay Like Amazon",
    description: "Tesla accepts Bitcoin. Amazon pays suppliers in 200+ countries. Starbucks offers rewards in crypto. Modernize your retail treasury and payments infrastructure.",
    icon: "🛒",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "2%", label: "Crypto Adoption" },
      { value: "4-8%", label: "Staking Yield" },
      { value: "T+0", label: "Settlement" },
      { value: "40+", label: "Fiat Countries" },
    ],
    useCases: [
      { title: "Crypto Checkout", description: "Like BitPay for Newegg—accept BTC, ETH, stablecoins at checkout. Instant conversion to fiat, no volatility risk." },
      { title: "Supplier Payments", description: "Like Amazon's global payments—pay suppliers in 200+ countries via local rails or stablecoins. 2-3% FX savings." },
      { title: "Treasury Yield", description: "Like Apple's $200B treasury—earn 4-8% on idle cash via staking or DeFi yields. Better than money market funds." },
      { title: "Loyalty & Rewards", description: "Like Starbucks Odyssey—NFT rewards, token-gated perks, and crypto loyalty programs." },
    ],
    features: [
      "Crypto checkout (BTC, ETH, USDC)",
      "Instant fiat conversion",
      "Global supplier payments (200+ countries)",
      "Treasury staking (4-8% APY)",
      "NFT loyalty programs",
      "MPC custody for corporate wallets",
      "ERP integration (SAP, Oracle)",
      "Real-time FX hedging",
    ],
    integrations: ["Shopify", "Magento", "SAP", "Oracle", "BitPay", "Coinbase Commerce", "Starbucks Odyssey"],
  },
  "manufacturing": {
    title: "Manufacturing",
    subtitle: "Supply Chain Payments Like Apple or Toyota",
    description: "Apple pays suppliers in 40+ countries. Toyota's supply chain spans 200+ vendors. Optimize your global supplier payments with instant settlements, FX hedging, and trade finance.",
    icon: "🏭",
    heroImage: "/images/ship.jpg",
    stats: [
      { value: "2-3%", label: "FX Savings" },
      { value: "200+", label: "Countries" },
      { value: "T+0", label: "Settlement" },
      { value: "$10B+", label: "Annual Volume" },
    ],
    useCases: [
      { title: "Supplier Payments", description: "Like Apple's supply chain payments—pay Foxconn in CNY, Samsung in KRW, TSMC in TWD. Local rails, real-time settlement." },
      { title: "Trade Finance", description: "Like Flexport—letters of credit, supply chain financing, and inventory loans. Digitize your trade docs." },
      { title: "FX Treasury", description: "Like Toyota's treasury—centralize 50+ currency accounts, hedge exposure with forwards, and optimize working capital." },
      { title: "Stablecoin Rails", description: "Pay suppliers in USDC for instant settlement. No SWIFT delays, no correspondent banks, T+0 finality." },
    ],
    features: [
      "Multi-currency accounts (50+ currencies)",
      "Real-time FX hedging & forwards",
      "Batch payments to 200+ countries",
      "Virtual IBANs per supplier",
      "Trade finance (LC, SCF, invoice)",
      "Stablecoin rails for instant settlement",
      "SAP & Oracle ERP integration",
      "OFAC & sanctions screening",
    ],
    integrations: ["SAP", "Oracle", "NetSuite", "Flexport", "Tradeshift", "C2FO", "PrimeRevenue"],
  },
  "gaming": {
    title: "Gaming & Gambling",
    subtitle: "Build Like Axie Infinity or DraftKings",
    description: "Axie Infinity hit $4B in NFT sales. DraftKings processes $1B+ monthly. The intersection of gaming and crypto is massive—our infrastructure powers in-game economies, instant payouts, and player wallets.",
    icon: "🎮",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "<1 sec", label: "Deposits" },
      { value: "200+", label: "Countries" },
      { value: "$1B+", label: "Monthly Volume" },
      { value: "MPC", label: "Player Wallets" },
    ],
    useCases: [
      { title: "Instant Deposits", description: "Like DraftKings—deposits appear in seconds via crypto rails. Support BTC, ETH, USDC, and 50+ tokens." },
      { title: "Player Wallets", description: "Like Axie's Ronin—embedded wallets for in-game assets. MPC custody, no seed phrases, gasless transactions." },
      { title: "NFT Marketplace", description: "Like Immutable X—zero gas fees, instant trades, carbon-neutral NFTs. Built-in royalty enforcement." },
      { title: "Token Economies", description: "Like Gala Games—launch in-game tokens, manage inflation, and enable player-owned economies." },
    ],
    features: [
      "Instant crypto deposits (no confirmations)",
      "MPC player wallets (no seed phrases)",
      "Gasless transactions (meta-transactions)",
      "NFT minting & marketplace",
      "In-game token issuance",
      "Anti-fraud & velocity checks",
      "Age verification integration",
      "Multi-jurisdiction compliance",
    ],
    integrations: ["Unity", "Unreal Engine", "Immutable X", "OpenSea", "Polygon", "Arbitrum", "GamStop"],
  },
  "professional-services": {
    title: "Professional Services",
    subtitle: "Global Billing Like Big 4 Firms",
    description: "Deloitte bills in 150+ countries. Kirkland & Ellis topped $6B in revenue. Law firms, consultancies, and agencies need global billing—we make it seamless.",
    icon: "💼",
    heroImage: "/images/working_team.jpg",
    stats: [
      { value: "180+", label: "Currencies" },
      { value: "60%", label: "Faster Collections" },
      { value: "100%", label: "Auto-Reconciled" },
      { value: "$1B+", label: "Billed Annually" },
    ],
    useCases: [
      { title: "Multi-Currency Invoicing", description: "Like Baker McKenzie—invoice in 180+ currencies with real-time FX rates. Clients pay in local currency, you receive USD/EUR." },
      { title: "Trust & Escrow", description: "Like law firm IOLTA accounts—segregated client funds, automated three-way reconciliation, full audit trail." },
      { title: "Matter Billing", description: "Like Clio's billing—track time, expenses, and disbursements. Auto-generate invoices, handle retainers." },
      { title: "Expense Management", description: "Like Brex for law firms—corporate cards with matter codes, receipt capture, and policy controls." },
    ],
    features: [
      "Multi-currency invoicing (180+ currencies)",
      "Trust/IOLTA account management",
      "Automated three-way reconciliation",
      "Corporate cards with matter codes",
      "Client payment portals",
      "Retainer & evergreen management",
      "State bar compliance (all 50 states)",
      "Clio & Thomson Reuters integration",
    ],
    integrations: ["Clio", "Thomson Reuters", "Aderant", "NetDocuments", "QuickBooks", "Xero", "Bill.com"],
  },
  "real-estate": {
    title: "Real Estate",
    subtitle: "Tokenize Like RealT or Cadre",
    description: "RealT tokenized $100M+ in properties. Cadre manages $4B in assets. Real estate tokenization enables fractional ownership, global investors, and 24/7 liquidity.",
    icon: "🏢",
    heroImage: "/images/tower_full.jpg",
    stats: [
      { value: "$16T", label: "Market Size" },
      { value: "24/7", label: "Liquidity" },
      { value: "$50", label: "Min Investment" },
      { value: "SEC", label: "Compliant" },
    ],
    useCases: [
      { title: "Property Tokenization", description: "Like RealT—fractionalize properties into security tokens. $50 minimum investment, SEC Reg D/Reg A+ compliant." },
      { title: "Global Distributions", description: "Like Cadre—pay dividends to 10,000+ investors worldwide via stablecoin rails. Instant, no wire fees." },
      { title: "Secondary Trading", description: "Like tZERO—enable 24/7 trading of property tokens on regulated ATS platforms. Real liquidity." },
      { title: "Fund Administration", description: "Like Juniper Square—cap table management, K-1 distribution, and investor portals for real estate funds." },
    ],
    features: [
      "SEC Reg D / Reg A+ token issuance",
      "Fractional ownership ($50 minimum)",
      "Automated dividend distribution",
      "Cap table management",
      "Accredited investor verification",
      "Secondary market integration (tZERO)",
      "K-1 and tax document generation",
      "Global investor onboarding",
    ],
    integrations: ["tZERO", "Securitize", "Juniper Square", "AppFolio", "Yardi", "Dealpath", "Carta"],
  },
  "ngo": {
    title: "NGOs, DAOs & Non-Profits",
    subtitle: "Transparent Treasury Like Gitcoin or UNICEF",
    description: "Gitcoin distributed $50M in grants. UNICEF's CryptoFund accepts ETH. DAOs hold $10B+ in treasuries. Transparent, programmable money is transforming philanthropy.",
    icon: "🤝",
    heroImage: "/images/working_team2.jpg",
    stats: [
      { value: "$10B+", label: "DAO Treasuries" },
      { value: "200+", label: "Countries" },
      { value: "100%", label: "Transparent" },
      { value: "T+0", label: "Grant Execution" },
    ],
    useCases: [
      { title: "DAO Treasury", description: "Like Uniswap's $3B treasury—multi-sig with timelocks, spending limits, and on-chain execution. Governed by token holders." },
      { title: "Quadratic Funding", description: "Like Gitcoin Grants—democratic allocation where small donations get matching. Reduce plutocracy, amplify community voice." },
      { title: "Grant Streaming", description: "Like Sablier—stream grants to recipients over time. Milestone-based releases, instant clawback if targets missed." },
      { title: "Global Donations", description: "Like UNICEF CryptoFund—accept BTC, ETH from donors worldwide. Instant conversion, transparent allocation." },
    ],
    features: [
      "Multi-sig treasury (Safe compatible)",
      "Quadratic voting & funding",
      "Grant streaming (Sablier-style)",
      "Token-weighted governance",
      "On-chain proposal execution",
      "Global donation acceptance",
      "Transparent fund tracking",
      "501(c)(3) compliant receipts",
    ],
    integrations: ["Safe (Gnosis)", "Snapshot", "Tally", "Gitcoin", "The Giving Block", "Every.org", "Endaoment"],
  },
  "banks": {
    title: "Banks",
    subtitle: "Digital Asset Banking for Regulated Institutions",
    description: "Launch regulated digital asset services on a post-quantum platform. Integrated CEX/DEX access, MPC custody, multi-rail payments, and full compliance automation under UK FCA, Luxembourg CSSF, IoM FSA, and US SEC/FINRA frameworks.",
    icon: "🏦",
    heroImage: "/images/global.jpg",
    stats: [
      { value: "30+", label: "Regulatory Regimes" },
      { value: "16", label: "Federated Brokers" },
      { value: "1ms", label: "Settlement" },
      { value: "99.99%", label: "Uptime SLA" },
    ],
    useCases: [
      { title: "Digital Asset Custody", description: "MPC threshold custody (2-of-3 / 3-of-5) with HSM-backed key material (FIPS 140-2 Level 3). CRYSTALS-Dilithium (ML-DSA) post-quantum signing across every layer." },
      { title: "Integrated ATS + Federated Broker", description: "Offer trading via the internal ATS (CLOB matching, 1ms settlement) with a federated broker across 16 providers. REST, WebSocket, FIX 4.4, and ZAP binary co-location." },
      { title: "Multi-Rail Payments", description: "ACH, Fedwire, SWIFT gpi, SEPA, Faster Payments, PIX, SPEI, UPI from a single API. Virtual IBANs, real-time FX at interbank rates." },
      { title: "Compliance Automation", description: "Jumio/Onfido KYC, OFAC/EU/UK/PEP screening, FATF Travel Rule, SAR/CTR automation, OATS/CAT/Form ATS reporting for US ATS operations." },
    ],
    features: [
      "MPC custody (2-of-3 / 3-of-5, HSM-backed)",
      "Post-quantum: ML-DSA, ML-KEM, SLH-DSA, Ringtail",
      "REST + WebSocket + FIX 4.4 + ZAP binary",
      "200+ country coverage, 180+ currencies",
      "OFAC/EU/UK/PEP sanctions real-time",
      "FATF Travel Rule (>$3,000 transfers)",
      "OATS/CAT/Form ATS automated filings",
      "White-label client portals",
    ],
    integrations: ["FIS", "Fiserv", "Jack Henry", "Temenos", "SWIFT gpi", "Chainalysis", "Elliptic", "Jumio", "Onfido"],
  },
  "broker-dealers": {
    title: "Broker-Dealers",
    subtitle: "ATS Subscriber Access with Full Compliance Pipeline",
    description: "Direct CLOB matching engine access for registered broker-dealers. Omnibus, fully-disclosed, and institutional account structures. Every order passes the same compliance pipeline: sanctions, jurisdiction, accreditation, position limits, and offering-type gating.",
    icon: "📈",
    heroImage: "/images/global.jpg",
    stats: [
      { value: "500μs", label: "FIX 4.4 Latency" },
      { value: "100μs", label: "ZAP Binary" },
      { value: "T+1", label: "NSCC/DTC Settlement" },
      { value: "30+", label: "Jurisdictions" },
    ],
    useCases: [
      { title: "Omnibus & Fully-Disclosed", description: "Aggregate client positions under a single ATS account (omnibus) or operate fully-disclosed per-client. Supports institutional accounts with LEI/EIN and authorized trader lists." },
      { title: "Low-Latency Connectivity", description: "REST (~5ms), WebSocket (~1ms), FIX 4.4 (~500μs), ZAP binary (~100μs). Equinix NY5 co-location for ultra-low-latency execution." },
      { title: "Pre-Cleared Order Flow", description: "Attest to equivalent sanctions screening with bdPreCleared flag. Accreditation and Reg D/CF/S/A+ offering checks always run for audit integrity." },
      { title: "Drop-Copy & Reporting", description: "Real-time JSON or FIX ExecutionReport drop-copy feeds. Compliance alerts via WebSocket, regulatory CSV/XML via SFTP, full audit trail via REST." },
    ],
    features: [
      "REST + FIX 4.4 + ZAP Binary (mTLS)",
      "Omnibus / fully-disclosed / institutional",
      "T+1 equities settlement via NSCC/DTC",
      "Instant crypto settlement on-chain",
      "OATS, CAT, ATS-N, Form ATS, TRACE",
      "Reg D 506b/c, Reg CF, Reg S, Reg A+ gating",
      "12-month FIFO resale hold enforcement",
      "DVP via DTCC CTM confirmation",
    ],
    integrations: ["DTCC", "NSCC", "FINRA CAT", "Bloomberg", "BitGo", "Fireblocks", "Chainalysis"],
  },
  "asset-managers": {
    title: "Asset Managers",
    subtitle: "Multi-Asset Infrastructure for $1B+ AUM",
    description: "Run multi-asset portfolios across equities, fixed income, crypto, private securities, pre-IPO, and tokenized real estate from a single institutional account. LEI-verified, with authorized trader lists and full pre-trade risk.",
    icon: "📊",
    heroImage: "/images/working_team.jpg",
    stats: [
      { value: "7", label: "Asset Classes" },
      { value: "200+", label: "Crypto Assets" },
      { value: "10,000+", label: "Equities" },
      { value: "16", label: "Federated Brokers" },
    ],
    useCases: [
      { title: "Multi-Asset Portfolio", description: "Stocks (NASDAQ/NYSE via Alpaca), fixed income, commodities, forex, crypto (BitGo Prime + DEX), privates and pre-IPO in one ledger. Unified PnL, tax-lot accounting (FIFO/LIFO/HIFO)." },
      { title: "Execution Algorithms", description: "TWAP, VWAP, POV, Iceberg, Sniper, DCA. Smart order routing aggregates books from every connected venue and routes to best execution." },
      { title: "Private Securities", description: "Access Reg D 506b/c, Reg CF, Reg S, and Reg A+ offerings with built-in accreditation enforcement. 12-month FIFO resale hold tracking." },
      { title: "Portfolio Rebalancing via MCP", description: "Connect portfolio-management agents over Model Context Protocol. Same compliance pipeline as human traders, scoped JWT auth." },
    ],
    features: [
      "10,000+ equities via federated broker",
      "200+ crypto (BitGo Prime + on-chain DEX)",
      "Pre-IPO access (SpaceX, Stripe, etc.)",
      "Tokenized treasuries + real estate",
      "TWAP/VWAP/POV/Iceberg algorithms",
      "Tax-lot accounting (FIFO/LIFO/HIFO)",
      "MCP agent access with JWT scoping",
      "LP reporting + K-1 generation",
    ],
    integrations: ["Alpaca", "BitGo Prime", "tZERO", "Securitize", "Lukka", "Juniper Square", "Addepar"],
  },
  "exchanges": {
    title: "Exchanges",
    subtitle: "White-Label CEX, DEX, and AMM Infrastructure",
    description: "Launch your branded exchange in weeks. CLOB matching engine verified at 434M orders/sec (GPU-accelerated), CKKS FHE for confidential order matching, post-quantum signing at every layer. White-label your brand, your pricing, our engine.",
    icon: "🔁",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "434M", label: "Orders/Sec (GPU)" },
      { value: "1ms", label: "Match-to-Settle" },
      { value: "100μs", label: "ZAP Binary" },
      { value: "100%", label: "White-Label" },
    ],
    useCases: [
      { title: "White-Label CEX", description: "CLOB with market, limit (GTC/IOC/FOK/DAY), stop, stop-limit, bracket orders. REST, WebSocket, FIX 4.4, ZAP binary. Full drop-copy and surveillance feeds." },
      { title: "On-Chain DEX", description: "Non-custodial CLOB DEX with 1ms settlement on Lux Z-Chain/A-Chain. EVM-compatible, atomic cross-chain via Teleport. Self-custody by default." },
      { title: "Programmable AMM", description: "Concentrated liquidity, dynamic fees, LP incentives. Deploy white-label pools on Lux, Ethereum, and EVM L2s. Composable with DEX orderbook." },
      { title: "Confidential Matching", description: "CKKS fully-homomorphic encryption matches orders on encrypted values. Dark-pool-grade privacy with on-chain auditability via ZAP attestations." },
    ],
    features: [
      "CLOB matching (GPU + CPU backends)",
      "REST + WebSocket + FIX 4.4 + ZAP",
      "CKKS FHE confidential matching",
      "ZAP ZK attestations (Groth16)",
      "EVM precompiles for PQ signatures",
      "Concentrated-liquidity AMM pools",
      "Atomic cross-chain via Teleport",
      "Post-quantum from consensus up",
    ],
    integrations: ["Lux Z-Chain", "Lux A-Chain", "Ethereum", "Polygon", "Arbitrum", "Base", "BitGo", "Chainalysis"],
  },
  "market-makers": {
    title: "Market Makers",
    subtitle: "Co-Located, Post-Quantum, GPU-Accelerated",
    description: "Sub-millisecond execution at Equinix NY5 co-location. ZAP binary protocol (~100μs) with mmapped order submission and multicast market data. GPU-accelerated risk and matching for quoting at scale.",
    icon: "⚡",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "100μs", label: "Order Latency" },
      { value: "434M", label: "Orders/Sec" },
      { value: "L2", label: "Full Depth" },
      { value: "NY5", label: "Co-Location" },
    ],
    useCases: [
      { title: "ZAP Binary Co-Location", description: "Fixed-frame, zero-allocation binary transport. Certificate-based mTLS sessions. Direct from rack to matching engine with <100μs wire time." },
      { title: "GPU Risk Checks", description: "Parallel pre-trade risk across the entire quote book. CUDA on A100/H100, Metal on macOS, WebGPU in browser. 434M orders/sec verified throughput." },
      { title: "L1/L2 Market Data", description: "Multicast depth feeds, trade prints, and imbalances. WebSocket SSE fallback. Per-venue attribution for aggregated books." },
      { title: "Post-Trade Surveillance", description: "Built-in wash-trade, layering, and spoofing detection. Stay ahead of FINRA CAT findings with automated self-surveillance." },
    ],
    features: [
      "ZAP binary with mmapped order path",
      "Equinix NY5 cross-connect available",
      "GPU-parallel order matching",
      "FIX 4.4 drop-copy ExecutionReport",
      "Multicast L2 market data",
      "Pre-trade risk in <10μs",
      "Wash/layering/spoofing detection",
      "CAT-compliant audit trail",
    ],
    integrations: ["Equinix NY5", "Bloomberg", "Refinitiv", "Chainalysis", "FINRA CAT", "DTCC"],
  },
  "family-offices": {
    title: "Family Offices",
    subtitle: "Private Banking for the Next-Generation Portfolio",
    description: "Multi-generational wealth infrastructure with private securities, pre-IPO access, tokenized real estate, staking, and confidential treasury management. Post-quantum custody protects principal across decades.",
    icon: "🏛️",
    heroImage: "/images/tower_full.jpg",
    stats: [
      { value: "$100M+", label: "Per Account" },
      { value: "7", label: "Asset Classes" },
      { value: "FHE", label: "Confidential" },
      { value: "30yr+", label: "Quantum Horizon" },
    ],
    useCases: [
      { title: "Institutional Account", description: "LEI/EIN-verified institutional account with authorized-trader lists. Per-account position limits, enhanced due diligence, and PEP review workflows." },
      { title: "Alternative Assets", description: "Reg D 506c pre-IPO, Reg A+ property tokens, tokenized US Treasuries, private credit funds. Full cap-table and K-1 automation." },
      { title: "Confidential Portfolio", description: "CKKS FHE encrypts balances and positions on-chain. Run analytics and compliance checks without decrypting. Orders matched on encrypted values." },
      { title: "Multi-Sig + MPC Custody", description: "3-of-5 policy vaults with HSM-backed shards. Principal and trustee roles, timelocks, spend caps, and emergency recovery via social backup." },
    ],
    features: [
      "Reg D 506c verified-accredited access",
      "Reg A+ and Reg CF offerings",
      "Tokenized Treasuries and real estate",
      "CKKS FHE portfolio analytics",
      "3-of-5 MPC with HSM shards",
      "Post-quantum (ML-DSA + Ringtail)",
      "Estate and trust structures",
      "Dedicated relationship manager",
    ],
    integrations: ["Juniper Square", "Addepar", "Carta", "Securitize", "tZERO", "BitGo", "Fireblocks"],
  },
  "hedge-funds": {
    title: "Hedge Funds",
    subtitle: "Prime Brokerage for Crypto-Native Strategies",
    description: "Unified infrastructure for long/short, basis, volatility, and cross-venue arbitrage. 16-venue federated broker, institutional-grade execution algorithms, and GPU-accelerated risk. Built for funds that measure edge in basis points.",
    icon: "📉",
    heroImage: "/images/global.jpg",
    stats: [
      { value: "16", label: "Federated Venues" },
      { value: "T+0", label: "Crypto Settlement" },
      { value: "100μs", label: "ZAP Latency" },
      { value: "24/7", label: "Prime Ops" },
    ],
    useCases: [
      { title: "Cross-Venue Arbitrage", description: "Smart order routing aggregates books from every connected venue. Best-execution routing with per-venue attribution and transaction cost analysis." },
      { title: "Algo Execution", description: "TWAP, VWAP, POV, Iceberg, Sniper, DCA on stocks, crypto, and private securities. Pre-trade risk in <10μs, post-trade TCA with slippage decomposition." },
      { title: "Agentic Research + Execution", description: "Connect research and execution agents via MCP. Skills library: /analyze, /rebalance, /risk for compose-able workflows. Scoped JWT for every agent session." },
      { title: "On-Chain Strategies", description: "Aave/Lido/Compound with institutional risk guardrails. Confidential positions via FHE. Atomic cross-chain via Teleport—no bridge risk." },
    ],
    features: [
      "16-venue federated broker",
      "Smart Order Routing + TCA",
      "All execution algos (TWAP/VWAP/POV)",
      "GPU pre-trade risk <10μs",
      "MCP agentic access (scoped JWT)",
      "FHE encrypted positions",
      "DeFi (Aave, Lido, Compound) integration",
      "Tax-lot accounting (FIFO/LIFO/HIFO)",
    ],
    integrations: ["Alpaca", "BitGo Prime", "Fireblocks", "Chainalysis", "Lukka", "Aave", "Lido", "Compound"],
  },
  "sovereign-wealth": {
    title: "Sovereign Wealth Funds",
    subtitle: "Nation-State Scale Digital Asset Infrastructure",
    description: "Post-quantum signing, FHE confidential computation, and Ringtail lattice threshold signatures built for sovereign-scale custody. Multi-jurisdiction regulated infrastructure with 30-year quantum horizon.",
    icon: "🌐",
    heroImage: "/images/global.jpg",
    stats: [
      { value: "PQ", label: "End-to-End" },
      { value: "30yr+", label: "Quantum Horizon" },
      { value: "L3+", label: "FIPS 140-2" },
      { value: "100%", label: "On-Chain Audit" },
    ],
    useCases: [
      { title: "Post-Quantum Custody", description: "NIST FIPS 204 (ML-DSA), FIPS 203 (ML-KEM), FIPS 205 (SLH-DSA) at every layer. Ringtail (N=768, Q=32,749) 192-bit threshold signatures for nation-scale consensus." },
      { title: "Confidential Reserves", description: "CKKS FHE encrypts sovereign positions on-chain. Public auditability via ZAP Groth16 proofs without disclosing balances, counterparties, or strategy." },
      { title: "Multi-Jurisdiction Operations", description: "Regulated entities in UK (FCA), Luxembourg (CSSF), Isle of Man (IoM FSA), and US (SEC/FINRA). 30+ supported jurisdictions, granular per-country controls." },
      { title: "Programmatic Mandate Enforcement", description: "On-chain policy engine encodes investment mandates. Violations rejected at the matching engine, not post-trade. Full Form ATS transparency." },
    ],
    features: [
      "ML-DSA (Dilithium) signing",
      "ML-KEM (Kyber) key encapsulation",
      "Ringtail 192-bit threshold",
      "CKKS FHE (8 mult levels)",
      "ZAP Groth16 ZK attestation",
      "UK FCA / CSSF / IoM FSA / SEC",
      "30+ jurisdiction engine",
      "HSM-backed shards (FIPS 140-2 L3)",
    ],
    integrations: ["AWS CloudHSM", "Thales Luna", "Chainalysis", "Elliptic", "SWIFT gpi", "Fireblocks"],
  },
  "corporate-treasury": {
    title: "Corporate Treasury",
    subtitle: "Multi-Asset Treasury for Public and Private Companies",
    description: "Manage corporate cash, stablecoin operating balances, crypto strategic reserves, and tokenized Treasuries from a single ledger. Multi-currency, multi-rail, with 4-8% on idle capital and full ERP integration.",
    icon: "💼",
    heroImage: "/images/tablet.jpg",
    stats: [
      { value: "180+", label: "Currencies" },
      { value: "4-8%", label: "Treasury Yield" },
      { value: "T+0", label: "Stablecoin Rails" },
      { value: "200+", label: "Country Coverage" },
    ],
    useCases: [
      { title: "Multi-Currency Operating Account", description: "USD, EUR, GBP, JPY plus 180+ currencies. Virtual IBANs per subsidiary or supplier. Real-time FX at interbank rates, forward contracts up to 12 months." },
      { title: "Stablecoin Treasury", description: "USDC, USDT, PYUSD, EURC for T+0 global settlement. Automated sweep between operating cash and yield accounts. Chainalysis-monitored at every step." },
      { title: "Tokenized T-Bill Ladder", description: "Earn 4-8% APY on idle cash in tokenized Treasuries and money-market funds. Daily liquidity, on-chain transparency, SEC-compliant issuance." },
      { title: "ERP-Integrated Payments", description: "SAP, Oracle, and NetSuite integration for AP automation, 3-way reconciliation, and policy-controlled payouts. OFAC screening on every disbursement." },
    ],
    features: [
      "180+ currency accounts",
      "Virtual IBANs per subsidiary",
      "USDC/USDT/PYUSD/EURC rails",
      "Tokenized T-Bills (4-8% APY)",
      "SAP / Oracle / NetSuite connectors",
      "Forward FX up to 12 months",
      "Automated 3-way reconciliation",
      "OFAC + sanctions on every payment",
    ],
    integrations: ["SAP", "Oracle", "NetSuite", "Coupa", "QuickBooks", "Chainalysis", "SWIFT gpi"],
  },
  "wealth-management": {
    title: "Wealth Management",
    subtitle: "Modern Infrastructure for RIAs and Private Banks",
    description: "Offer crypto, private securities, and tokenized alternatives alongside traditional assets. White-label client portals, automated rebalancing, and full compliance—KYC, accreditation, and Reg D/CF/S/A+ offering-type enforcement.",
    icon: "💎",
    heroImage: "/images/working_team.jpg",
    stats: [
      { value: "7", label: "Asset Classes" },
      { value: "100%", label: "White-Label" },
      { value: "30+", label: "Jurisdictions" },
      { value: "T+1", label: "Equity Settlement" },
    ],
    useCases: [
      { title: "Unified Client Account", description: "Equities, fixed income, crypto, private securities, and tokenized real estate in one branded portal. Tax-lot accounting, K-1 automation, and unified statements." },
      { title: "Model Portfolios + Rebalancing", description: "Agentic rebalancing via MCP's /rebalance skill. Execute model drift corrections with TWAP/VWAP to minimize market impact." },
      { title: "Accreditation-Gated Offerings", description: "Jumio/Onfido third-party accreditation verification for Reg D 506c. Self-certification for 506b. Automatic Reg CF income-based investment caps." },
      { title: "Private Banking Treasury", description: "4-8% yield on client operating cash via tokenized Treasuries. Multi-currency vaults, FX hedging, and trust/IOLTA compliant segregation." },
    ],
    features: [
      "White-label client portal",
      "Accreditation (Reg D 506b/c) enforcement",
      "Reg CF income-based caps",
      "MCP-powered rebalancing (/rebalance)",
      "TWAP/VWAP execution",
      "Tax-lot (FIFO/LIFO/HIFO)",
      "K-1 + 1099 automation",
      "Trust / IOLTA segregation",
    ],
    integrations: ["Alpaca", "Addepar", "Orion", "Black Diamond", "Carta", "Securitize", "tZERO"],
  },
};

interface IndustryContent {
  title: string;
  subtitle: string;
  description: string;
  icon: string;
  heroImage: string;
  stats: { value: string; label: string }[];
  useCases: { title: string; description: string }[];
  features: string[];
  integrations: string[];
}

export default function IndustryPage() {
  const params = useParams();
  const industry = params.industry as string;
  const data = industryData[industry];

  if (!data) {
    return <NotFound>Industry not found</NotFound>;
  }

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <HeroIcon>{data.icon}</HeroIcon>
          <HeroBadge>{data.title}</HeroBadge>
          <HeroTitle>{data.subtitle}</HeroTitle>
          <HeroDescription>{data.description}</HeroDescription>
          <HeroButtons>
            <Link href="https://app.lux.financial/registration" target="_blank">
              <CustomButton>Get Started</CustomButton>
            </Link>
            <Link href="https://cal.com/luxfi" target="_blank">
              <SecondaryButton>Talk to Sales</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <StatsSection>
        <StatsGrid>
          {data.stats.map((stat, i) => (
            <StatCard key={i}>
              <StatValue>{stat.value}</StatValue>
              <StatLabel>{stat.label}</StatLabel>
            </StatCard>
          ))}
        </StatsGrid>
      </StatsSection>

      <Section>
        <SectionTitle>Use Cases</SectionTitle>
        <UseCasesGrid>
          {data.useCases.map((useCase, i) => (
            <UseCaseCard key={i}>
              <UseCaseTitle>{useCase.title}</UseCaseTitle>
              <UseCaseDescription>{useCase.description}</UseCaseDescription>
            </UseCaseCard>
          ))}
        </UseCasesGrid>
      </Section>

      <Section>
        <SectionTitle>Features</SectionTitle>
        <FeaturesGrid>
          {data.features.map((feature, i) => (
            <FeatureItem key={i}>
              <CheckIcon />
              {feature}
            </FeatureItem>
          ))}
        </FeaturesGrid>
      </Section>

      <Section>
        <SectionTitle>Integrations</SectionTitle>
        <IntegrationsGrid>
          {data.integrations.map((integration, i) => (
            <IntegrationBadge key={i}>{integration}</IntegrationBadge>
          ))}
        </IntegrationsGrid>
      </Section>

      <CTASection>
        <CTATitle>Ready to get started?</CTATitle>
        <CTADescription>
          Talk to our team about how Lux can power your {data.title.toLowerCase()} infrastructure.
        </CTADescription>
        <CTAButtons>
          <Link href="https://app.lux.financial/registration" target="_blank">
            <CustomButton>Start Free</CustomButton>
          </Link>
          <Link href="https://cal.com/luxfi" target="_blank">
            <SecondaryButton>Talk to Sales</SecondaryButton>
          </Link>
        </CTAButtons>
      </CTASection>
    </PageContainer>
  );
}

const CheckIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const NotFound = styled.div`
  padding: 10rem 2rem;
  text-align: center;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.8rem;
`;

const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 64px;
  @media ${DeviceSize.sm} { padding: 0 1rem; padding-top: 56px; }
`;

const HeroSection = styled.section`
  padding: 6rem 0 4rem;
  text-align: center;
`;

const HeroContent = styled.div`
  max-width: 800px;
  margin: 0 auto;
`;

const HeroIcon = styled.div`
  font-size: 4rem;
  margin-bottom: 1rem;
`;

const HeroBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 600;
  line-height: 1.1;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1.5rem;
  letter-spacing: -0.02em;
  @media ${DeviceSize.sm} { font-size: 2.8rem; }
`;

const HeroDescription = styled.p`
  font-size: 1.8rem;
  line-height: 1.6;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2rem;
  @media ${DeviceSize.sm} { font-size: 1.6rem; }
`;

const HeroButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  @media ${DeviceSize.sm} { flex-direction: column; }
`;

const StatsSection = styled.section`
  padding: 3rem 0;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 2rem;
  @media ${DeviceSize.sm} { grid-template-columns: repeat(2, 1fr); }
`;

const StatCard = styled.div`
  text-align: center;
`;

const StatValue = styled.div`
  font-size: 3rem;
  font-weight: 700;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.25rem;
`;

const StatLabel = styled.div`
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.muted};
`;

const Section = styled.section`
  padding: 4rem 0;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const SectionTitle = styled.h2`
  font-size: 2.4rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 2rem;
`;

const UseCasesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  @media ${DeviceSize.sm} { grid-template-columns: 1fr; }
`;

const UseCaseCard = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 1.5rem;
  transition: border-color 0.2s ease;
  &:hover {
    border-color: ${({ theme }) => theme.colors.borderHover};
  }
`;

const UseCaseTitle = styled.h3`
  font-size: 1.6rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 0.5rem;
`;

const UseCaseDescription = styled.p`
  font-size: 1.4rem;
  line-height: 1.5;
  color: ${({ theme }) => theme.colors.muted};
`;

const FeaturesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1rem;
  @media ${DeviceSize.sm} { grid-template-columns: 1fr; }
`;

const FeatureItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 1.4rem;
  color: ${({ theme }) => theme.colors.secondary};
  svg { flex-shrink: 0; color: ${({ theme }) => theme.colors.primary}; }
`;

const IntegrationsGrid = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
`;

const IntegrationBadge = styled.span`
  display: inline-block;
  padding: 0.5rem 1rem;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.secondary};
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 20px;
`;

const CTASection = styled.section`
  text-align: center;
  padding: 6rem 0;
`;

const CTATitle = styled.h2`
  font-size: 3rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin-bottom: 1rem;
`;

const CTADescription = styled.p`
  font-size: 1.6rem;
  color: ${({ theme }) => theme.colors.secondary};
  margin-bottom: 2rem;
`;

const CTAButtons = styled.div`
  display: flex;
  gap: 1rem;
  justify-content: center;
  @media ${DeviceSize.sm} { flex-direction: column; }
`;
