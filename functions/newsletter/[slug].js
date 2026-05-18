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
  
  const metaTags = `
    <title>${post.title} | GCBF</title>
    <meta property="og:title" content="${post.title}" />
    <meta property="og:description" content="${post.excerpt}" />
    <meta property="og:image" content="https://gcbf.com.ph${post.coverphoto}" />
    <meta property="og:image:secure_url" content="https://gcbf.com.ph${post.coverphoto}" />
    <meta property="og:image:alt" content="${post.title}" />
    <meta property="og:url" content="${request.url}" />
    <meta property="og:type" content="article" />
    <meta property="article:published_time" content="${post.date}" />
    <meta property="article:author" content="${post.author}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${post.title}" />
    <meta name="twitter:description" content="${post.excerpt}" />
    <meta name="twitter:image" content="https://gcbf.com.ph${post.coverphoto}" />
    <meta name="twitter:image:src" content="https://gcbf.com.ph${post.coverphoto}" />
    <meta name="twitter:image:alt" content="${post.title}" />
    <meta name="twitter:title" content="${post.title}" />
    <meta name="twitter:description" content="${post.excerpt}" />
    <meta name="twitter:image" content="https://gcbf.com.ph${post.coverphoto}" />
  `;
  
  // Insert meta tags before the closing </head> tag
  const modifiedHtml = html.replace('</head>', `${metaTags}</head>` );
  
  return new Response(modifiedHtml, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}
