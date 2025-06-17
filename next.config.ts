import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["tesseract.js"],
  outputFileTracingIncludes: {
    "/api/**": ["./node_modules/tesseract.js-core/**/*.wasm", "./node_modules/tesseract.js-core/**/*.proto"]
  }
};

export default nextConfig;
