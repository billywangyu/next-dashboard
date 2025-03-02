import type { NextConfig } from 'next';

module.exports = {
  pageExtensions: ['tsx', 'ts', 'js', 'jsx'],
}

const nextConfig: NextConfig = {
  experimental: {
    ppr: 'incremental'
  }
};
 
export default nextConfig;