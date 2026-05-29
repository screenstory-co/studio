# Screenstory Studio

Decap CMS admin hub for Screenstory client sites.

## URL

- Production: `https://studio.screenstory.co`

## Architecture

- Astro static site
- Cloudflare Pages Functions (OAuth proxy + dynamic config API)
- Decap CMS frontend (`decap-cms@3.6.2` from unpkg)
- GitHub OAuth backend authentication
- Multi-site: loads different repos/collections per `?site=` parameter

## Sites managed

| slug | name | repo | domain |
|------|------|------|--------|
| yiapanis | Yiapanis Films | screenstory-co/yiapanis.co | yiapanis.co |
| screenstory | Screenstory | screenstory-co/screenstory.co | screenstory.co |

## OAuth flow

1. User opens `/admin?site=yiapanis`
2. Decap CMS loads config from `/api/config?site=yiapanis` (GitHub backend)
3. Login → popup → `https://studio.screenstory.co/auth` → redirects to GitHub OAuth
4. GitHub callback → `/auth?code=xxx` → Pages Function exchanges code for token
5. Token returned to Decap CMS popup → authenticated

## Development

```bash
npm run dev        # static pages only (OAuth not available locally)
npm run build      # build static site
```

## Deployment

Cloudflare Pages auto-builds from the GitHub repo `screenstory-co/studio`.

Required env vars (set in Cloudflare Pages dashboard):
- `GITHUB_CLIENT_ID` — GitHub OAuth App client ID
- `GITHUB_CLIENT_SECRET` — GitHub OAuth App client secret
