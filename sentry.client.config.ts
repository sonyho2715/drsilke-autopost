import * as Sentry from "@sentry/nextjs";

const SENTRY_DSN = process.env.NEXT_PUBLIC_SENTRY_DSN;

// Only initialize Sentry if DSN is configured
if (SENTRY_DSN && SENTRY_DSN !== 'https://your-sentry-dsn@sentry.io/your-project-id') {
  Sentry.init({
    dsn: SENTRY_DSN,
    tracesSampleRate: 1.0,
    debug: false,
    replaysOnErrorSampleRate: 1.0,
    replaysSessionSampleRate: 0.1,
    integrations: [
      Sentry.replayIntegration({
        maskAllText: true,
        blockAllMedia: true,
      }),
    ],
  });
}
