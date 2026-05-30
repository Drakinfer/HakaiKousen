/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    appDir: true,
    outputFileTracingIncludes: {
      'src/app/api/pokemon-sheet/route.js': [
        './node_modules/@sparticuz/chromium-min/**',
      ],
    },
  },
};

export default nextConfig;
