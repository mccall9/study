import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Os resumos (data/resumos/*.md) são lidos do disco no servidor; isso garante que entrem no deploy.
  outputFileTracingIncludes: {
    "/topico/[id]": ["./data/resumos/**/*"],
    "/materiais": ["./data/resumos/**/*"],
  },
};

export default nextConfig;
