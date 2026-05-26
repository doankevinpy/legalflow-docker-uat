const http = require('http');
const fs = require('fs');
const path = require('path');

const PORT = 8080;
const BACKEND_PORT = 3000;
const DIST_DIR = path.join(__dirname, '..', 'dist');

const server = http.createServer((req, res) => {
  if (req.url.startsWith('/api/')) {
    // Proxy to backend
    const targetPath = req.url.replace(/^\/api/, '');
    const options = {
      hostname: '127.0.0.1',
      port: BACKEND_PORT,
      path: targetPath,
      method: req.method,
      headers: req.headers
    };
    
    // Override host header to match backend
    options.headers.host = `127.0.0.1:${BACKEND_PORT}`;

    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });

    proxyReq.on('error', (err) => {
      console.error('Proxy error:', err);
      res.writeHead(502);
      res.end('Bad Gateway');
    });

    req.pipe(proxyReq, { end: true });
  } else {
    // Serve static files from dist
    let filePath = path.join(DIST_DIR, req.url === '/' ? 'index.html' : req.url.split('?')[0]);
    
    // Security check to prevent directory traversal
    if (!filePath.startsWith(DIST_DIR)) {
      res.writeHead(403);
      return res.end('Forbidden');
    }

    fs.stat(filePath, (err, stats) => {
      if (err || !stats.isFile()) {
        // Fallback to index.html for SPA routing
        filePath = path.join(DIST_DIR, 'index.html');
      }

      fs.readFile(filePath, (err, data) => {
        if (err) {
          res.writeHead(500);
          return res.end('Internal Server Error');
        }

        // Basic MIME types
        const ext = path.extname(filePath).toLowerCase();
        const mimeTypes = {
          '.html': 'text/html',
          '.js': 'text/javascript',
          '.css': 'text/css',
          '.json': 'application/json',
          '.png': 'image/png',
          '.jpg': 'image/jpeg',
          '.svg': 'image/svg+xml',
          '.ico': 'image/x-icon'
        };
        const contentType = mimeTypes[ext] || 'application/octet-stream';

        res.writeHead(200, { 'Content-Type': contentType });
        res.end(data);
      });
    });
  }
});

server.listen(PORT, '127.0.0.1', () => {
  console.log(`Public Trial Gateway listening on http://127.0.0.1:${PORT}`);
});
