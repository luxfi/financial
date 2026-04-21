import IndustryPage from "./IndustryPage";

export function generateStaticParams() {
  return [
    { industry: "financial-institutions" },
    { industry: "fintech" },
    { industry: "insurance" },
    { industry: "insurtech" },
    { industry: "crypto" },
    { industry: "saas" },
    { industry: "retail" },
    { industry: "manufacturing" },
    { industry: "gaming" },
    { industry: "professional-services" },
    { industry: "real-estate" },
    { industry: "ngo" },
    { industry: "banks" },
    { industry: "broker-dealers" },
    { industry: "asset-managers" },
    { industry: "exchanges" },
    { industry: "market-makers" },
    { industry: "family-offices" },
    { industry: "hedge-funds" },
    { industry: "sovereign-wealth" },
    { industry: "corporate-treasury" },
    { industry: "wealth-management" },
  ];
}

export default function Page() {
  return <IndustryPage />;
}
