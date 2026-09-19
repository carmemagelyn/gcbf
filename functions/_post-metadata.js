import { newsletter } from '../src/data/category.js';

export async function onRequest(context) {
  const { request, env, params } = context;
  const post = newsletter.find(item => item.slug === params.slug);
  const requestUrl = new URL(request.url);
  const response = await fetchIndex(env, requestUrl);

  if (!post) {
    return response;
  }

  const title = post.seo?.title || post.title;
  const imagePath = post.seo?.image || post.coverphoto;
  const imageUrl = toAbsoluteUrl(imagePath, requestUrl.origin);
  const canonicalUrl = `https://gcbf.com.ph${requestUrl.pathname}`;
  const contentType = post.type === 'message' ? 'video.other' : 'article';
  const html = cleanHeadMeta(await response.text());
  const metaTags = `
    <title>${escapeAttribute(title)}</title>
    <link rel="canonical" href="${escapeAttribute(canonicalUrl)}" />
    <meta property="og:url" content="${escapeAttribute(canonicalUrl)}" />
    <meta property="og:type" content="${contentType}" />
    <meta property="og:title" content="${escapeAttribute(title)}" />
    <meta property="og:image" content="${escapeAttribute(imageUrl)}" />
    <meta property="og:image:url" content="${escapeAttribute(imageUrl)}" />
    <meta property="og:image:secure_url" content="${escapeAttribute(imageUrl)}" />
    <meta property="og:image:alt" content="${escapeAttribute(title)}" />
    <meta property="og:image:type" content="${imageContentType(imageUrl)}" />
    <meta property="article:published_time" content="${escapeAttribute(post.date)}" />
    <meta property="article:author" content="${escapeAttribute(post.author)}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${escapeAttribute(title)}" />
    <meta name="twitter:image" content="${escapeAttribute(imageUrl)}" />
    <meta name="twitter:image:src" content="${escapeAttribute(imageUrl)}" />
    <meta name="twitter:image:alt" content="${escapeAttribute(title)}" />
  `;

  return new Response(html.replace('</head>', `${metaTags}</head>`), {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}

async function fetchIndex(env, requestUrl) {
  const indexUrl = new URL('/index.html', requestUrl.origin);
  const assetRequest = new Request(indexUrl);

  if (env?.page_assets?.fetch) {
    return env.page_assets.fetch(assetRequest);
  }

  if (env?.ASSETS?.fetch) {
    return env.ASSETS.fetch(assetRequest);
  }

  return fetch(assetRequest);
}

function toAbsoluteUrl(imagePath, origin) {
  if (!imagePath) return '';
  return new URL(imagePath, origin).href;
}

function imageContentType(imageUrl) {
  const extension = new URL(imageUrl).pathname.split('.').pop()?.toLowerCase();
  return extension === 'png' ? 'image/png' : extension === 'webp' ? 'image/webp' : 'image/jpeg';
}

function escapeAttribute(value) {
  return String(value || '')
    .replace(/&/g, '&amp;')
    .replace(/"/g, '&quot;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function cleanHeadMeta(html) {
  return html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<link rel="canonical"[^>]*>/gi, '')
    .replace(/<meta\s+[^>]*(property|name)=["'](?:og:|twitter:|description)([^"']*?)["'][^>]*>/gi, '')
    .replace(/<meta\s+(?:property|name)=["'](?:og:|twitter:|description)[^"']*["'][^>]*>/gi, '');
}