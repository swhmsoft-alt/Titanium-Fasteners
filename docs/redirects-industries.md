# Retired industry URLs — permanent redirect map

> Status: repository part **done** (Astro `redirects` in `astro.config.mjs`).
> Server part **pending** (needs host/CDN access — see §3).

## 1. The map

Seven legacy industry URLs were retired when the CMS-style industry family was
replaced by ten hand-written application pages. The old paths are still linked
from the live internet, so they must keep resolving — but they must not resolve
to content.

| Old URL (301 source) | Permanent destination | Status of old content |
| --- | --- | --- |
| `/industries/aerospace/` | `/industries/aerospace-uav/` | reference-brand aerospace page — retired |
| `/industries/medical/` | `/industries/medical-devices/` | CMS block page — retired |
| `/industries/robotics/` | `/industries/industrial-robotics/` | CMS block page — retired |
| `/industries/semiconductors/` | `/industries/semiconductor-vacuum/` | CMS block page — retired |
| `/industries/railway/` | `/industries/rail-rolling-stock/` | CMS block page — retired |
| `/industries/electrical-engineering/` | `/industries/` | CMS block page — retired |
| `/industries/hvac/` | `/industries/` | CMS block page — retired |

`/industries/electrical-engineering/` and `/industries/hvac/` have no
same-topic successor among the ten application pages, so they resolve to the
industries hub. Both are listed in the hub's sector grid under a different
name only in part; the hub itself lists every sector with its own page, so a
visitor landing on `/industries/` can reach the closest match in one click.

## 2. What the repository already does (and what it is not)

`astro.config.mjs` → `redirects` emits a static stub at each source path:

```html
<title>Redirecting to: /industries/aerospace-uav/</title>
<meta http-equiv="refresh" content="0;url=/industries/aerospace-uav/">
<meta name="robots" content="noindex">
<link rel="canonical" href="https://fastener.bozemetal.com/industries/aerospace-uav/">
```

Guarantees this gives us without any server access:

- the old URL never returns 404;
- the stub is `noindex`, so it does not compete with the destination page;
- the stub declares the destination as `rel=canonical`, so search engines
  consolidate the signals on the destination;
- the meta refresh is instant (no delay), so visitors are moved on in one hop.

**This is not an HTTP 301.** The static host serves the stub with status 200.
For a true `301 Moved Permanently` the redirect has to be issued by the web
server or the CDN — §3.

## 3. Server-side rules (must be applied by whoever holds host access)

Production is **OpenResty** behind **Cloudflare**. `.htaccess` is not read by
OpenResty, so it must not be used here.

### 3.1 OpenResty (origin)

Add to the `server` block that serves `fastener.bozemetal.com`:

```nginx
# ── Retired industry URLs — permanent redirects ─────────────────────────
# Source of truth: docs/redirects-industries.md + astro.config.mjs redirects.
# Keep both in sync: the Astro stubs are the fallback when the CDN is bypassed.

location = /industries/aerospace {
    return 301 /industries/aerospace-uav/;
}
location = /industries/aerospace/ {
    return 301 /industries/aerospace-uav/;
}

location = /industries/medical {
    return 301 /industries/medical-devices/;
}
location = /industries/medical/ {
    return 301 /industries/medical-devices/;
}

location = /industries/robotics {
    return 301 /industries/industrial-robotics/;
}
location = /industries/robotics/ {
    return 301 /industries/industrial-robotics/;
}

location = /industries/semiconductors {
    return 301 /industries/semiconductor-vacuum/;
}
location = /industries/semiconductors/ {
    return 301 /industries/semiconductor-vacuum/;
}

location = /industries/railway {
    return 301 /industries/rail-rolling-stock/;
}
location = /industries/railway/ {
    return 301 /industries/rail-rolling-stock/;
}

location = /industries/electrical-engineering {
    return 301 /industries/;
}
location = /industries/electrical-engineering/ {
    return 301 /industries/;
}

location = /industries/hvac {
    return 301 /industries/;
}
location = /industries/hvac/ {
    return 301 /industries/;
}
```

Reload with `openresty -t && openresty -s reload`.

### 3.2 Cloudflare (edge)

Preferred when the edge is reachable — it protects the origin and works for
visitors who never touch the origin.

Dashboard path: **Rules → Redirect Rules → Single Redirect** (or Bulk Redirect
for the whole set). Create seven rules, all with:

- **Status code:** `301`
- **Source URL:** e.g. `https://fastener.bozemetal.com/industries/aerospace*`
- **Target URL:** e.g. `https://fastener.bozemetal.com/industries/aerospace-uav/`

Use `https://fastener.bozemetal.com/industries/aerospace` as source and enable
**"Preserve query string"** if inbound links carry campaign parameters that
should survive the hop.

Alternatively **Rules → Origin Rules → Origin Override** is *not* suitable —
this is a redirect, not a rewrite.

### 3.3 Verification

```bash
for p in aerospace medical robotics semiconductors railway electrical-engineering hvac; do
  curl -s -o /dev/null -w "%{http_code} %{redirect_url}\n" \
    "https://fastener.bozemetal.com/industries/$p/"
done
```

Expected: `301` + the destination URL from §1 for each of the seven paths.
Without the server rules the same request returns `200` and the Astro stub
(meta refresh) — still functional, still `noindex`, but not a status-code
redirect.

## 4. Deploy interaction

The FTP deployment (`scripts/deploy-ftp-ci.mjs`) uploads `dist/` over the
document root and overwrites files at identical paths. The redirect stubs are
part of `dist/`, so they replace the retired pages' `index.html` files on the
next deployment. Files that exist on the server but no longer exist in `dist/`
are **not** removed by the uploader — ask the host owner to delete any
orphaned directories from the retired pages when the origin rules in §3.1 are
applied.
