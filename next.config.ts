import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    // AVIF first for browsers that take it (~20% smaller than WebP), WebP otherwise.
    // Fewer bytes matters more than encode time here: every source is already a small
    // pre-compressed WebP, and optimised variants are cached after the first request.
    formats: ["image/avif", "image/webp"],

    // Next 16 requires an explicit allowlist. 70 is what the sponsor wall and timeline
    // stills use; 75 is the default for everything else.
    qualities: [70, 75],

    // Nothing here is bigger than the hero plate, so drop the 2048/3840 variants that
    // would otherwise be generated and cached for no one.
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [64, 128, 256, 384],

    // Assets are content-stable; don't pay to re-optimise them.
    minimumCacheTTL: 2678400, // 31 days
  },

  // Keeps barrel imports from pulling the whole library into the client bundle.
  experimental: {
    optimizePackageImports: ["framer-motion", "lucide-react"],
  },
};

export default nextConfig;
