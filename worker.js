import { newsletter } from './src/data/category.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname.replace(/\/$/, '');

    console.log('Request pathname:', pathname);

    try {
      // =========================
      // STATIC FILES
      // =========================
      if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
        console.log('Serving static asset');
        return await fetchFromAssets(env, request);
      }

      // =========================
      // CONTENT ROUTES
      // =========================
      const isContentRoute =
        pathname.startsWith('/newsletter/') ||
        pathname.startsWith('/article/') ||
        pathname.startsWith('/message/');

      if (isContentRoute) {
        console.log('Content route detected');

        const parts = pathname.split('/');
        const category = parts[1];
        const slug = parts[2];

        console.log('Category:', category);
        console.log('Slug:', slug);

        const contentItem = newsletter.find(
          item =>
            item.slug === slug &&
            item.type?.toLowerCase() === category
        );

        console.log('Content found:', !!contentItem);

        if (contentItem) {
          const baseHtml = await getIndexHtml(env, url.origin);

          const htmlWithMeta = injectMetaTags(
            baseHtml,
            contentItem,
            url.origin,
            category
          );

          return new Response(htmlWithMeta, {
            headers: {
              'Content-Type': 'text/html; charset=utf-8',
              'Cache-Control': 'public, max-age=300'
            }
          });
        }
      }

      // =========================
      // SPA FALLBACK
      // =========================
      console.log('Serving SPA index.html');

      const indexRequest = new Request(
        new URL('/index.html', url.origin)
      );

      return await fetchFromAssets(env, indexRequest);

    } catch (error) {
      console.error('Worker error:', error);

      return new Response('Internal Server Error', {
        status: 500
      });
    }
  }
};

// ======================================
// GET INDEX HTML
// ======================================

async function getIndexHtml(env, origin) {
  try {
    const response = await fetchFromAssets(
      env,
      new Request(new URL('/index.html', origin))
    );

    return await response.text();

  } catch (error) {
    console.error('getIndexHtml error:', error);
    return '';
  }
}

// ======================================
// ASSET FETCHER
// ======================================

async function fetchFromAssets(env, request) {
  try {
    if (env?.page_assets?.fetch) {
      return await env.page_assets.fetch(request);
    }

    if (env?.ASSETS?.fetch) {
      return await env.ASSETS.fetch(request);
    }

    console.warn(
      'No asset binding available on env; falling back to global fetch for',
      request.url
    );

    return await fetch(request);

  } catch (error) {
    console.error('fetchFromAssets error:', error);
    throw error;
  }
}
function injectMetaTags(html, content, origin, category) {

  // =========================
  // IMAGE
  // =========================

  let imageUrl = content.coverphoto || '/default-og.jpg';

  // Convert relative path to absolute URL
  if (imageUrl.startsWith('/')) {
    imageUrl = `${origin}${imageUrl}`;
  }

  // =========================
  // PAGE URL
  // =========================

  const pageUrl =
    `${origin}/${category}/${content.slug}`;

  // =========================
  // REMOVE EXISTING TAGS
  // =========================

  let cleaned = html;

  // Remove title
  cleaned = cleaned.replace(
    /<title>[\s\S]*?<\/title>/gi,
    ''
  );

  // Remove canonical
  cleaned = cleaned.replace(
    /<link[^>]*rel=["']canonical["'][^>]*>/gi,
    ''
  );

  // Remove ALL OG tags
  cleaned = cleaned.replace(
    /<meta[^>]*(property|name)=["']og:[^"']*["'][^>]*>/gi,
    ''
  );

  // Remove ALL Twitter tags
  cleaned = cleaned.replace(
    /<meta[^>]*(property|name)=["']twitter:[^"']*["'][^>]*>/gi,
    ''
  );

  // Remove description tags
  cleaned = cleaned.replace(
    /<meta[^>]*name=["']description["'][^>]*>/gi,
    ''
  );

  // =========================
  // NEW META TAGS
  // =========================

  const metaTags = `
    <title>${escapeHtml(content.title)}</title>

    <meta name="description"
      content="${escapeHtml(content.excerpt)}" />

    <link rel="canonical"
      href="${pageUrl}" />

    <!-- Open Graph -->
    <meta property="og:type"
      content="article" />

    <meta property="og:url"
      content="${pageUrl}" />

    <meta property="og:title"
      content="${escapeHtml(content.title)}" />

    <meta property="og:description"
      content="${escapeHtml(content.excerpt)}" />

    <meta property="og:image"
      content="${imageUrl}" />

    <meta property="og:image:secure_url"
      content="${imageUrl}" />

    <meta property="og:image:alt"
      content="${escapeHtml(content.title)}" />

    <!-- Twitter -->
    <meta name="twitter:card"
      content="summary_large_image" />

    <meta name="twitter:title"
      content="${escapeHtml(content.title)}" />

    <meta name="twitter:description"
      content="${escapeHtml(content.excerpt)}" />

    <meta name="twitter:image"
      content="${imageUrl}" />
  `;

  // =========================
  // INSERT INTO HEAD
  // =========================

  return cleaned.replace(
    '</head>',
    `${metaTags}\n</head>`
  );
}

// ======================================
// HELPERS
// ======================================

function escapeHtml(text = '') {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };

  return String(text).replace(
    /[&<>"']/g,
    m => map[m]
  );
}

function formatDate(dateString) {
  try {
    return new Date(dateString).toISOString();
  } catch {
    return new Date().toISOString();
  }
}