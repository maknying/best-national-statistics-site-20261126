// Statistik Indonesia — server statis kecil untuk pengembangan lokal.
// Menyajikan app/ di http://localhost:8080 (atau --port lain). Node 22, stdlib saja.
import { createReadStream, existsSync, statSync } from "node:fs";
import { createServer } from "node:http";
import { extname, join, normalize, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

const here = resolve(join(dirname(fileURLToPath(import.meta.url)), "app"));
const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".mjs": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
};

function dirname(p: string): string {
  return p.slice(0, Math.max(0, p.lastIndexOf(sep)));
}

function portFromArgs(): number {
  const i = process.argv.indexOf("--port");
  if (i !== -1 && process.argv[i + 1]) {
    const n = parseInt(process.argv[i + 1], 10);
    if (Number.isSafeInteger(n) && n > 0 && n < 65536) return n;
  }
  return 8080;
}

const port = portFromArgs();

const server = createServer((req, res) => {
  const raw = decodeURIComponent((req.url || "/").split("?")[0]);
  let rel = normalize(raw === "/" ? "index.html" : raw.replace(/^\/+/, ""));
  const full = join(here, rel);
  if (!full.startsWith(here + sep) && full !== here) {
    res.writeHead(403, { "content-type": "text/plain" });
    res.end("forbidden");
    return;
  }
  if (!existsSync(full) || !statSync(full).isFile()) {
    res.writeHead(404, { "content-type": "text/plain" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "content-type": MIME[extname(full)] || "application/octet-stream" });
  createReadStream(full).pipe(res);
});

server.listen(port, "127.0.0.1", () => {
  console.log("Statistik Indonesia tersaji di http://localhost:" + port + "/");
});
