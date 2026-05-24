"use client";
import { useEffect, useState } from "react";
import styled from "styled-components";
import { LUX_BRAND } from "@luxbank/brand";
import { Button, Card, Notice } from "@/components/Page";
import { buildAuthorizeUrl } from "@/lib/auth";

export default function SignIn() {
  const [href, setHref] = useState<string>("#");
  useEffect(() => {
    const ret = `${window.location.origin}/dashboard`;
    setHref(buildAuthorizeUrl(ret));
  }, []);
  return (
    <Wrap>
      <SignInCard>
        <Title>Sign in to {LUX_BRAND.name}</Title>
        <Sub>You will be redirected to identity provider to authenticate.</Sub>
        <Button as="a" href={href}>Continue</Button>
        <Notice>Single sign-on via {LUX_BRAND.name} IAM.</Notice>
      </SignInCard>
    </Wrap>
  );
}

const Wrap = styled.div`
  display: grid;
  place-items: center;
  min-height: 60vh;
`;
const SignInCard = styled(Card)`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: min(420px, 100%);
`;
const Title = styled.h1`
  font-size: 2.2rem;
  font-weight: 700;
`;
const Sub = styled.p`
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.3rem;
`;
