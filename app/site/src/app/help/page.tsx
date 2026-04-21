"use client";

import { useState } from "react";
import Link from "next/link";
import styled from "styled-components";
import { DeviceSize } from "@/styles/theme/default";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

const BookIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M4 19.5v-15A2.5 2.5 0 0 1 6.5 2H20v20H6.5a2.5 2.5 0 0 1 0-5H20" />
  </svg>
);

const CodeIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
  </svg>
);

const ShieldIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const StatusIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const DiscordIcon = () => (
  <svg viewBox="0 0 24 24" fill="currentColor">
    <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0 12.64 12.64 0 0 0-.617-1.25.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057 19.9 19.9 0 0 0 5.993 3.03.078.078 0 0 0 .084-.028 14.09 14.09 0 0 0 1.226-1.994.076.076 0 0 0-.041-.106 13.107 13.107 0 0 1-1.872-.892.077.077 0 0 1-.008-.128 10.2 10.2 0 0 0 .372-.292.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127 12.299 12.299 0 0 1-1.873.892.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028 19.839 19.839 0 0 0 6.002-3.03.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03z" />
  </svg>
);

const ChevronIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

const ArrowIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M7 17L17 7M17 7H7M17 7v10" />
  </svg>
);

const DOCS_BASE = "https://docs.lux.financial/docs";

const categories = [
  {
    icon: BookIcon,
    title: "Onboarding",
    description: "Account setup, KYC, funding, and sandbox access.",
    href: `${DOCS_BASE}/onboarding`,
  },
  {
    icon: CodeIcon,
    title: "API Reference",
    description: "REST endpoints, request/response schemas, error codes.",
    href: `${DOCS_BASE}/api-reference-full`,
  },
  {
    icon: BookIcon,
    title: "SDKs",
    description: "Official client libraries for Go, TypeScript, Python, Rust.",
    href: `${DOCS_BASE}/sdk`,
  },
  {
    icon: BookIcon,
    title: "Orders",
    description: "Order lifecycle, fills, cancels, and execution reports.",
    href: `${DOCS_BASE}/orders`,
  },
  {
    icon: BookIcon,
    title: "Market Data",
    description: "Real-time L1/L2 quotes, trades, and historical bars.",
    href: `${DOCS_BASE}/market-data`,
  },
  {
    icon: CodeIcon,
    title: "WebSocket",
    description: "Streaming quotes, trades, and order-status channels.",
    href: `${DOCS_BASE}/websocket`,
  },
  {
    icon: ShieldIcon,
    title: "Compliance",
    description: "KYC/AML, sanctions screening, SAR/CTR reporting.",
    href: `${DOCS_BASE}/compliance-full`,
  },
  {
    icon: ShieldIcon,
    title: "Security",
    description: "Post-quantum crypto, FHE, MPC custody, HSM key storage.",
    href: `${DOCS_BASE}/quantum`,
  },
];

const faqs = [
  {
    q: "How do I get API credentials?",
    a: "Sign up at https://app.lux.financial. Sandbox keys are issued immediately. Production keys require completing KYB. See the Onboarding guide for a full walkthrough.",
    doc: `${DOCS_BASE}/onboarding`,
  },
  {
    q: "What asset classes can I trade?",
    a: "Public markets (stocks, fixed income, commodities, forex), private markets (privates, pre-IPO), and digital markets (crypto). Full asset coverage and venue list are documented under Trading.",
    doc: `${DOCS_BASE}/trading`,
  },
  {
    q: "Which order types are supported?",
    a: "Market, limit (GTC/IOC/FOK/DAY), stop, stop-limit, bracket, and algorithmic orders including TWAP, VWAP, POV, and iceberg. See Execution for routing and algo specs.",
    doc: `${DOCS_BASE}/execution`,
  },
  {
    q: "How do I connect a FIX 4.4 session?",
    a: "Co-located and institutional partners connect via FIX 4.4 with CompID + password. REST-only integrations start at ~5ms, FIX drops to ~500us, ZAP binary to ~100us. Contact partners@lux.financial for session credentials.",
    doc: `${DOCS_BASE}/hft`,
  },
  {
    q: "What are the API rate limits?",
    a: "Sandbox: 100 req/min. Production: 1,000 req/min standard. Institutional and HFT tiers get higher dedicated limits. WebSocket streams have no per-message limits within channel subscriptions.",
    doc: `${DOCS_BASE}/api-reference-full`,
  },
  {
    q: "What settlement timelines apply?",
    a: "Crypto settles T+0 on-chain. US equities settle T+1. Forex settles T+2. Privates/pre-IPO settle on closing. Full settlement-rail map is in the Trading doc.",
    doc: `${DOCS_BASE}/trading`,
  },
  {
    q: "How is compliance handled?",
    a: "Multi-jurisdiction KYC/AML with sanctions (OFAC/EU/UK/UN) screening, PEP checks, travel-rule (FATF-compliant), SAR/CTR filing, and Reg SHO / Reg T / Reg NMS controls on relevant venues.",
    doc: `${DOCS_BASE}/compliance-full`,
  },
  {
    q: "How does agentic / MCP access work?",
    a: "Every REST endpoint is exposed over Model Context Protocol. AI agents authenticate with scoped JWTs, stream quotes over WebSocket, and submit orders with the same compliance pipeline as human traders.",
    doc: `${DOCS_BASE}/agentic-trading`,
  },
];

export default function Help() {
  const [query, setQuery] = useState("");
  const normalized = query.trim().toLowerCase();
  const visibleFaqs = normalized
    ? faqs.filter(
        (f) =>
          f.q.toLowerCase().includes(normalized) ||
          f.a.toLowerCase().includes(normalized)
      )
    : faqs;

  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <HeroBadge>Help Center</HeroBadge>
          <HeroTitle>Find answers fast.</HeroTitle>
          <HeroSubtitle>
            Self-serve knowledge base for developers and operators. Search our docs,
            browse topics, or jump straight to the API reference.
          </HeroSubtitle>
          <SearchBox>
            <SearchIcon />
            <SearchInput
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search help articles..."
              aria-label="Search help"
            />
          </SearchBox>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionTitle>Browse by topic</SectionTitle>
        <CategoriesGrid>
          {categories.map((c) => (
            <CategoryCard key={c.title} href={c.href} target="_blank" rel="noopener noreferrer">
              <CategoryIcon>
                <c.icon />
              </CategoryIcon>
              <CategoryTitle>{c.title}</CategoryTitle>
              <CategoryDescription>{c.description}</CategoryDescription>
              <CategoryLink>
                Read docs <ArrowIcon />
              </CategoryLink>
            </CategoryCard>
          ))}
        </CategoriesGrid>
      </Section>

      <Section>
        <SectionTitle>Frequently asked questions</SectionTitle>
        <FAQList>
          {visibleFaqs.length === 0 ? (
            <EmptyState>
              No matches. Try a different search term, or{" "}
              <Link href="/contact">contact sales</Link>.
            </EmptyState>
          ) : (
            visibleFaqs.map((f) => (
              <FAQItem key={f.q}>
                <FAQQuestion>
                  {f.q}
                  <ChevronIcon />
                </FAQQuestion>
                <FAQAnswer>
                  <p>{f.a}</p>
                  <Link href={f.doc} target="_blank" rel="noopener noreferrer">
                    Related docs →
                  </Link>
                </FAQAnswer>
              </FAQItem>
            ))
          )}
        </FAQList>
      </Section>

      <Section>
        <SectionTitle>Still need help?</SectionTitle>
        <RouteGrid>
          <RouteCard>
            <RouteTitle>Developer community</RouteTitle>
            <RouteText>
              Discuss integrations, share patterns, and get peer support in our Discord.
            </RouteText>
            <RouteLink href="https://discord.gg/luxfinance" target="_blank" rel="noopener noreferrer">
              <DiscordIcon /> Join Discord
            </RouteLink>
          </RouteCard>
          <RouteCard>
            <RouteTitle>System status</RouteTitle>
            <RouteText>
              Live uptime dashboards, scheduled maintenance windows, and incident history.
            </RouteText>
            <RouteLink href="https://status.lux.financial" target="_blank" rel="noopener noreferrer">
              <StatusIcon /> View status
            </RouteLink>
          </RouteCard>
          <RouteCard>
            <RouteTitle>Paying customer?</RouteTitle>
            <RouteText>
              SLA-backed technical support with priority routing and incident response.
            </RouteText>
            <RouteLink href="/support">
              <BookIcon /> Support plans
            </RouteLink>
          </RouteCard>
          <RouteCard>
            <RouteTitle>New integration?</RouteTitle>
            <RouteText>
              Talk to sales about volume pricing, white-label, and custom deployments.
            </RouteText>
            <RouteLink href="/contact">
              <BookIcon /> Contact sales
            </RouteLink>
          </RouteCard>
        </RouteGrid>
      </Section>
    </PageContainer>
  );
}

const PageContainer = styled.main`
  width: 100%;
  max-width: 1120px;
  margin: 0 auto;
  padding: 0 2rem;
  padding-top: 64px;

  @media ${DeviceSize.sm} {
    padding: 0 1rem;
    padding-top: 56px;
  }
`;

const HeroSection = styled.section`
  padding: 5rem 0 3rem;
  text-align: center;

  @media ${DeviceSize.sm} {
    padding: 3rem 0 2rem;
  }
`;

const HeroContent = styled.div`
  max-width: 680px;
  margin: 0 auto;
`;

const HeroBadge = styled.span`
  display: inline-block;
  padding: 0.4rem 1rem;
  font-size: 1.2rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.65);
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 20px;
  margin-bottom: 1.5rem;
`;

const HeroTitle = styled.h1`
  font-size: 4rem;
  font-weight: 600;
  line-height: 1.1;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1rem;
  letter-spacing: -0.02em;

  @media ${DeviceSize.sm} {
    font-size: 3rem;
  }
`;

const HeroSubtitle = styled.p`
  font-size: 1.6rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  margin-bottom: 2rem;
`;

const SearchBox = styled.div`
  max-width: 560px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.875rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 10px;

  svg {
    width: 1.6rem;
    height: 1.6rem;
    color: rgba(255, 255, 255, 0.45);
  }

  &:focus-within {
    border-color: rgba(255, 255, 255, 0.2);
    background: rgba(255, 255, 255, 0.05);
  }
`;

const SearchInput = styled.input`
  flex: 1;
  background: none;
  border: none;
  outline: none;
  font-size: 1.5rem;
  font-family: inherit;
  color: rgba(255, 255, 255, 0.92);

  &::placeholder {
    color: rgba(255, 255, 255, 0.35);
  }
`;

const Section = styled.section`
  padding: 3rem 0;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
`;

const SectionTitle = styled.h2`
  font-size: 2rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
  margin-bottom: 1.5rem;
`;

const CategoriesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

const CategoryCard = styled.a`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  text-decoration: none;
  transition: all 0.15s ease;

  &:hover {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.12);
    transform: translateY(-1px);
  }
`;

const CategoryIcon = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  display: flex;
  align-items: center;
  justify-content: center;
  color: rgba(255, 255, 255, 0.75);
  margin-bottom: 0.5rem;

  svg {
    width: 16px;
    height: 16px;
  }
`;

const CategoryTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

const CategoryDescription = styled.p`
  font-size: 1.3rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.45);
  flex: 1;
`;

const CategoryLink = styled.span`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.75);
  margin-top: 0.5rem;

  svg {
    width: 12px;
    height: 12px;
  }
`;

const FAQList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 820px;
`;

const FAQItem = styled.details`
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
  padding: 1.25rem 1.5rem;

  &[open] {
    background: rgba(255, 255, 255, 0.04);
    border-color: rgba(255, 255, 255, 0.1);
  }
`;

const FAQQuestion = styled.summary`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.5rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  cursor: pointer;
  list-style: none;

  &::-webkit-details-marker {
    display: none;
  }

  svg {
    width: 16px;
    height: 16px;
    color: rgba(255, 255, 255, 0.45);
    transition: transform 0.2s ease;
  }

  details[open] & svg {
    transform: rotate(180deg);
  }
`;

const FAQAnswer = styled.div`
  font-size: 1.4rem;
  line-height: 1.6;
  color: rgba(255, 255, 255, 0.65);
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);

  p {
    margin: 0 0 0.75rem 0;
  }

  a {
    color: rgba(255, 255, 255, 0.92);
    text-decoration: none;
    font-weight: 500;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);

    &:hover {
      color: white;
      border-color: white;
    }
  }
`;

const EmptyState = styled.p`
  font-size: 1.5rem;
  color: rgba(255, 255, 255, 0.55);
  padding: 2rem 0;

  a {
    color: rgba(255, 255, 255, 0.92);
    text-decoration: underline;
  }
`;

const RouteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;

  @media ${DeviceSize.md} {
    grid-template-columns: repeat(2, 1fr);
  }

  @media ${DeviceSize.sm} {
    grid-template-columns: 1fr;
  }
`;

const RouteCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: 10px;
`;

const RouteTitle = styled.h3`
  font-size: 1.5rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.92);
`;

const RouteText = styled.p`
  font-size: 1.3rem;
  line-height: 1.5;
  color: rgba(255, 255, 255, 0.45);
  flex: 1;
`;

const RouteLink = styled(Link)`
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 1.3rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.92);
  text-decoration: none;
  margin-top: 0.5rem;

  svg {
    width: 14px;
    height: 14px;
  }

  &:hover {
    color: white;
  }
`;
