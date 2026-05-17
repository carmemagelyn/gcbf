export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Handle API requests first
      if (url.pathname.startsWith('/api/')) {
        return await env.ASSETS.fetch(request);
      }
      
      // Handle R2 file requests
      if (url.pathname.startsWith('/r2/')) {
        try {
          const key = url.pathname.replace('/r2/', '');
          const object = await env.STORAGE.get(key);
          
          if (object === null) {
            return new Response('File not found', { status: 404 });
          }
          
          const headers = new Headers();
          object.writeHttpMetadata(headers);
          headers.set('etag', object.httpEtag );
          headers.set('cache-control', 'public, max-age=31536000');
          
          return new Response(object.body, { headers });
        } catch (r2Error) {
          console.error('R2 fetch error:', r2Error);
          return new Response('File not found', { status: 404 });
        }
      }
      
      // Check if the request is for a static file (has file extension)
      const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(url.pathname);
      
      if (hasFileExtension) {
        // Try to serve the static asset
        const asset = await env.ASSETS.fetch(request);
        return asset;
      }
      
      // For all other routes (including /newsletter), serve index.html
      const indexUrl = new URL('/index.html', url.origin);
      const indexRequest = new Request(indexUrl, {
        method: 'GET',
        headers: request.headers
      });
      
      const indexResponse = await env.ASSETS.fetch(indexRequest);
      
      return new Response(indexResponse.body, {
        status: 200,
        headers: {
          'Content-Type': 'text/html; charset=utf-8',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });
      
    } catch (error) {
      console.error('Worker error:', error);
      return new Response('Internal Server Error', { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
