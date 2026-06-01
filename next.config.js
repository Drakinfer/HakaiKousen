/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  serverExternalPackages: ['@sparticuz/chromium'],
  experimental: {
    appDir: true,
    outputFileTracingIncludes: {
      'src/app/api/pokemon-sheet/route.js': [
        './node_modules/@sparticuz/chromium/**',
      ],
    },
  },
};

export default nextConfig;
