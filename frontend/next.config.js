/** @type {import('next').NextConfig} */
const nextConfig = {
  output: process.env.NODE_ENV === 'production' ? 'export' : undefined,
  basePath: process.env.NODE_ENV === 'production' ? '/salesmock' : '',
  images: {
    unoptimized: true,
  },
  compiler: {
    styledComponents: true,
  },
  // 動的ルートを静的エクスポートから除外
  trailingSlash: true,
};

module.exports = nextConfig; 