// Cloudflare Worker for GCBF Church App
// Handles routing and serves static assets

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    
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
  }
};
