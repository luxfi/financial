"use client";
import React from "react";
import styled from "styled-components";

export function PageHeader({ title, subtitle, actions }: { title: string; subtitle?: string; actions?: React.ReactNode }) {
  return (
    <Header>
      <div>
        <Title>{title}</Title>
        {subtitle ? <Subtitle>{subtitle}</Subtitle> : null}
      </div>
      {actions ? <Actions>{actions}</Actions> : null}
    </Header>
  );
}

export const Card = styled.div`
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme }) => theme.colors.border};
  border-radius: 12px;
  padding: 20px;
`;

export const Grid = styled.div<{ $cols?: number }>`
  display: grid;
  grid-template-columns: repeat(${({ $cols }) => $cols ?? 3}, 1fr);
  gap: 16px;
`;

export const Button = styled.button<{ $variant?: "primary" | "ghost" | "danger" }>`
  height: 40px;
  border-radius: 10px;
  padding: 0 16px;
  font-size: 1.3rem;
  font-weight: 600;
  border: 1px solid transparent;
  transition: all 0.15s ease;
  ${({ theme, $variant }) => {
    if ($variant === "danger") {
      return `background: ${theme.colors.danger}; color: #fff;`;
    }
    if ($variant === "ghost") {
      return `background: transparent; color: ${theme.colors.primary}; border-color: ${theme.colors.border};`;
    }
    return `background: ${theme.colors.accent}; color: ${theme.colors.accentForeground};`;
  }}
  &:hover { opacity: 0.9; }
  &:disabled { opacity: 0.4; cursor: not-allowed; }
`;

export const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-bottom: 16px;
`;

export const Label = styled.label`
  font-size: 1.2rem;
  color: ${({ theme }) => theme.colors.secondary};
`;

export const Input = styled.input`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1.3rem;
  &:focus { outline: none; border-color: ${({ theme }) => theme.colors.accent}; }
`;

export const Select = styled.select`
  height: 40px;
  padding: 0 12px;
  border-radius: 10px;
  background: ${({ theme }) => theme.colors.background};
  color: ${({ theme }) => theme.colors.primary};
  border: 1px solid ${({ theme }) => theme.colors.border};
  font-size: 1.3rem;
`;

export const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-size: 1.3rem;
  th, td {
    padding: 12px;
    text-align: left;
    border-bottom: 1px solid ${({ theme }) => theme.colors.border};
  }
  th { color: ${({ theme }) => theme.colors.muted}; font-weight: 500; font-size: 1.2rem; text-transform: uppercase; letter-spacing: 0.06em; }
`;

export const Notice = styled.div<{ $tone?: "info" | "warn" | "error" }>`
  padding: 12px 14px;
  border-radius: 10px;
  font-size: 1.3rem;
  background: ${({ theme }) => theme.colors.surface};
  border: 1px solid ${({ theme, $tone }) => ($tone === "error" ? theme.colors.danger : theme.colors.border)};
  color: ${({ theme }) => theme.colors.secondary};
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 24px;
`;
const Title = styled.h1`
  font-size: 2.4rem;
  font-weight: 700;
  letter-spacing: -0.02em;
`;
const Subtitle = styled.p`
  margin-top: 4px;
  color: ${({ theme }) => theme.colors.secondary};
  font-size: 1.3rem;
`;
const Actions = styled.div`
  display: flex;
  gap: 8px;
`;
