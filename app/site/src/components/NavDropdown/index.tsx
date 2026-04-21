"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  DropdownContainer,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  SectionTitle,
  DropdownItem,
  ItemIcon,
  ItemContent,
  ItemTitle,
  ItemDescription,
  ChevronIcon,
  FeaturedCard,
  FeaturedTitle,
  FeaturedDescription,
  FeaturedLink,
} from "./styles";

// Icons
const AccountIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20" />
  </svg>
);

const FxIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);

const GlobeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <circle cx="12" cy="12" r="10" />
    <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const ShieldIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);

const ApiIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m18 16 4-4-4-4M6 8l-4 4 4 4M14.5 4l-5 16" />
  </svg>
);

const PaymentIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect width="20" height="14" x="2" y="5" rx="2" />
    <path d="M2 10h20M6 15h4" />
  </svg>
);

const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M3 21h18M3 10h18M5 6l7-3 7 3M4 10v11M20 10v11M8 14v3M12 14v3M16 14v3" />
  </svg>
);

const TrendingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="m22 7-8.5 8.5-5-5L2 17M16 7h6v6" />
  </svg>
);

const BuildingIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <rect width="16" height="20" x="4" y="2" rx="2" ry="2" />
    <path d="M9 22v-4h6v4M8 6h.01M16 6h.01M12 6h.01M12 10h.01M12 14h.01M16 10h.01M16 14h.01M8 10h.01M8 14h.01" />
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ChevronDownIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="m6 9 6 6 6-6" />
  </svg>
);

// Platform dropdown content
const platformItems = [
  {
    icon: ShieldIcon,
    title: "Non-Custodial",
    description: "Your keys, our infrastructure — the core differentiator",
    href: "/non-custodial",
  },
  {
    icon: ApiIcon,
    title: "Technology",
    description: "MPC, KMS, HSM, FHE, post-quantum, ZAP, GPU, MCP",
    href: "/technology",
  },
  {
    icon: BankIcon,
    title: "Products",
    description: "CEX, DEX, AMM, custody, cards, banking accounts",
    href: "/products",
  },
  {
    icon: GlobeIcon,
    title: "Compliance",
    description: "Reg ATS, KYC/AML, Travel Rule, multi-jurisdiction",
    href: "/compliance",
  },
  {
    icon: ShieldIcon,
    title: "Security",
    description: "SOC 2 Type II, HSM, formal proofs, audits",
    href: "/security",
  },
  {
    icon: AccountIcon,
    title: "White-Label Accounts",
    description: "Branded account infrastructure for your platform",
    href: "/account",
  },
];

// Solutions dropdown content - aligned to real industry slugs
const solutionItems = {
  topCustomers: [
    { title: "Banks", description: "Digital asset banking, custody, multi-rail payments", href: "/solutions/banks" },
    { title: "Broker-Dealers", description: "ATS access, FIX 4.4, ZAP binary co-location", href: "/solutions/broker-dealers" },
    { title: "Exchanges", description: "White-label CEX, DEX, AMM infrastructure", href: "/solutions/exchanges" },
    { title: "Market Makers", description: "Sub-100μs ZAP + GPU matching at Equinix NY5", href: "/solutions/market-makers" },
    { title: "Asset Managers", description: "Multi-asset portfolios, execution algos, MCP", href: "/solutions/asset-managers" },
    { title: "Hedge Funds", description: "16-venue SOR, TCA, FHE confidential positions", href: "/solutions/hedge-funds" },
  ],
  infrastructure: [
    { title: "Family Offices", description: "Private securities, pre-IPO, tokenized assets", href: "/solutions/family-offices" },
    { title: "Wealth Management", description: "RIA + private bank infrastructure", href: "/solutions/wealth-management" },
    { title: "Corporate Treasury", description: "Multi-currency, stablecoin, tokenized T-Bills", href: "/solutions/corporate-treasury" },
    { title: "Sovereign Wealth", description: "Post-quantum custody, FHE, Ringtail consensus", href: "/solutions/sovereign-wealth" },
    { title: "Insurance", description: "Instant claims, 200+ country premium collection", href: "/solutions/insurance" },
    { title: "FinTech", description: "White-label neobanks, card issuing, yield", href: "/solutions/fintech" },
  ],
  emerging: [
    { title: "InsurTech", description: "Parametric insurance with smart contracts", href: "/solutions/insurtech" },
    { title: "Crypto Funds", description: "Multi-chain treasury, DeFi, validator ops", href: "/solutions/crypto" },
    { title: "Real Estate", description: "Tokenized properties, fractional ownership", href: "/solutions/real-estate" },
    { title: "Gaming", description: "Player wallets, NFT marketplace, token economies", href: "/solutions/gaming" },
    { title: "SaaS Platforms", description: "Embedded banking, subscriptions, marketplace", href: "/solutions/saas" },
    { title: "NGOs & DAOs", description: "Multi-sig treasury, quadratic funding, grants", href: "/solutions/ngo" },
  ],
};

interface NavDropdownProps {
  label: string;
  type: "platform" | "solutions";
  active?: boolean;
}

export default function NavDropdown({ label, type, active }: NavDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = setTimeout(() => {
      setIsOpen(false);
    }, 150);
  };

  const handleClick = () => {
    setIsOpen(!isOpen);
  };

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [isOpen]);

  return (
    <DropdownContainer
      ref={dropdownRef}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <DropdownTrigger $active={active || false} $open={isOpen} onClick={handleClick}>
        {label}
        <ChevronIcon $open={isOpen}>
          <ChevronDownIcon />
        </ChevronIcon>
      </DropdownTrigger>

      {isOpen && (
        <DropdownMenu $type={type}>
          {type === "platform" && (
            <>
              <FeaturedCard>
                <FeaturedTitle>Lux Financial Platform</FeaturedTitle>
                <FeaturedDescription>
                  Open-source crypto infrastructure for regulated financial institutions. Institutional-grade.
                </FeaturedDescription>
                <FeaturedLink href="/account">
                  Explore Platform →
                </FeaturedLink>
              </FeaturedCard>
              <DropdownSection>
                <SectionTitle>Products</SectionTitle>
                {platformItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link key={item.title} href={item.href}>
                      <DropdownItem>
                        <ItemIcon>
                          <Icon />
                        </ItemIcon>
                        <ItemContent>
                          <ItemTitle>{item.title}</ItemTitle>
                          <ItemDescription>{item.description}</ItemDescription>
                        </ItemContent>
                      </DropdownItem>
                    </Link>
                  );
                })}
              </DropdownSection>
            </>
          )}

          {type === "solutions" && (
            <>
              <DropdownSection>
                <SectionTitle>Top Customers</SectionTitle>
                {solutionItems.topCustomers.map((item) => (
                  <Link key={item.title} href={item.href}>
                    <DropdownItem>
                      <ItemIcon>
                        <BuildingIcon />
                      </ItemIcon>
                      <ItemContent>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemDescription>{item.description}</ItemDescription>
                      </ItemContent>
                    </DropdownItem>
                  </Link>
                ))}
              </DropdownSection>
              <DropdownSection>
                <SectionTitle>Infrastructure</SectionTitle>
                {solutionItems.infrastructure.map((item) => (
                  <Link key={item.title} href={item.href}>
                    <DropdownItem>
                      <ItemIcon>
                        <ApiIcon />
                      </ItemIcon>
                      <ItemContent>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemDescription>{item.description}</ItemDescription>
                      </ItemContent>
                    </DropdownItem>
                  </Link>
                ))}
              </DropdownSection>
              <DropdownSection>
                <SectionTitle>Emerging</SectionTitle>
                {solutionItems.emerging.map((item) => (
                  <Link key={item.title} href={item.href}>
                    <DropdownItem>
                      <ItemIcon>
                        <TrendingIcon />
                      </ItemIcon>
                      <ItemContent>
                        <ItemTitle>{item.title}</ItemTitle>
                        <ItemDescription>{item.description}</ItemDescription>
                      </ItemContent>
                    </DropdownItem>
                  </Link>
                ))}
              </DropdownSection>
            </>
          )}
        </DropdownMenu>
      )}
    </DropdownContainer>
  );
}
