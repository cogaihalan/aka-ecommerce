import type { NextConfig } from "next";

// Bundle analyzer configuration
const withBundleAnalyzer = require("@next/bundle-analyzer")({
  enabled: process.env.ANALYZE === "true",
});

// Define the base Next.js configuration
const baseConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "akapro.vn",
        port: "",
      },
      {
        protocol: "http",
        hostname: "103.82.25.111",
        port: "8080",
      },
      {
        protocol: "https",
        hostname: "picsum.photos",
        port: "",
      }
    ],
    // Optimize images for better performance
    formats: ["image/avif", "image/webp"],
    minimumCacheTTL: 60,
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },
  transpilePackages: ["inter"],
  
  // Compiler optimizations
  compiler: {
    removeConsole: process.env.NODE_ENV === "production" ? {
      exclude: ["error", "warn"],
    } : false,
  },
  
  // Compression
  compress: true,

  // Performance optimizations for development
  experimental: {
    webVitalsAttribution: ['CLS', 'LCP', 'FCP', 'TTFB', 'INP'], // Enable Core Web Vitals attribution
    optimizePackageImports: [
      "lucide-react",
      "@radix-ui/react-icons",
      "@radix-ui/react-accordion",
      "@radix-ui/react-alert-dialog",
      "@radix-ui/react-avatar",
      "@radix-ui/react-checkbox",
      "@radix-ui/react-dialog",
      "@radix-ui/react-dropdown-menu",
      "@radix-ui/react-label",
      "@radix-ui/react-popover",
      "@radix-ui/react-select",
      "@radix-ui/react-separator",
      "@radix-ui/react-slot",
      "@radix-ui/react-switch",
      "@radix-ui/react-tabs",
      "@radix-ui/react-toast",
      "@radix-ui/react-tooltip",
      "recharts",
      "date-fns",
    ],
  },

  // Disable source maps in development for faster builds
  productionBrowserSourceMaps: false,

  // Development optimizations
  ...(process.env.NODE_ENV === "development" && {
    // Enable fast refresh for React components
    reactStrictMode: true,

    // Skip type checking during development for faster builds
    typescript: {
      ignoreBuildErrors: false,
    },
    // Skip ESLint during development for faster builds
    eslint: {
      ignoreDuringBuilds: false,
    },
  }),
};

let configWithPlugins = baseConfig;

const nextConfig = configWithPlugins;
export default withBundleAnalyzer(nextConfig);
