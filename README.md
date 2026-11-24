# kuititon.com website

Static site: `index.html` (start), `yritys.html` (Business), `projekti.html` (Project), `sovellus.html` (App).
Finnish text is in the markup; English is in each element's `data-en` attribute and switched by `assets/site.js`.

## Publish with GitHub Pages
1. Create a public repository and upload everything in this folder to its root (including `CNAME` and `.nojekyll`).
2. Repository Settings → Pages → Source: "Deploy from a branch", branch `main`, folder `/ (root)`.
3. Settings → Pages → Custom domain: `kuititon.com`, then tick "Enforce HTTPS" once the certificate is ready.
4. At your domain registrar add DNS records:
   - `A` records for `kuititon.com` → 185.199.108.153, 185.199.109.153, 185.199.110.153, 185.199.111.153
   - `CNAME` record for `www` → `<your-github-username>.github.io`

## When the app is live
Set `APP_URL` at the top of `assets/site.js`. The App page then shows an "Open the app" button instead of "Opening soon".
