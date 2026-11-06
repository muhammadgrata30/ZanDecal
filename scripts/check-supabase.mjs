// Read-only readiness check. Never prints keys, account data or remote error bodies.
import { existsSync } from "node:fs";

for (const file of [".env.local", ".env"]) {
  if (existsSync(file)) process.loadEnvFile(file);
}

const raw = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!raw || !key) {
  console.error("BELUM SIAP: isi SUPABASE_URL dan SUPABASE_SECRET_KEY pada environment server atau .env.local.");
  process.exit(1);
}

let origin;
try {
  const url = new URL(raw);
  if (url.protocol !== "https:" || url.username || url.password || url.pathname !== "/" || url.search || url.hash) throw new Error();
  origin = url.origin;
} catch {
  console.error("BELUM SIAP: SUPABASE_URL harus berupa origin HTTPS proyek Supabase.");
  process.exit(1);
}

const headers = { apikey: key, ...(key.startsWith("eyJ") ? { Authorization: `Bearer ${key}` } : {}) };
const checks = [
  ["Status konten", "/rest/v1/zan_site_state?select=singleton&limit=0"],
  ["Tabel bahan", "/rest/v1/zan_materials?select=id&limit=0"],
  ["Tabel portofolio", "/rest/v1/zan_portfolio?select=id&limit=0"],
  ["Tabel warna", "/rest/v1/zan_colors?select=id&limit=0"],
  ["Tabel admin", "/rest/v1/zan_admin?select=singleton&limit=0"],
  ["Bucket media publik", "/storage/v1/bucket/zan-media"],
];
let failed = false;
for (const [label, path] of checks) {
  try {
    const response = await fetch(origin + path, { headers, signal: AbortSignal.timeout(15000), cache: "no-store" });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    if (path.startsWith("/storage/")) {
      const bucket = await response.json();
      if (bucket.id !== "zan-media" || bucket.public !== true) throw new Error("bucket belum publik");
    }
    console.log(`OK: ${label}`);
  } catch (error) {
    failed = true;
    const reason = /^HTTP \d{3}$/.test(error.message) || error.message === "bucket belum publik" ? error.message : "koneksi gagal atau timeout";
    console.error(`GAGAL: ${label} (${reason}). Periksa key, migration, dan koneksi server.`);
  }
}
console.log("Pemeriksaan ini hanya membaca. Publikasi, signed upload/CORS, cookie, dan persistensi setelah redeploy tetap perlu diuji melalui admin Netlify.");
process.exitCode = failed ? 1 : 0;
