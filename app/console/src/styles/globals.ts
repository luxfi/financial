import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
  html {
    font-family: var(--font-geist-sans), -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif;
    font-size: 62.5%;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.primary};
  }
  body { font-size: 1.4rem; line-height: 1.5; min-height: 100vh; }
  a { color: inherit; text-decoration: none; }
  button { font-family: inherit; cursor: pointer; }
  input, select, textarea { font-family: inherit; }
`;

export default GlobalStyles;
