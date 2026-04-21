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

const schemes = [
  { name: "CGGMP21 (ECDSA)", role: "secp256k1, Ethereum / Bitcoin signing", refresh: "Non-interactive key refresh" },
  { name: "GG18 / GG20", role: "Legacy ECDSA cohorts — supported for migration only", refresh: "Interactive" },
  { name: "FROST", role: "Ed25519 threshold Schnorr signing (Solana, Sui)", refresh: "Round-optimized" },
  { name: "Ringtail (N=768)", role: "Post-quantum threshold ML-DSA signing", refresh: "Non-interactive, aggregate" },
];

const topologies = [
  { topology: "2-of-3", when: "Consumer wallet — user + iCloud/Google + recovery service" },
  { topology: "3-of-5", when: "Treasury — CFO + COO + security + bank HSM + cold backup" },
  { topology: "16-of-N", when: "Institutional custody — N independent co-signers, large-threshold quorum" },
  { topology: "t-of-n with roles", when: "Policy-aware — trader can sign spot, CFO required for withdrawal" },
];

export default function MPCPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#8B5CF6">Technology · MPC</ProductBadge>
          <HeroTitle>Multi-party signing. No single point of theft.</HeroTitle>
          <HeroSubtitle>
            CGGMP21 threshold ECDSA + Ringtail post-quantum threshold signing. Keys are
            born distributed, live distributed, and die distributed — no one ever
            assembles the whole private key, not even us.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
            <Link href={`${DOCS}/blockchain`} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>MPC Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Why MPC beats multi-sig.</BlockTitle>
          <BlockText>
            On-chain multi-sig announces your co-signer set — giving attackers a target list
            and raising gas costs with every signer added. Threshold MPC produces a single
            on-chain signature; the chain sees one key, while the key material lives shared
            across the cohort.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>One on-chain signature — same gas as EOA</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>No co-signer disclosure</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>Proactive share refresh — compromised share becomes useless</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>Chain-agnostic — works on EVM, Bitcoin, Solana, Cosmos</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Threshold schemes we ship.</BlockTitle>
          <SpecsTable>
            <SpecsRow $header>
              <SpecsLabel $header>Scheme</SpecsLabel>
              <SpecsLabel $header>Role</SpecsLabel>
            </SpecsRow>
            {schemes.map((s) => (
              <SpecsRow key={s.name}>
                <SpecsLabel>{s.name}</SpecsLabel>
                <SpecsValue>
                  <div>{s.role}</div>
                  <div style={{ fontSize: "1.2rem", opacity: 0.6 }}>{s.refresh}</div>
                </SpecsValue>
              </SpecsRow>
            ))}
          </SpecsTable>
        </ContentBlock>
      </TwoColumnSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Cohort topologies</SectionTitle>
          <SectionSubtitle>
            Pick the policy that matches your risk. Mix user devices, HSMs, and independent custodians.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={2}>
          {topologies.map((t) => (
            <Card key={t.topology} $accent="#8B5CF6">
              <CardTitle>{t.topology}</CardTitle>
              <CardDescription>{t.when}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Protocol properties</SectionTitle>
          <SectionSubtitle>What CGGMP21 gives you — and what to watch for.</SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          <Card>
            <CardTitle>UC-secure</CardTitle>
            <CardDescription>
              Universally composable — security holds under arbitrary concurrent execution.
              Proven in the standard model.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Identifiable abort</CardTitle>
            <CardDescription>
              If a cohort member cheats during signing, the protocol aborts and cryptographically
              names the attacker. No silent compromise.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Non-interactive refresh</CardTitle>
            <CardDescription>
              Rotate shares without changing the public key. Compromised shares become useless
              at the next epoch.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Biased-range ZK</CardTitle>
            <CardDescription>
              Paillier ciphertexts proven in range via low-overhead range proofs. Keeps signing latency &lt; 300ms.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Batch-verifiable</CardTitle>
            <CardDescription>
              Aggregate hundreds of threshold signatures into a single batch proof for audit.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Ringtail bridge</CardTitle>
            <CardDescription>
              Same cohort can sign classical ECDSA and post-quantum ML-DSA. Migrate without
              redistributing shares.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Where it plugs in.</BlockTitle>
          <BlockText>
            Lux MPC is the engine beneath our <Link href="/non-custodial" style={{ color: "#22C55E" }}>non-custodial bank</Link>.
            Every withdrawal, trade, and governance vote traverses a threshold cohort that
            includes the user device, validator nodes, and HSM-rooted backups.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>Consumer wallets: 2-of-3 with device + cloud + recovery</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>Treasury: 3-of-5 with HSM anchoring</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>Validator keys: 16-of-N Ringtail for Quasar consensus</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>Bridge relayers: t-of-n with policy-gated asset limits</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Open source.</BlockTitle>
          <BlockText>
            Lux MPC is built on <code>github.com/luxfi/mpc</code> — reviewed by Trail of
            Bits, formally modeled in Tamarin, and used in production for Lux Network validator
            keys and custody.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>Rust core, Go + TypeScript + Swift bindings</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>Trusted-dealer and dealerless DKG modes</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#8B5CF6"><CheckIcon /></FeatureCheck><FeatureText>Deterministic signing for integration tests</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <CTASection>
        <CTATitle>Your keys. Split.</CTATitle>
        <CTASubtitle>Integrate Lux MPC or run your own cohort with our SDKs.</CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
          <Link href={`${DOCS}/blockchain`} target="_blank" rel="noopener noreferrer">
            <SecondaryButton>Read the Docs</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
