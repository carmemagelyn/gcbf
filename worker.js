import fs from 'fs';
import path from 'path';

const distDir = './dist';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    let pathname = url.pathname;

    // Try to serve the requested file
    let filePath = path.join(distDir, pathname);
    
    try {
      if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        const content = fs.readFileSync(filePath);
        return new Response(content, {
          headers: { 'Content-Type': getContentType(filePath) }
        });
      }
    } catch (e) {
      console.error('File error:', e);
    }

    // For SPA routing, serve index.html
    try {
      const indexPath = path.join(distDir, 'index.html');
      const content = fs.readFileSync(indexPath);
      return new Response(content, {
        headers: { 'Content-Type': 'text/html' }
      });
    } catch (e) {
      return new Response('Error', { status: 500 });
    }
  }
};

function getContentType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const types = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.ico': 'image/x-icon',
  };
  return types[ext] || 'application/octet-stream';
}
