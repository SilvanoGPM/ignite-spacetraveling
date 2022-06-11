// eslint-disable-next-line @typescript-eslint/no-var-requires
const withPWA = require('next-pwa');

const isProduction = process.env.NODE_ENV === 'production';

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
};

module.exports = withPWA({
  ...nextConfig,
  swcMinify: true,
  pwa: {
    dest: 'public',
    disable: !isProduction,
  },
});
