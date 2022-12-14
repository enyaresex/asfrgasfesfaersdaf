const path = require('path');
const { withSentryConfig } = require('@sentry/nextjs');

require('dotenv').config({
  path: path.resolve(process.cwd(), `.env.${process.env.GAMERARENA_STAGE}`),
});

module.exports = withSentryConfig({
  webpack: (config) => {
    // disable the default svg loader of next.js and add svgr
    const fileLoaderRule = config.module.rules.find((rule) => rule.test && rule.test.test('.svg'));

    fileLoaderRule.exclude = /\.svg$/;

    config.module.rules.push({
      issuer: /\.tsx$/,
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            dimensions: false,
          },
        },
        'url-loader',
      ],
    });

    return config;
  },
}, { silent: process.env.GAMERARENA_STAGE === 'development' });
