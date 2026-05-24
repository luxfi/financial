"use client";
import React from "react";
import { ThemeProvider } from "styled-components";
import GlobalStyles from "@/styles/globals";
import StyledComponentsRegistry from "@/styles/registry";
import { theme } from "@/styles/theme";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <StyledComponentsRegistry>
      <ThemeProvider theme={theme}>
        <GlobalStyles />
        {children}
      </ThemeProvider>
    </StyledComponentsRegistry>
  );
}
