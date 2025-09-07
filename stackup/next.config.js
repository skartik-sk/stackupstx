/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    esmExternals: 'loose'
  },
  webpack: (config, { isServer }) => {
    // Ensure proper module resolution
    config.resolve.alias = {
      ...config.resolve.alias,
      '@': require('path').resolve(__dirname, 'src')
    };
    
    // Handle ESM modules properly
    config.resolve.extensionAlias = {
      '.js': ['.ts', '.tsx', '.js', '.jsx'],
      '.jsx': ['.tsx', '.jsx'],
    };
    
    return config;
  },
  // Optimize for Vercel deployment
  outputFileTracing: true,
  transpilePackages: [],
  env: {
    CUSTOM_KEY: 'my-value',
    NEXT_PUBLIC_API_BASE_URL: process.env.NEXT_PUBLIC_API_BASE_URL,
    NEXT_PUBLIC_API_BASE_URL_FALLBACK: process.env.NEXT_PUBLIC_API_BASE_URL_FALLBACK,
  },
};

module.exports = nextConfig;
