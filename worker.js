export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;
    
    console.log('Request path:', pathname);
    
    // Check if it's a static file
    if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
      console.log('Serving as static file');
      try {
        return await env.ASSETS.fetch(request);
      } catch (e) {
        console.error('ASSETS fetch error:', e);
        return new Response('Not found', { status: 404 });
      }
    }
    
    // For all other routes, serve index.html
    console.log('Serving index.html for SPA routing');
    
    try {
      const indexRequest = new Request(new URL('/index.html', url.origin));
      return await env.ASSETS.fetch(indexRequest);
    } catch (e) {
      console.error('Index fetch error:', e);
      return new Response('Error loading page', { status: 500 });
    }
  }
};
