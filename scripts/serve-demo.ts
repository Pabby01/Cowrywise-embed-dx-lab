import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DEMO_DIR = path.resolve(__dirname, "../demo");
const PORT = Number(process.env.PORT || 3000);

const MIME_TYPES: Record<string, string> = {
  ".html": "text/html",
  ".css": "text/css",
  ".js": "application/javascript",
  ".json": "application/json",
  ".svg": "image/svg+xml",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".webp": "image/webp"
};

const server = http.createServer((req, res) => {
  let reqUrl = req.url ?? "/";
  const [pathname, search] = reqUrl.split("?");

  // Redirect /foo.html to /foo (clean URLs)
  if (pathname.endsWith(".html") && pathname !== "/index.html") {
    const cleanPath = pathname.slice(0, -5) + (search ? `?${search}` : "");
    res.writeHead(308, { Location: cleanPath });
    res.end();
    return;
  }

  let reqPath = pathname === "/" ? "/index.html" : pathname;

  let filePath = path.join(DEMO_DIR, reqPath);

  // If no extension, try appending .html
  if (!path.extname(filePath)) {
    if (fs.existsSync(filePath + ".html")) {
      filePath = filePath + ".html";
    }
  }

  const ext = path.extname(filePath).toLowerCase();

  // Basic directory traversal protection
  if (!filePath.startsWith(DEMO_DIR)) {
    res.writeHead(403, { "Content-Type": "text/plain" });
    res.end("Forbidden");
    return;
  }

  fs.readFile(filePath, (err, content) => {
    if (err) {
      if (err.code === "ENOENT") {
        res.writeHead(404, { "Content-Type": "text/plain" });
        res.end("Not Found");
      } else {
        res.writeHead(500, { "Content-Type": "text/plain" });
        res.end(`Server Error: ${err.code}`);
      }
      return;
    }

    const contentType = MIME_TYPES[ext] || "application/octet-stream";
    res.writeHead(200, { "Content-Type": contentType });
    res.end(content);
  });
});

server.listen(PORT, () => {
  console.log("\n=======================================================");
  console.log("  🚀 Cowrywise Embed 3D Fintech Web Showcase Running!   ");
  console.log(`  Local URL: http://localhost:${PORT}                  `);
  console.log("  Press Ctrl+C to stop the preview server.             ");
  console.log("=======================================================\n");
});
