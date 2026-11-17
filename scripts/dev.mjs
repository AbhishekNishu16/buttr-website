// Local preview: serves the site and the /api routes on http://localhost:3000
import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { extname, join, normalize } from 'node:path';

const root = process.cwd();
const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.png': 'image/png', '.otf': 'font/otf', '.json': 'application/json', '.md': 'text/markdown' };
const api = { '/api/ask': (await import('../api/ask.js')).default, '/api/lead': (await import('../api/lead.js')).default };

http.createServer(async (req, res) => {
  const url = new URL(req.url, 'http://x');
  if (api[url.pathname]) {
    let raw = '';
    for await (const c of req) raw += c;
    req.body = raw;
    res.status = code => { res.statusCode = code; return res; };
    res.json = obj => { res.setHeader('Content-Type', 'application/json'); res.end(JSON.stringify(obj)); };
    return api[url.pathname](req, res);
  }
  const path = normalize(join(root, url.pathname === '/' ? 'index.html' : decodeURIComponent(url.pathname)));
  if (!path.startsWith(root) || path.includes('/api/') || path.includes('/node_modules/')) { res.statusCode = 404; return res.end(); }
  try {
    const data = await readFile(path);
    res.setHeader('Content-Type', types[extname(path)] || 'application/octet-stream');
    res.end(data);
  } catch (e) { res.statusCode = 404; res.end('Not found'); }
}).listen(process.env.PORT || 3000, () => console.log('Buttr website on http://localhost:' + (process.env.PORT || 3000)));
