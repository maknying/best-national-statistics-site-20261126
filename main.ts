// Statistik Indonesia — program penyerahan entry make.fun.
// Menyalin app/ dan screenshots/ dari repo ini ke direktori output, lalu
// menulis /output/dossier.json dari buildDossier (vendor/makefun-frontend.ts).
// Node 22, stdlib saja. Di luar grader, MAKEFUN_OUTPUT_DIR menggantikan /output.
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const CAPS = {
  text_max_bytes: 163840,
  screenshots: { max: 4, max_bytes: 262144 },
  app_max_files: 993,
  app_max_bytes: 16777216,
  app_path_max_bytes: 1000,
};

function main(): void {
  const appDir = join(here, "app");
  const shotsDir = join(here, "screenshots");
  if (!existsSync(appDir)) throw new Error("app/ tidak ditemukan di " + here);
  if (!existsSync(shotsDir)) throw new Error("screenshots/ tidak ditemukan di " + here);
  if (outDir === here) throw new Error("direktori output tidak boleh sama dengan repo");

  mkdirSync(outDir, { recursive: true });
  // Bersihkan isi output lama agar tidak ada berkas usang yang ikut terhitung.
  for (const name of ["app", "screenshots", "dossier.json"]) {
    const target = join(outDir, name);
    if (existsSync(target)) rmSync(target, { recursive: true, force: true });
  }

  cpSync(appDir, join(outDir, "app"), { recursive: true });
  cpSync(shotsDir, join(outDir, "screenshots"), { recursive: true });

  const dossier = buildDossier(outDir, CAPS);
  writeFileSync(join(outDir, "dossier.json"), dossier);
  console.log("dossier.json ditulis: " + dossier.length + " byte ke " + outDir);
  console.log("app/ + screenshots/ disalin ke " + outDir);
}

main();
