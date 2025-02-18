import type { NextConfig } from 'next';
import type { Configuration as WebpackConfig } from 'webpack';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    serverActions: {
      bodySizeLimit: 10 * 1024 * 1024, // 10MB
      allowedOrigins: ['*']
    }
  },
  webpack: (config: WebpackConfig) => {
    return {
      ...config,
      experiments: {
        ...config.experiments,
        topLevelAwait: true,
      },
      resolve: {
        ...config.resolve,
        fallback: {
          fs: false,
          path: false,
          os: false,
        },
      },
    };
  },
  compiler: {
    styledComponents: true,
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  poweredByHeader: false,
  swcMinify: true,
}

export default nextConfig;
