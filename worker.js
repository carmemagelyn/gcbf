// Cloudflare Worker for GCBF Church App with Assets
// Handles API routing and serves static assets from dist folder

// Import API handlers from the functions directory
import { onRequest as apiHandler } from './functions/api/[[path]].js';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Handle API requests first
      if (url.pathname.startsWith('/api/')) {
        return await apiHandler({ request, env, ctx });
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
          headers.set('etag', object.httpEtag);
          headers.set('cache-control', 'public, max-age=31536000');
          
          return new Response(object.body, { headers });
        } catch (r2Error) {
          console.error('R2 fetch error:', r2Error);
          return new Response('File not found', { status: 404 });
        }
      }
      
      // For Workers with Assets, ASSETS is automatically provided
      // Serve static assets from the configured assets directory
      
      // Check if the request is for a static file (has file extension)
      const hasFileExtension = /\.[a-zA-Z0-9]+$/.test(url.pathname);
      
      if (hasFileExtension) {
        // Try to serve the static asset
        try {
          const asset = await env.ASSETS.fetch(request);
          if (asset && asset.status !== 404) {
            return asset;
          }
        } catch (assetError) {
          console.error('Asset fetch error:', assetError);
        }
        
        // If static file not found, return 404
        return new Response('File not found', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
      
      // For HTML routes (no file extension), always serve index.html for SPA routing
      // This allows Vue Router to handle client-side routing
      try {
        const indexUrl = new URL('/index.html', url.origin);
        const indexRequest = new Request(indexUrl, {
          method: request.method,
          headers: request.headers
        });
        const indexResponse = await env.ASSETS.fetch(indexRequest);
        
        // Return index.html with proper HTML content type
        return new Response(indexResponse.body, {
          status: 200,
          headers: {
            'Content-Type': 'text/html; charset=utf-8',
            'Cache-Control': 'no-cache'
          }
        });
      } catch (indexError) {
        console.error('Index fetch error:', indexError);
        return new Response('Not Found', { 
          status: 404,
          headers: { 'Content-Type': 'text/plain' }
        });
      }
    } catch (error) {
      // Log error and return a generic error response
      console.error('Worker error:', error);
      return new Response('Internal Server Error: ' + error.message + '\nStack: ' + error.stack, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
