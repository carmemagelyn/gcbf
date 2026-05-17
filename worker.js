export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    console.log('Request path:', pathname);
    console.log('Has ASSETS binding:', !!env.ASSETS);
    
    // Check if it's a static file
    if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
      console.log('Serving as static file');
      return env.ASSETS.fetch(request);
    }
    
    // For all other routes, serve index.html
    console.log('Serving index.html for SPA routing');
    
    const indexUrl = new URL('/index.html', url.origin);
    const indexRequest = new Request(indexUrl);
    
    return env.ASSETS.fetch(indexRequest);
  }
};
