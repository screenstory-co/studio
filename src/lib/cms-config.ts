import sitesData from '../data/sites.json';

export { sitesData };

export const collections: Record<string, unknown> = {
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

export function getCollectionDefinition(name: string): unknown {
  return collections[name];
}

export function getSiteConfig(slug: string): Record<string, unknown> | null {
  const site = sitesData.sites.find(s => s.slug === slug);
  if (!site) return null;
  return {
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
    collections: site.collections.map(name => getCollectionDefinition(name)),
  };
}
