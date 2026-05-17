export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      const pathname = url.pathname;
      
      // Handle API requests first
      if (pathname.startsWith('/api/')) {
        return await env.ASSETS.fetch(request);
      }
      
      // Handle R2 file requests
      if (pathname.startsWith('/r2/')) {
        try {
          const key = pathname.replace('/r2/', '');
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
      const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(pathname);
      
      if (hasFileExtension) {
        // Try to serve the static asset
        try {
          const asset = await env.ASSETS.fetch(request);
          if (asset.status === 404) {
            return new Response('Not found', { status: 404 });
          }
          return asset;
        } catch (error) {
          console.error('Asset error:', error);
          return new Response('Not found', { status: 404 });
        }
      }
      
      // For all other routes, serve index.html for SPA routing
      try {
        const indexRequest = new Request(new URL('/index.html', url.origin), {
          method: 'GET'
        });
        
        const indexResponse = await env.ASSETS.fetch(indexRequest);
        
        if (!indexResponse.ok) {
          return new Response('index.html not found', { status: 404 });
        }
        
        return new Response(indexResponse.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
          }
        });
      } catch (indexError) {
        console.error('Index error:', indexError);
        return new Response('Error loading page', { status: 500 });
      }
      
    } catch (error) {
      console.error('Worker error:', error.message);
      return new Response('Internal Server Error: ' + error.message, { 
        status: 500
      });
    }
  }
};
