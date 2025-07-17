import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',  // 静的ファイル生成用
  basePath: '/salesmock', // リポジトリ名に合わせたベースパス
  images: {
    unoptimized: true, // GitHub Pages用の画像設定
  },
  compiler: {
    styledComponents: true,
  },
};

export default nextConfig;
