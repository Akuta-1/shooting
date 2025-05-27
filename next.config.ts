import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: ['pixi.js'], // pixi.jsをトランスパイル対象に含める
  webpack: (config, { isServer }) => {
    // Pixi.jsがクライアントサイドでのみ動作するように設定
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        "pixi.js": false, // または 'require.resolve("pixi.js")'
      };
    }
    return config;
  },
};

export default nextConfig;
