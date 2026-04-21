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
  CodeBlock,
  CodeHeader,
  CodeTab,
  CodeContent,
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

const tools = [
  { category: "Market data", tools: "get_quote, get_orderbook, get_trades, subscribe_ticker, get_candles" },
  { category: "Account", tools: "get_balance, get_positions, get_orders, get_fills, get_statement" },
  { category: "Trading", tools: "place_order, cancel_order, modify_order, list_algos, run_twap, run_vwap" },
  { category: "Transfers", tools: "deposit_address, withdraw, transfer_internal, transfer_fiat, check_travel_rule" },
  { category: "Compliance", tools: "verify_accreditation, attest_kyc, screen_address, get_audit_log" },
  { category: "Research", tools: "get_research, get_filings, get_earnings, get_news, summarize_ticker" },
];

export default function MCPPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#22D3EE">Technology · MCP</ProductBadge>
          <HeroTitle>The bank as a tool an agent can call.</HeroTitle>
          <HeroSubtitle>
            Every REST endpoint, WebSocket stream, and FIX command is also exposed as a
            Model Context Protocol tool. AI agents authenticate with scoped JWTs, pass the
            same compliance pipeline as humans, and sign with the same
            <Link href="/technology/mpc" style={{ color: "#8B5CF6" }}> MPC </Link>
             cohort.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
            <Link href={`${DOCS}/mcp`} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>MCP Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Why MCP, not just API keys.</BlockTitle>
          <BlockText>
            MCP is the protocol Claude, Cursor, and major agent frameworks speak natively. A
            well-designed MCP server exposes self-describing tools, strongly-typed parameters,
            and streamable results — agents can discover what they can do without
            custom prompting.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Self-describing schemas — agents learn the API from the protocol</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Strongly typed params — no hallucinated fields</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Streaming results — long-running algos emit progress</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Transport-agnostic — stdio, SSE, HTTP streaming</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Tool surface.</BlockTitle>
          <SpecsTable>
            <SpecsRow $header>
              <SpecsLabel $header>Category</SpecsLabel>
              <SpecsLabel $header>Tools</SpecsLabel>
            </SpecsRow>
            {tools.map((t) => (
              <SpecsRow key={t.category}>
                <SpecsLabel>{t.category}</SpecsLabel>
                <SpecsValue>{t.tools}</SpecsValue>
              </SpecsRow>
            ))}
          </SpecsTable>
        </ContentBlock>
      </TwoColumnSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Agent security model</SectionTitle>
          <SectionSubtitle>
            Agents are first-class principals. They get their own JWT, their own MPC
            share, their own policy.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          <Card $accent="#22D3EE">
            <CardTitle>Scoped JWT</CardTitle>
            <CardDescription>
              An agent&apos;s JWT carries scopes (e.g. <code>trading.spot</code>, <code>market_data.read</code>)
              and a principal ID — never the user&apos;s root key. The Gateway strips any
              identity headers the agent tries to inject.
            </CardDescription>
          </Card>
          <Card $accent="#22D3EE">
            <CardTitle>MPC with a twist</CardTitle>
            <CardDescription>
              Agents can sign their allowed actions autonomously — but their MPC share is
              paired with a policy share. Out-of-policy actions require a human co-signer.
            </CardDescription>
          </Card>
          <Card $accent="#22D3EE">
            <CardTitle>Same compliance pipe</CardTitle>
            <CardDescription>
              Agent orders go through KYC / sanctions / Travel Rule just like human ones.
              The regulator log doesn&apos;t know (or care) whether an agent or a person pressed the button.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Quick start</SectionTitle>
          <SectionSubtitle>
            Point any MCP-capable agent at our server URL.
          </SectionSubtitle>
        </SectionHeader>
        <CodeBlock>
          <CodeHeader>
            <CodeTab $active>claude_desktop_config.json</CodeTab>
          </CodeHeader>
          <CodeContent>{`{
  "mcpServers": {
    "lux-financial": {
      "command": "npx",
      "args": ["-y", "@luxfi/mcp"],
      "env": {
        "LUX_API_KEY": "sk_live_...",
        "LUX_ACCOUNT_ID": "acct_..."
      }
    }
  }
}`}</CodeContent>
        </CodeBlock>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>What agents do on Lux.</BlockTitle>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Treasury rebalancing — scheduled or event-driven</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Research-driven portfolio ops with cited sources</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Market-making bots bounded by MPC policy</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Accounting close — pull fills, reconcile, emit journal entries</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Compliance monitors — scan flows, flag outliers, file SAR drafts</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Built on Hanzo MCP infra.</BlockTitle>
          <BlockText>
            Lux MCP server builds on <code>@hanzo/mcp</code> — the most widely-deployed MCP
            framework with 260+ reference tools. Same auth model, same observability, same
            SDK pattern used by Hanzo AI&apos;s customers.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Transport: stdio, SSE, HTTP streaming</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Tool discovery, prompts, and resources fully implemented</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#22D3EE"><CheckIcon /></FeatureCheck><FeatureText>Cross-compatible with Claude Desktop, Cursor, Cline, Continue</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <CTASection>
        <CTATitle>Agents are principals.</CTATitle>
        <CTASubtitle>
          Give your AI a trading desk — with the exact same controls you&apos;d give a junior trader.
        </CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
          <Link href={`${DOCS}/agentic-trading`} target="_blank" rel="noopener noreferrer">
            <SecondaryButton>Agentic Trading Docs</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
