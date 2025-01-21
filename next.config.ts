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
        topLevelAwait: true
      }
    };
  },
  compiler: {
    styledComponents: true,
  },
  env: {
    MONGODB_URI: process.env.MONGODB_URI,
  },
  // Add this to handle hydration issues
  onDemandEntries: {
    maxInactiveAge: 25 * 1000,
    pagesBufferLength: 5,
  },
  poweredByHeader: false,
  // Add this to optimize builds
  swcMinify: true,
}

export default nextConfig;