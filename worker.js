import { newsletter } from './src/data/newsletter.js';

export default {
  async fetch(request, env, ctx) {
    const url = new URL(request.url);
    const pathname = url.pathname;

    console.log('Request pathname:', pathname);

    // Check if it's a static file (has extension)
    if (/\.[a-zA-Z0-9]+$/.test(pathname)) {
      console.log('Serving static file');
      try {
        return await env.ASSETS.fetch(request);
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
          const baseHtml = await getIndexHtml(env);
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
      return await env.ASSETS.fetch(indexRequest);
    } catch (e) {
      console.error('Index fetch error:', e);
      return new Response('Error loading page', { status: 500 });
    }
  }
};

async function getIndexHtml(env) {
  try {
    const response = await env.ASSETS.fetch(new Request(new URL('/index.html', 'https://example.com' )));
    return await response.text();
  } catch (e) {
    console.error('getIndexHtml error:', e);
    return '';
  }
}

function injectMetaTags(html, newsletter, origin) {
  // Use coverphoto, but convert relative path to full URL if needed
  let imageUrl = newsletter.coverphoto;
  if (imageUrl.startsWith('/')) {
    imageUrl = `${origin}${imageUrl}`;
  }

  const metaTags = `
    <meta property="og:title" content="${escapeHtml(newsletter.title)}" />
    <meta property="og:description" content="${escapeHtml(newsletter.excerpt)}" />
    <meta property="og:image" content="${newsletter.coverphoto}" />
    <meta property="og:type" content="website" />
    <meta property="og:url" content="${origin}/newsletter/${newsletter.slug}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeHtml(newsletter.title)}" />
    <meta name="twitter:description" content="${escapeHtml(newsletter.excerpt)}" />
    <meta name="twitter:image" content="${newsletter.coverphoto}" />
    <meta name="description" content="${escapeHtml(newsletter.excerpt)}" />
  `;
  
  console.log('Meta tags to inject:', metaTags);
  
  const result = html.replace('</head>', metaTags + '</head>');
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
