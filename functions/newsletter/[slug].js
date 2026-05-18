import { newsletter } from '../../src/data/newsletter.js';

export async function onRequest(context) {
  const { request, env, params } = context;
  const slug = params.slug;
  
  // Find the newsletter data
  const post = newsletter.find(item => item.slug === slug);
  
  // Fetch the original index.html
  const url = new URL(request.url);
  const indexUrl = new URL('/index.html', url.origin);
  const response = await env.ASSETS.fetch(new Request(indexUrl));
  
  if (!post) {
    return response; // Return normal page if not found
  }
  
  // Inject Open Graph meta tags into the HTML
  const html = await response.text();
  const cleanedHtml = cleanHeadMeta(html);
  const imageUrl = post.coverphoto.startsWith('/') ? `https://gcbf.com.ph${post.coverphoto}` : post.coverphoto;
  const metaTags = `
    <title>${post.title} | GCBF</title>
    <meta name="description" content="${post.excerpt}" />
    <link rel="canonical" href="${request.url}" />
    <meta property="og:url" content="${request.url}" />
    <meta property="og:type" content="article" />
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${post.excerpt}" />
    <meta property="og:image" content="${imageUrl}" />
    <meta property="og:image:secure_url" content="${imageUrl}" />
    <meta property="og:image:alt" content="${post.title}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:type" content="image/jpeg" />
    <meta property="article:published_time" content="${post.date}" />
    <meta property="article:author" content="${post.author}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${post.title}" />
    <meta name="twitter:description" content="${post.excerpt}" />
    <meta name="twitter:image" content="${imageUrl}" />
    <meta name="twitter:image:src" content="${imageUrl}" />
    <meta name="twitter:image:alt" content="${post.title}" />
  `;
  
  // Insert meta tags before the closing </head> tag
  const modifiedHtml = cleanedHtml.replace('</head>', `${metaTags}</head>` );
  
  return new Response(modifiedHtml, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}

function cleanHeadMeta(html) {
  let cleaned = html
    .replace(/<title>[\s\S]*?<\/title>/gi, '')
    .replace(/<link rel="canonical"[^>]*>/gi, '');
  
  // Remove ALL meta tags with property="og:*" or name="og:*" or name="twitter:*" or name="description"
  cleaned = cleaned.replace(/<meta\s+[^>]*(property|name)=["'](?:og:|twitter:|description)([^"']*?)["'][^>]*>/gi, '');
  
  // Also catch any remaining og: or twitter: meta tags with reversed attribute order
  cleaned = cleaned.replace(/<meta\s+(?:property|name)=["'](?:og:|twitter:|description)[^"']*["'][^>]*>/gi, '');
  
  return cleaned;
}
