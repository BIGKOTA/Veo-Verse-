/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  // Exclude tempobook directory from Next.js processing
  pageExtensions: ["tsx", "ts", "jsx", "js"].map(
    (ext) => `!(**/tempobook/**).${ext}`,
  ),

  webpack: (config, { dev, isServer }) => {
    // More comprehensive ignore for tempobook directories
    const { IgnorePlugin } = require("webpack");

    config.plugins.push(
      new IgnorePlugin({
        resourceRegExp: /tempobook/,
      }),
    );

    // Add module resolution ignore
    config.resolve = config.resolve || {};
    config.resolve.alias = config.resolve.alias || {};

    // Exclude tempobook from file system watching
    if (config.watchOptions) {
      const existingIgnored = Array.isArray(config.watchOptions.ignored)
        ? config.watchOptions.ignored
        : config.watchOptions.ignored
          ? [config.watchOptions.ignored]
          : [];
      config.watchOptions.ignored = [
        ...existingIgnored,
        "**/tempobook/**",
        "**/node_modules/**",
      ];
    } else {
      config.watchOptions = {
        ignored: ["**/tempobook/**", "**/node_modules/**"],
      };
    }

    return config;
  },
};

// Only add tempo-specific config in development with better error handling
if (process.env.NODE_ENV === "development" && process.env.NEXT_PUBLIC_TEMPO) {
  try {
    const tempoDevtools = require.resolve("tempo-devtools/swc/0.90");
    nextConfig.experimental = {
      ...nextConfig.experimental,
      swcPlugins: [[tempoDevtools, {}]],
    };
  } catch (error) {
    // Silently ignore tempo-devtools errors to prevent build failures
    console.warn("Tempo devtools not available, continuing without it");
  }
}

module.exports = nextConfig;
