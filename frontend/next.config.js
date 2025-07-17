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
};

module.exports = nextConfig; 