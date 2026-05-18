import { getAssetFromKV, mapRequestToAsset } from '@cloudflare/kv-asset-handler';

export default {
  async fetch(request, env, ctx) {
    try {
      // Serve static assets
      return await getAssetFromKV(
        {
          request,
          waitUntil: ctx.waitUntil.bind(ctx),
        },
        {
          ASSET_NAMESPACE: env.ASSETS,
          ASSET_MANIFEST: import.meta.json,
          mapRequestToAsset: (req) => {
            // For SPA routing: if it's not a file, serve index.html
            let url = new URL(req.url);
            if (!url.pathname.match(/\.[a-zA-Z0-9]+$/)) {
              url.pathname = '/index.html';
            }
            return mapRequestToAsset(new Request(url, req));
          },
        }
      );
    } catch (e) {
      console.error('Worker error:', e);
      return new Response('Error loading page', { status: 500 });
    }
  }
};
