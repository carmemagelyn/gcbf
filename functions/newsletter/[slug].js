// Import your newsletter data directly into the function
// Note: You'll need to copy the data here or fetch it from an API
const newsletters = [
  {
    slug: 'reset-37th-annual-summer-youth-camp-2026',
    title: 'Finding Balance in this Digital World',
    excerpt: 'RESET: 37th Annual Summer Youth Camp Highlights',
    coverphoto: '/newsletter/01_reset/reset-37th-annual-summer-youth-camp-2026.jpg'
  }
  // Add other newsletters here
];

export async function onRequest(context) {
  const { request, env, params } = context;
  const slug = params.slug;
  
  // Find the newsletter data
  const post = newsletters.find(item => item.slug === slug);
  
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
    <meta property="og:url" content="${request.url}" />
    <meta property="og:type" content="article" />
    <meta name="twitter:card" content="summary_large_image" />
  `;
  
  // Insert meta tags before the closing </head> tag
  const modifiedHtml = html.replace('</head>', `${metaTags}</head>` );
  
  return new Response(modifiedHtml, {
    headers: {
      'Content-Type': 'text/html;charset=UTF-8',
    },
  });
}
