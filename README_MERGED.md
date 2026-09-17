# DAS ENTERPRISES — Merged Customer Website

This package uses a single standalone `index.html` for the customer-facing website.

## What is included
- Customer storefront and responsive UI
- Home, categories, product details, cart, checkout, success and order tracking
- Wishlist, account, order history, offers/coupons, reviews
- Dark/light theme
- URL-based jewellery/logo images
- Supabase REST/RPC integration hooks in `index.html`
- Database setup documentation in `SUPABASE_SETUP.md`

## Removed
No admin/login/dashboard front-end is included. Product, stock, offers, banners, reviews, settings and order management are intended to be controlled directly in the database.

## GitHub Pages
Upload the contents of this folder to the repository root. The only customer front-end entry point is `index.html`.

Before production, replace `YOUR_SUPABASE_URL` and `YOUR_SUPABASE_ANON_KEY` inside `index.html` with the Supabase project URL and publishable/anon key. Never put a Supabase service-role key in this file.
