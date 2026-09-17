# DAS ENTERPRISES — GitHub Pages Package

This folder is a **GitHub Pages-compatible static build** of the DAS ENTERPRISES jewellery site.

## What is fixed
- All CSS/JS/image URLs are relative (`./...`), so the site works from a repository URL such as `/DAS-ENTERPRISES/`.
- Customer side and Admin UI use the same browser `localStorage` database (`das_db_v2`) for a working demo.
- Customer orders created at Checkout appear immediately in **Admin → Orders** in the same browser.
- Admin order status changes are reflected in **Customer → Track Order** in the same browser.
- Product edits, stock changes, coupons and banners update the customer side in the same browser.
- All included JPG assets are copied into `assets/` and referenced with relative paths.

## GitHub Pages upload
Upload the **contents of this `github-pages` folder** to the repository root (or deploy this folder as the Pages source). Do not add an extra `github-pages` folder level unless your Pages configuration is set for it.

After publishing, open:
- Customer: `https://YOUR-USERNAME.github.io/DAS-ENTERPRISES/`
- Admin: `https://YOUR-USERNAME.github.io/DAS-ENTERPRISES/admin/`

## Admin demo login
The login verifier stores SHA-256 hashes rather than the password in plaintext. However, **GitHub Pages cannot provide secure server-side authentication**. The Admin login in this static package is therefore only a demo gate and is not suitable for production security.

For production, connect the project to **Supabase Auth + PostgreSQL + Row Level Security** and remove the client-side demo credential verifier.

## Important: static hosting limitation
GitHub Pages does not run Node/Express. Therefore the old `/api/...` backend cannot run on GitHub Pages. This package replaces those API calls with a browser-local demo data store so the UI can be tested end-to-end.

For a real store where customers on different devices share products/orders, use Supabase as the shared database/auth/storage layer (and Edge Functions/server-side code for privileged operations).

## Reset demo data
Open browser DevTools → Application/Storage → Local Storage and remove:
- `das_db_v2`
- `das_cart`
- `das_wish`
- `das_theme`

Then reload.
