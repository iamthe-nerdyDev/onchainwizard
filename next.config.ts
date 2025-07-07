import type { NextConfig } from "next";
import lingoCompiler from "lingo.dev/compiler";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: { ignoreDuringBuilds: true },
  typescript: { ignoreBuildErrors: true },
};

export default lingoCompiler.next({
  sourceLocale: "en",
  targetLocales: ["es", "fr", "de"],
  models: "lingo.dev",
  lingoDir: "../lingo",
})(nextConfig);
