import { createServer } from 'node:http';
import { readFile, stat } from 'node:fs/promises';
import { extname, resolve, sep } from 'node:path';
import auth from '../api/auth.js';
import chat from '../api/chat.js';
import data from '../api/data.js';
import images from '../api/images.js';
import status from '../api/status.js';
import tts from '../api/tts.js';

const root = resolve(new URL('..', import.meta.url).pathname);
const port = Number(process.env.PORT || 5199);
const handlers = new Map([
  ['/api/auth', auth],
  ['/api/chat', chat],
  ['/api/data', data],
  ['/api/images', images],
  ['/api/status', status],
  ['/api/tts', tts],
]);
const contentTypes = {
  '.css':'text/css; charset=utf-8', '.csv':'text/csv; charset=utf-8', '.html':'text/html; charset=utf-8',
  '.js':'text/javascript; charset=utf-8', '.json':'application/json; charset=utf-8', '.md':'text/markdown; charset=utf-8',
  '.png':'image/png', '.jpg':'image/jpeg', '.jpeg':'image/jpeg', '.svg':'image/svg+xml', '.webp':'image/webp',
};

function enhanceResponse(res){
  res.status = code => { res.statusCode = code; return res; };
  res.json = value => {
    res.setHeader('Content-Type', 'application/json; charset=utf-8');
    res.end(JSON.stringify(value));
    return res;
  };
  res.send = value => { res.end(value); return res; };
}

async function readBody(req){
  const chunks = [];
  let size = 0;
  for await (const chunk of req){
    size += chunk.length;
    if(size > 2_000_000) throw Object.assign(new Error('Request body is too large.'), { statusCode:413 });
    chunks.push(chunk);
  }
  if(!chunks.length) return {};
  return JSON.parse(Buffer.concat(chunks).toString('utf8'));
}

async function serveStatic(pathname, res){
  const relative = pathname === '/' ? 'hanzika_18_hover_dictionary_stable.html' : decodeURIComponent(pathname).replace(/^\/+/, '');
  const file = resolve(root, relative);
  if(file !== root && !file.startsWith(root + sep)) return res.status(403).json({ error:'Forbidden.' });
  try {
    if(!(await stat(file)).isFile()) throw new Error('not a file');
    res.setHeader('Content-Type', contentTypes[extname(file).toLowerCase()] || 'application/octet-stream');
    res.end(await readFile(file));
  } catch {
    res.status(404).json({ error:'Not found.' });
  }
}

createServer(async (req, res) => {
  enhanceResponse(res);
  const url = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  req.query = Object.fromEntries(url.searchParams);
  try {
    const handler = handlers.get(url.pathname);
    if(handler){
      req.body = ['POST','PUT','PATCH'].includes(req.method) ? await readBody(req) : {};
      await handler(req, res);
      return;
    }
    await serveStatic(url.pathname, res);
  } catch(error){
    console.error('Local server request failed:', error);
    if(!res.headersSent) res.status(error.statusCode || 500).json({ error:error.message || 'Internal server error.' });
    else res.end();
  }
}).listen(port, '127.0.0.1', () => {
  console.log(`Hanzika is running at http://localhost:${port}`);
});
