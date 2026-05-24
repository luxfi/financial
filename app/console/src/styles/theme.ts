// Console theme mirrors site theme tokens — pure black surfaces, white accent.
import { LUX_COLORS } from "@luxbank/brand";

export const theme = {
  colors: {
    background: "#000000",
    surface: "#0A0A0A",
    surfaceHover: "#111111",
    foreground: "rgba(255,255,255,0.92)",
    primary: "rgba(255,255,255,0.92)",
    secondary: "rgba(255,255,255,0.65)",
    muted: "rgba(255,255,255,0.45)",
    border: "rgba(255,255,255,0.08)",
    borderHover: "rgba(255,255,255,0.15)",
    accent: "#FFFFFF",
    accentForeground: "#000000",
    danger: "#EF4444",
    success: "#22C55E",
    brand: LUX_COLORS?.primary ?? "#FFFFFF",
  },
} as const;

export type Theme = typeof theme;

export const device = {
  sm: "(max-width: 768px)",
  md: "(max-width: 1024px)",
  lg: "(max-width: 1200px)",
};
