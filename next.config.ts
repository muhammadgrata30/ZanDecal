import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  // These files are served as static assets, not read by the server function.
  outputFileTracingExcludes: {
    "/*": ["./public/models/**/*", "./public/videos/**/*", "./public/design-preview/**/*", "./prototypes/**/*", "./artifacts/**/*"],
  },
  async headers() {
    return ["2024_ducati_streetfighter_v4_s", "byd-seal"].map(name => ({ source: `/models/transport/${name}.glb.gz`, headers: [
      { key: "Content-Encoding", value: "gzip" },
      { key: "Content-Type", value: "model/gltf-binary" },
      { key: "Vary", value: "Accept-Encoding" },
    ] }));
  },
};

export default nextConfig;
