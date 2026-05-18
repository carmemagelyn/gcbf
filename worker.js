export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Check if it's a static file (has extension)
    if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
      try {
        return await env.ASSETS.fetch(request);
      } catch (e) {
        return new Response('Not found', { status: 404 });
      }
    }

    // For SPA routing, serve index.html
    try {
      const indexRequest = new Request(new URL('/index.html', url.origin));
      return await env.ASSETS.fetch(indexRequest);
    } catch (e) {
      return new Response('Error loading page', { status: 500 });
    }
  }
};
