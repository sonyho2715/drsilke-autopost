import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
};

// Only apply Sentry config if DSN is configured
const isSentryConfigured = !!process.env.NEXT_PUBLIC_SENTRY_DSN &&
                           process.env.NEXT_PUBLIC_SENTRY_DSN !== 'https://your-sentry-dsn@sentry.io/your-project-id';

let exportedConfig = nextConfig;

if (isSentryConfigured) {
  const { withSentryConfig } = require("@sentry/nextjs");

  exportedConfig = withSentryConfig(nextConfig, {
    org: process.env.SENTRY_ORG || "your-org-slug",
    project: process.env.SENTRY_PROJECT || "drsilke-autopost",
    silent: !process.env.CI,
    widenClientFileUpload: true,
    reactComponentAnnotation: { enabled: true },
    tunnelRoute: "/monitoring",
    hideSourceMaps: true,
    disableLogger: true,
    automaticVercelMonitors: true,
  });
}

export default exportedConfig;
