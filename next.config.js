/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,

  serverExternalPackages: ['@sparticuz/chromium', 'puppeteer-core'],

  outputFileTracingIncludes: {
    '/api/pokemon-sheet': [
      './node_modules/@sparticuz/chromium/bin/**',
      './node_modules/@sparticuz/chromium/build/**',
    ],
  },
};

export default nextConfig;
