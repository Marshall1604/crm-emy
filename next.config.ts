import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Generate a unique build ID on each deploy so browsers always
  // fetch fresh JS chunks instead of serving stale cached versions.
  // This prevents the "This page couldn't load" error after Vercel re-deploys.
  generateBuildId: async () => {
    return `build-${Date.now()}`;
  },
};

export default nextConfig;
