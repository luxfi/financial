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

const ckksParams = [
  { param: "Scheme", value: "CKKS (approximate arithmetic, real/complex)" },
  { param: "Ring dimension (N)", value: "2^14 = 16,384" },
  { param: "Multiplicative depth", value: "8 levels after bootstrap" },
  { param: "Ciphertext size", value: "~128 KB per packed ciphertext" },
  { param: "Security level", value: "128-bit (LWE hardness)" },
  { param: "Acceleration", value: "GPU (CUDA) + CPU AVX-512 paths" },
];

const usecases = [
  {
    title: "Confidential matching",
    description:
      "Price and size ciphertexts cross in a CLOB without either counterparty seeing the other. Fills decrypt only for trade parties.",
  },
  {
    title: "Dark-pool orders",
    description:
      "Institutional orders posted as FHE ciphertexts. Market makers quote against encrypted depth; no pre-trade leakage.",
  },
  {
    title: "Encrypted portfolio analytics",
    description:
      "Risk, P&amp;L, and exposure reports computed on encrypted positions. The analytics service never sees plaintext holdings.",
  },
  {
    title: "Blind credit scoring",
    description:
      "Lenders evaluate encrypted balance, income, and on-chain history. Only the yes/no decision — and the applicant — see the underlying data.",
  },
  {
    title: "Private order book depth",
    description:
      "Level-2 depth available to subscribers as ciphertexts; aggregated totals decrypt publicly, but individual orders stay hidden.",
  },
  {
    title: "MPC + FHE compliance",
    description:
      "Sanctions screen and Travel Rule evaluate encrypted counterparty data. &quot;Is this address on the SDN list?&quot; answered without revealing the address.",
  },
];

export default function FHEPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#A855F7">Technology · FHE</ProductBadge>
          <HeroTitle>Computing on ciphertext.</HeroTitle>
          <HeroSubtitle>
            CKKS fully-homomorphic encryption lets our matching engine, risk engine, and
            compliance engine operate directly on encrypted trades. The platform never
            sees plaintext prices, sizes, or positions — the math runs on the ciphertexts.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
            <Link href={`${DOCS}/fhe`} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>FHE Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Why CKKS, not BFV / TFHE.</BlockTitle>
          <BlockText>
            Matching orders is arithmetic over prices — not boolean gates. CKKS (Cheon–Kim–Kim–Song)
            natively supports approximate real-number arithmetic with SIMD-style packing,
            making it the right tool for the financial workload. BFV/BGV make exact integer
            math more expensive; TFHE optimizes for boolean circuits.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#A855F7"><CheckIcon /></FeatureCheck><FeatureText>SIMD packing — 8,192 order prices in one ciphertext</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#A855F7"><CheckIcon /></FeatureCheck><FeatureText>Multiply + add in a single scheme, no branch conversion</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#A855F7"><CheckIcon /></FeatureCheck><FeatureText>Rescaling after each mult keeps noise growth bounded</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#A855F7"><CheckIcon /></FeatureCheck><FeatureText>Bootstrappable — depths beyond 8 supported with refreshing</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Parameters.</BlockTitle>
          <SpecsTable>
            {ckksParams.map((p) => (
              <SpecsRow key={p.param}>
                <SpecsLabel>{p.param}</SpecsLabel>
                <SpecsValue>{p.value}</SpecsValue>
              </SpecsRow>
            ))}
          </SpecsTable>
        </ContentBlock>
      </TwoColumnSection>

      <Section>
        <SectionHeader>
          <SectionTitle>What we actually do with it</SectionTitle>
          <SectionSubtitle>
            Six live workloads. All ship today, all benchmarked in production.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          {usecases.map((u) => (
            <Card key={u.title} $accent="#A855F7">
              <CardTitle>{u.title}</CardTitle>
              <CardDescription>{u.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>Architecture</SectionTitle>
          <SectionSubtitle>
            FHE is a coprocessor. Most hot-path actions remain plaintext; only the
            confidential lanes traverse the CKKS engine.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          <Card>
            <CardTitle>Client-side encryption</CardTitle>
            <CardDescription>
              Orders encrypted in the browser / mobile SDK with the tenant&apos;s CKKS public
              key. Plaintext never leaves the user device.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>FHE coprocessor</CardTitle>
            <CardDescription>
              GPU-accelerated CKKS evaluator runs matching, aggregation, and risk circuits.
              The coprocessor sees ciphertexts only — no key material.
            </CardDescription>
          </Card>
          <Card>
            <CardTitle>Threshold decryption</CardTitle>
            <CardDescription>
              Only results addressed to counterparties are decrypted, via an MPC threshold
              of the decryption key. The platform can never unilaterally decrypt.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Performance, honestly.</BlockTitle>
          <BlockText>
            FHE is not free. A single ciphertext multiplication at ring-14 costs ~10ms on
            CPU, ~0.5ms on GPU. We use FHE where confidentiality matters more than
            microseconds — dark-pool books, encrypted analytics, private scoring — and
            plaintext CLOBs for commodity order flow.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#A855F7"><CheckIcon /></FeatureCheck><FeatureText>Encrypted CLOB: ~50ms p99 match latency (vs ~5μs plaintext)</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#A855F7"><CheckIcon /></FeatureCheck><FeatureText>Encrypted portfolio: ~120ms for 10k positions, continuously</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#A855F7"><CheckIcon /></FeatureCheck><FeatureText>Batch aggregation amortizes cost across thousands of users</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Paired with ZAP.</BlockTitle>
          <BlockText>
            FHE keeps the computation private; <Link href="/technology/zap" style={{ color: "#EF4444" }}>ZAP</Link> publishes succinct proofs that the
            computation was correct. Together they give the best of both worlds: nothing is
            revealed, but everything is verifiable.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#A855F7"><CheckIcon /></FeatureCheck><FeatureText>Trade fills: ZK proof that match was valid &amp; within policy</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#A855F7"><CheckIcon /></FeatureCheck><FeatureText>Portfolio analytics: ZK proof of computation, regulator-auditable</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#A855F7"><CheckIcon /></FeatureCheck><FeatureText>Compliance checks: ZK attestation without revealing counterparty</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <CTASection>
        <CTATitle>Compute on the cipher.</CTATitle>
        <CTASubtitle>
          Integrate FHE order types via our SDK. Your clients&apos; orders stay encrypted end-to-end.
        </CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
          <Link href={`${DOCS}/fhe`} target="_blank" rel="noopener noreferrer">
            <SecondaryButton>FHE Docs</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
