import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PORT = Number(process.env.PORT || 3000);
const HOST = "0.0.0.0";

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp",
  ".ico": "image/x-icon",
  ".txt": "text/plain; charset=utf-8"
};

function safePath(urlPath) {
  const pathname = decodeURIComponent(urlPath.split("?")[0]);
  const normalized = path.normalize(pathname).replace(/^(\.\.(\/|\\|$))+/, "");
  return path.join(__dirname, normalized === "/" ? "index.html" : normalized);
}

function sendFile(res, filePath, cache = "no-cache") {
  fs.stat(filePath, (err, stat) => {
    if (err || !stat.isFile()) return send404(res);
    const ext = path.extname(filePath).toLowerCase();
    res.writeHead(200, {
      "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
      "Cache-Control": cache,
      "X-Content-Type-Options": "nosniff",
      "Referrer-Policy": "strict-origin-when-cross-origin",
      "X-Frame-Options": "SAMEORIGIN"
    });
    fs.createReadStream(filePath).pipe(res);
  });
}

function send404(res) {
  const file = path.join(__dirname, "404.html");
  if (fs.existsSync(file)) {
    res.writeHead(404, {
      "Content-Type": "text/html; charset=utf-8",
      "Cache-Control": "no-cache",
      "X-Content-Type-Options": "nosniff"
    });
    fs.createReadStream(file).pipe(res);
  } else {
    res.writeHead(404, {"Content-Type": "text/plain; charset=utf-8"});
    res.end("404 - Page not found");
  }
}

const server = http.createServer((req, res) => {
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.writeHead(405, {"Content-Type": "text/plain; charset=utf-8", "Allow": "GET, HEAD"});
    return res.end("Method Not Allowed");
  }

  let filePath;
  try {
    filePath = safePath(req.url || "/");
  } catch {
    return send404(res);
  }

  // Friendly directory routes such as /games/snake/
  if (fs.existsSync(filePath) && fs.statSync(filePath).isDirectory()) {
    filePath = path.join(filePath, "index.html");
  }

  if (!filePath.startsWith(__dirname)) return send404(res);

  const ext = path.extname(filePath).toLowerCase();
  const cache = ext === ".html" || ext === ".webmanifest" || ext === ".js"
    ? "no-cache"
    : "public, max-age=31536000, immutable";

  if (req.method === "HEAD") {
    fs.stat(filePath, (err, stat) => {
      if (err || !stat.isFile()) return send404(res);
      res.writeHead(200, {
        "Content-Type": MIME_TYPES[ext] || "application/octet-stream",
        "Cache-Control": cache
      });
      res.end();
    });
    return;
  }

  sendFile(res, filePath, cache);
});

server.listen(PORT, HOST, () => {
  console.log(`GAME HUB running on http://${HOST}:${PORT}`);
});
