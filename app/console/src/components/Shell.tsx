"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import styled from "styled-components";
import { LUX_BRAND } from "@luxbank/brand";

const NAV: { href: string; label: string }[] = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/accounts", label: "Accounts" },
  { href: "/send", label: "Send Money" },
  { href: "/cards", label: "Cards" },
  { href: "/crypto", label: "Crypto" },
  { href: "/fx", label: "FX" },
  { href: "/compliance", label: "Compliance" },
  { href: "/settings", label: "Settings" },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const path = usePathname();
  return (
    <Layout>
      <TopBar>
        <Brand>
          <BrandMark>{LUX_BRAND.name}</BrandMark>
          <BrandTag>Console</BrandTag>
        </Brand>
        <TopNav>
          <Link href="/dashboard">Overview</Link>
          <Link href="/help">Help</Link>
        </TopNav>
        <AccountMenu>
          <AcctButton aria-label="Account menu">A</AcctButton>
        </AccountMenu>
      </TopBar>
      <Body>
        <Sidebar>
          {NAV.map((item) => (
            <NavLink key={item.href} href={item.href} $active={path?.startsWith(item.href) ?? false}>
              {item.label}
            </NavLink>
          ))}
        </Sidebar>
        <Main>{children}</Main>
      </Body>
      <StatusBar>
        <span>{LUX_BRAND.jurisdiction.legalEntity.name}</span>
        <span>•</span>
        <span>Encrypted session</span>
      </StatusBar>
    </Layout>
  );
}

const Layout = styled.div`
  min-height: 100vh;
  display: grid;
  grid-template-rows: 56px 1fr 28px;
  background: ${({ theme }) => theme.colors.background};
`;

const TopBar = styled.header`
  display: grid;
  grid-template-columns: 240px 1fr auto;
  align-items: center;
  padding: 0 16px;
  border-bottom: 1px solid ${({ theme }) => theme.colors.border};
`;

const Brand = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`;
const BrandMark = styled.div`
  font-size: 1.6rem;
  font-weight: 700;
  letter-spacing: -0.01em;
`;
const BrandTag = styled.div`
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.muted};
  text-transform: uppercase;
  letter-spacing: 0.08em;
`;

const TopNav = styled.nav`
  display: flex;
  gap: 16px;
  font-size: 1.3rem;
  color: ${({ theme }) => theme.colors.secondary};
  a:hover { color: ${({ theme }) => theme.colors.primary}; }
`;

const AccountMenu = styled.div``;
const AcctButton = styled.button`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.2rem;
`;

const Body = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  min-height: 0;
`;

const Sidebar = styled.aside`
  border-right: 1px solid ${({ theme }) => theme.colors.border};
  padding: 12px 8px;
  display: flex;
  flex-direction: column;
  gap: 2px;
`;

const NavLink = styled(Link)<{ $active: boolean }>`
  display: block;
  padding: 8px 12px;
  border-radius: 8px;
  font-size: 1.3rem;
  color: ${({ theme, $active }) => ($active ? theme.colors.primary : theme.colors.secondary)};
  background: ${({ theme, $active }) => ($active ? theme.colors.surface : "transparent")};
  &:hover {
    color: ${({ theme }) => theme.colors.primary};
    background: ${({ theme }) => theme.colors.surface};
  }
`;

const Main = styled.main`
  padding: 24px 32px;
  overflow: auto;
`;

const StatusBar = styled.footer`
  display: flex;
  gap: 8px;
  align-items: center;
  padding: 0 16px;
  border-top: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.colors.muted};
`;
