import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: { ignoreBuildErrors: false },
  async headers() {
    return ["2024_ducati_streetfighter_v4_s", "byd-seal"].map(name => ({ source: `/models/transport/${name}.glb.gz`, headers: [
      { key: "Content-Encoding", value: "gzip" },
      { key: "Content-Type", value: "model/gltf-binary" },
      { key: "Vary", value: "Accept-Encoding" },
    ] }));
  },
};

export default nextConfig;
