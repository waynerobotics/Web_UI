// next.config.mjs
import path from "path";
import { fileURLToPath } from "url";

// emulate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname  = path.dirname(__filename);

/** @type {import('next').NextConfig} */
const nextConfig = {
  experimental: {
    turbo: {
      resolve: {
        alias: {
          // Turbopack: resolve three/examples/jsm → actual folder
          "three/examples/jsm": path.resolve(
            __dirname,
            "node_modules/three/examples/jsm"
          ),
        },
      },
    },
  },
  webpack(config) {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Webpack: same alias for three/examples/jsm
      "three/examples/jsm": path.resolve(
        __dirname,
        "node_modules/three/examples/jsm"
      ),
    };
    return config;
  },
};

export default nextConfig;
