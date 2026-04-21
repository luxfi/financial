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
  StatsRow,
  StatCard,
  StatValue,
  StatLabel,
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

const workloads = [
  {
    title: "Parallel EVM",
    description:
      "Block execution parallelized across non-conflicting transactions on H100 warps. Optimistic concurrency with dependency tracking.",
  },
  {
    title: "DEX matching",
    description:
      "Orderbook match + AMM price quote as a single fused kernel. 434M orders/sec sustained on a single 8xH100 node.",
  },
  {
    title: "FHE evaluation",
    description:
      "CKKS rescale, rotate, and multiply implemented as CUDA kernels. ~20x speedup over CPU on matching workloads.",
  },
  {
    title: "ZK proving",
    description:
      "Groth16 / Plonk witness generation and MSM on GPU. Proof generation in the sub-second range for ZAP circuits.",
  },
  {
    title: "Risk &amp; portfolio VaR",
    description:
      "Monte Carlo VaR and stress testing over encrypted positions — batch-parallelized at portfolio level.",
  },
  {
    title: "Sanctions ANN",
    description:
      "Approximate-nearest-neighbor lookup over billions of addresses / names with CUDA-accelerated FAISS.",
  },
];

export default function GPUPage() {
  return (
    <PageContainer>
      <HeroSection>
        <HeroContent>
          <ProductBadge $color="#FF6B6B">Technology · GPU Engine</ProductBadge>
          <HeroTitle>434M orders per second.</HeroTitle>
          <HeroSubtitle>
            Matching, risk, EVM execution, FHE, and ZK proving — all fused into CUDA
            kernels running on H100 and H200 clusters. The hot path never touches a CPU
            after the gateway hands off.
          </HeroSubtitle>
          <HeroButtons>
            <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
            <Link href={`${DOCS}/gpu`} target="_blank" rel="noopener noreferrer">
              <SecondaryButton>GPU Docs</SecondaryButton>
            </Link>
          </HeroButtons>
        </HeroContent>
      </HeroSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Benchmarks</SectionTitle>
          <SectionSubtitle>
            Single-node numbers on 8xH100 SXM. Scales linearly across nodes.
          </SectionSubtitle>
        </SectionHeader>
        <StatsRow>
          <StatCard>
            <StatValue $color="#FF6B6B">434M</StatValue>
            <StatLabel>orders/sec matched (single node)</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $color="#FF6B6B">~100μs</StatValue>
            <StatLabel>ZAP proof verify over the wire</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $color="#FF6B6B">~500μs</StatValue>
            <StatLabel>FIX 4.4 round-trip, matched</StatLabel>
          </StatCard>
          <StatCard>
            <StatValue $color="#FF6B6B">20×</StatValue>
            <StatLabel>CKKS speedup vs CPU AVX-512</StatLabel>
          </StatCard>
        </StatsRow>
      </Section>

      <Section>
        <SectionHeader>
          <SectionTitle>What runs on the GPU</SectionTitle>
          <SectionSubtitle>
            Six production workloads share the same CUDA runtime and scheduler.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          {workloads.map((w) => (
            <Card key={w.title} $accent="#FF6B6B">
              <CardTitle>{w.title}</CardTitle>
              <CardDescription>{w.description}</CardDescription>
            </Card>
          ))}
        </CardGrid>
      </Section>

      <TwoColumnSection>
        <ContentBlock>
          <BlockTitle>Why GPU for finance.</BlockTitle>
          <BlockText>
            CPUs matched orders for thirty years because the order book fits in L2 cache
            and matching is serial-by-price-level. GPUs win when you fuse matching with
            risk, EVM dispatch, and FHE — the combined workload is embarrassingly parallel,
            bandwidth-bound, and dominated by large-linear-algebra primitives (MSM, NTT,
            CKKS mult).
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#FF6B6B"><CheckIcon /></FeatureCheck><FeatureText>Warp-level speculation for parallel EVM</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#FF6B6B"><CheckIcon /></FeatureCheck><FeatureText>Persistent kernels — no per-block launch overhead</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#FF6B6B"><CheckIcon /></FeatureCheck><FeatureText>NVLink shared-mem for cross-SM order book views</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#FF6B6B"><CheckIcon /></FeatureCheck><FeatureText>RDMA from NIC to GPU for sub-microsecond ingress</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
        <ContentBlock>
          <BlockTitle>Deterministic by design.</BlockTitle>
          <BlockText>
            A consensus-safe GPU engine has to be deterministic — same inputs always produce
            the same block. We pin kernel launch orders, disable floating-point
            non-determinism paths, and run a CPU shadow for every block until consensus
            commits.
          </BlockText>
          <FeatureList>
            <FeatureItem><FeatureCheck $color="#FF6B6B"><CheckIcon /></FeatureCheck><FeatureText>No floating-point in hot path — fixed-point arithmetic only</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#FF6B6B"><CheckIcon /></FeatureCheck><FeatureText>Pinned warp scheduling — no kernel-launch non-determinism</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#FF6B6B"><CheckIcon /></FeatureCheck><FeatureText>Dual-run CPU shadow for every block, cross-checked before commit</FeatureText></FeatureItem>
            <FeatureItem><FeatureCheck $color="#FF6B6B"><CheckIcon /></FeatureCheck><FeatureText>Replayable audit traces — every block re-executes bit-identical</FeatureText></FeatureItem>
          </FeatureList>
        </ContentBlock>
      </TwoColumnSection>

      <Section>
        <SectionHeader>
          <SectionTitle>Deployment shapes</SectionTitle>
          <SectionSubtitle>
            Run the GPU engine where your regulator wants it.
          </SectionSubtitle>
        </SectionHeader>
        <CardGrid $cols={3}>
          <Card $accent="#FF6B6B">
            <CardTitle>Lux-hosted</CardTitle>
            <CardDescription>
              We run H100/H200 clusters at Equinix NY5, LD4, TY3. Co-location available
              for HFT customers; cross-connect to your rack.
            </CardDescription>
          </Card>
          <Card $accent="#FF6B6B">
            <CardTitle>Self-hosted</CardTitle>
            <CardDescription>
              Ship the Lux GPU engine into your own data center. Same image, same
              determinism guarantees. For jurisdictions requiring on-prem execution.
            </CardDescription>
          </Card>
          <Card $accent="#FF6B6B">
            <CardTitle>Cloud (hybrid)</CardTitle>
            <CardDescription>
              Burst into AWS P5 / GCP A3 / Azure ND H100 v5 for stress tests or peak load.
              Matching stays on your primary cluster.
            </CardDescription>
          </Card>
        </CardGrid>
      </Section>

      <CTASection>
        <CTATitle>The fastest matching engine ever shipped.</CTATitle>
        <CTASubtitle>
          Benchmark it yourself on Lux testnet — or run a private cluster against your own book.
        </CTASubtitle>
        <HeroButtons>
          <Link href="/contact"><CustomButton>Talk to Engineering</CustomButton></Link>
          <Link href={`${DOCS}/benchmarks`} target="_blank" rel="noopener noreferrer">
            <SecondaryButton>Benchmarks</SecondaryButton>
          </Link>
        </HeroButtons>
      </CTASection>
    </PageContainer>
  );
}
