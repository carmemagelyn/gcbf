// Cloudflare Worker for GCBF Church App with Assets
// Handles API routing and serves static assets from dist folder

// Import API handlers from the functions directory
import { onRequest as apiHandler } from './functions/api/[[path]].js';

export default {
  async fetch(request, env, ctx) {
    try {
      const url = new URL(request.url);
      
      // Handle API requests
      if (url.pathname.startsWith('/api/')) {
        return apiHandler({ request, env, ctx });
      }
      
      // Serve static assets from the dist directory
      const asset = await env.ASSETS.fetch(request);
      
      // If asset found, return it
      if (asset.status !== 404) {
        return asset;
      }
      
      // For 404s, serve index.html (SPA routing)
      // This allows Vue Router to handle client-side routing
      const indexRequest = new Request(new URL('/', url.origin), request);
      return env.ASSETS.fetch(indexRequest);
    } catch (error) {
      // Log error and return a generic error response
      console.error('Worker error:', error);
      return new Response('Internal Server Error: ' + error.message, { 
        status: 500,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
