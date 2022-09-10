import * as Sentry from '@sentry/nextjs';

const SENTRY_DSN = process.env.SENTRY_DSN || process.env.NEXT_PUBLIC_SENTRY_DSN;

Sentry.init({
  dsn: SENTRY_DSN || 'https://1db1cfcb76564165bd93399bc0f55f10@o311419.ingest.sentry.io/5509656',
  environment: process.env.NEXT_PUBLIC_GAMERARENA_STAGE,
});
