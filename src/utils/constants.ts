// API Configuration
export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api";

// Application Configuration
export const APP_CONFIG = {
  name: "Snapshoter",
  description: "A modern Next.js 15 application built with best practices",
  version: "1.0.0",
  author: "Snapshoter Team",
} as const;

// Navigation Configuration
export const NAVIGATION = {
  main: [
    { title: "Home", href: "/" },
    { title: "About", href: "/about" },
    { title: "Features", href: "/features" },
    { title: "Contact", href: "/contact" },
  ],
  footer: [
    { title: "Privacy", href: "/privacy" },
    { title: "Terms", href: "/terms" },
    { title: "GitHub", href: "https://github.com", external: true },
  ],
} as const;

// Feature Configuration
export const FEATURES = [
  {
    title: "Fast Performance",
    description:
      "Built with Next.js 15 for optimal performance and developer experience.",
    icon: "⚡",
  },
  {
    title: "Type Safe",
    description:
      "Full TypeScript support for better development experience and fewer bugs.",
    icon: "🛡️",
  },
  {
    title: "Modern UI",
    description:
      "Beautiful, accessible components built with Radix UI and Tailwind CSS.",
    icon: "🎨",
  },
] as const;

// Canvas properties
export const CANVAS_WIDTH = 480;
export const CANVAS_HEIGHT = 480;
export const PADDING = 32;
export const BORDER_WIDTH = 16;
