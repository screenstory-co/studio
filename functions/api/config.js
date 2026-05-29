// Inline data because functions cannot load files from outside the functions dir
const sites = [
  {
    slug: 'yiapanis',
    name: 'Yiapanis Films',
    domain: 'yiapanis.co',
    repo: 'screenstory-co/yiapanis.co',
    branch: 'main',
    collections: ['profile', 'films', 'blog', 'inDevelopment'],
    media_folder: 'public/images',
    public_folder: '/images'
  },
  {
    slug: 'screenstory',
    name: 'Screenstory',
    domain: 'screenstory.co',
    repo: 'screenstory-co/screenstory.co',
    branch: 'main',
    collections: ['profile', 'films', 'blog'],
    media_folder: 'public/images',
    public_folder: '/images'
  }
];

const collectionsMap = {
  profile: {
    name: 'profile',
    label: 'Profile',
    folder: 'src/content/profile',
    create: false,
    delete: false,
    slug: 'default',
    editor: { preview: false },
    fields: [
      { label: 'Name', name: 'name', widget: 'string' },
      { label: 'Tagline', name: 'tagline', widget: 'string', required: false },
      { label: 'Headshot', name: 'headshot', widget: 'image', required: false },
      { label: 'Body', name: 'body', widget: 'markdown' },
    ],
  },
  films: {
    name: 'films',
    label: 'Films',
    folder: 'src/content/films',
    create: true,
    delete: true,
    slug: '{{slug}}',
    editor: { preview: false },
    fields: [
      { label: 'Title', name: 'title', widget: 'string' },
      { label: 'Genre', name: 'genre', widget: 'list', allow_add: true },
      { label: 'Type', name: 'type', widget: 'string', required: false },
      { label: 'Synopsis', name: 'synopsis', widget: 'text' },
      { label: 'Video URL', name: 'videoUrl', widget: 'string', required: false },
      { label: 'Poster', name: 'poster', widget: 'image', required: false },
      { label: 'Order', name: 'order', widget: 'number', value_type: 'int', default: 0 },
      { label: 'Year', name: 'year', widget: 'number', value_type: 'int', required: false },
      { label: 'Body', name: 'body', widget: 'markdown', required: false },
    ],
  },
  blog: {
    name: 'blog',
    label: 'Blog Posts',
    folder: 'src/content/blog',
    create: true,
    delete: true,
    slug: '{{slug}}',
    editor: { preview: false },
    fields: [
      { label: 'Title', name: 'title', widget: 'string' },
      { label: 'Date', name: 'date', widget: 'datetime', date_format: 'YYYY-MM-DD', time_format: false },
      { label: 'Draft', name: 'draft', widget: 'boolean', default: false },
      { label: 'Excerpt', name: 'excerpt', widget: 'text', required: false },
      { label: 'Body', name: 'body', widget: 'markdown' },
    ],
  },
  inDevelopment: {
    name: 'inDevelopment',
    label: 'In Development',
    folder: 'src/content/inDevelopment',
    create: true,
    delete: true,
    slug: '{{slug}}',
    editor: { preview: false },
    fields: [
      { label: 'Title', name: 'title', widget: 'string' },
      { label: 'Status', name: 'status', widget: 'select', options: ['concept', 'development', 'pre-production', 'production'] },
      { label: 'Logline', name: 'logline', widget: 'text' },
      { label: 'Genre', name: 'genre', widget: 'list', allow_add: true, required: false },
      { label: 'Type', name: 'type', widget: 'string', required: false },
      { label: 'Body', name: 'body', widget: 'markdown', required: false },
    ],
  },
};

export async function onRequestGet(context) {
  const { request } = context;
  const url = new URL(request.url);
  const slug = url.searchParams.get('site');
  if (!slug) {
    return new Response(JSON.stringify({ error: 'Missing site parameter' }), {
      status: 400, headers: { 'content-type': 'application/json' }
    });
  }
  const site = sites.find(s => s.slug === slug);
  if (!site) {
    return new Response(JSON.stringify({ error: 'Unknown site' }), {
      status: 404, headers: { 'content-type': 'application/json' }
    });
  }

  const cfg = {
    backend: {
      name: 'github',
      repo: site.repo,
      branch: site.branch,
      base_url: 'https://studio.screenstory.co',
      auth_scope: 'repo',
    },
    media_folder: site.media_folder,
    public_folder: site.public_folder,
    publish_mode: 'editorial_workflow',
    site_url: `https://${site.domain}`,
    slug: { encoding: 'ascii', clean_accents: true },
    collections: site.collections.map(name => collectionsMap[name]),
  };

  return new Response(JSON.stringify(cfg, null, 2), {
    headers: { 
      'content-type': 'application/json',
      'access-control-allow-origin': '*',
    }
  });
}
