import { newsletter } from './src/data/category.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    console.log('Request pathname:', pathname);

    // Check if it's a static file (has extension)
    if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
      console.log('Serving static file');
      try {
        return await fetchFromAssets(env, request);
      } catch (e) {
        return new Response('Not found', { status: 404 });
      }
    }

    // For newsletter pages, inject meta tags
    if (pathname.startsWith('/newsletter/')) {
      console.log('Newsletter page detected');
      try {
        const slug = pathname.split('/')[2];
        console.log('Looking for slug:', slug);
        
        const newsletterItem = newsletter.find(n => n.slug === slug);
        console.log('Newsletter found:', !!newsletterItem);
        
        if (newsletterItem) {
          console.log('Injecting meta tags for:', newsletterItem.title);
          
          // Get base HTML
          const baseHtml = await getIndexHtml(env, url.origin);
          console.log('Base HTML length:', baseHtml.length);
          
          // Inject Open Graph meta tags
          const htmlWithMeta = injectMetaTags(baseHtml, newsletterItem, url.origin);
          console.log('HTML with meta length:', htmlWithMeta.length);
          
          return new Response(htmlWithMeta, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' }
          });
        }
      } catch (e) {
        console.error('Newsletter fetch error:', e);
      }
    }

    // For all other routes, serve index.html
    console.log('Serving index.html');
    try {
      const indexRequest = new Request(new URL('/index.html', url.origin));
      return await fetchFromAssets(env, indexRequest);
    } catch (e) {
      console.error('Index fetch error:', e);
      return new Response('Error loading page', { status: 500 });
    }
  }
};

async function getIndexHtml(env) {
  try {
    // Use the provided origin to build an absolute URL when falling back to fetch
    const origin = arguments.length > 1 ? arguments[1] : 'https://example.com';
    const response = await fetchFromAssets(env, new Request(new URL('/index.html', origin)));
    return await response.text();
  } catch (e) {
    console.error('getIndexHtml error:', e);
    return '';
  }
}

// Safe asset fetch helper: prefer env.ASSETS.fetch, fall back to global fetch
async function fetchFromAssets(env, request) {
  try {
    if (env && env.ASSETS && typeof env.ASSETS.fetch === 'function') {
      return await env.ASSETS.fetch(request);
    }

    // Fallback: try to fetch the resource from the network
    console.warn('env.ASSETS not available — falling back to global fetch for', request.url);
    return await fetch(request);
  } catch (e) {
    console.error('fetchFromAssets error for', request.url, e);
    throw e;
  }
}

function injectMetaTags(html, newsletter, origin) {
  // Use coverphoto, but convert relative path to full URL if needed
  let imageUrl = newsletter.coverphoto;
  if (imageUrl.startsWith('/')) {
    imageUrl = `${origin}${imageUrl}`;
  }

  // Clean homepage meta tags first
  let cleaned = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<link rel="canonical"[^>]*>/gi, '');
  
  // Remove ALL meta tags with property="og:*" or name="og:*" or name="twitter:*" or name="description"
  cleaned = cleaned.replace(/<meta\s+[^>]*(property|name)=["'](?:og:|twitter:|description)([^"']*?)["'][^>]*>/gi, '');
  cleaned = cleaned.replace(/<meta\s+(?:property|name)=["'](?:og:|twitter:|description)[^"']*["'][^>]*>/gi, '');

  const metaTags = `
    <title>${newsletter.title}</title>}
    <meta name="description" content="${escapeHtml(newsletter.excerpt)}" />
    <link rel="canonical" href="${origin}/newsletter/${newsletter.slug}" />
    <meta property="og:url" content="${origin}/newsletter/${newsletter.slug}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${escapeHtml(newsletter.title)}" />
    <meta property="og:description" content="${escapeHtml(newsletter.excerpt)}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:alt" content="${escapeHtml(newsletter.title)}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="article:published_time" content="${newsletter.date}" />
    <meta property="article:author" content="${escapeHtml(newsletter.author)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(newsletter.title)}" />
    <meta name="twitter:description" content="${escapeHtml(newsletter.excerpt)}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:src" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="${escapeHtml(newsletter.title)}" />
  `;
  
  console.log('Meta tags to inject:', metaTags);
  
  const result = cleaned.replace('</head>', metaTags + '</head>');
  console.log('Replacement successful:', result.includes(newsletter.title));
  
  return result;
}


function escapeHtml(text) {
  const map = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;'
  };
  return text.replace(/[&<>"']/g, m => map[m]);
}
