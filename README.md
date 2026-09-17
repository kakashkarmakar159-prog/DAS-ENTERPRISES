# DAS ENTERPRISES — GitHub Pages Full Static Build

## What this build contains
- Customer home, categories, product details, cart, checkout, success, tracking, orders, wishlist and account.
- Admin dashboard, products CRUD, orders/status, customers, offers, banners, reviews, reports and settings.
- Customer/Admin share the same browser `localStorage` state, so an order placed on the customer side appears in Admin → Orders and an Admin status change appears in Customer → Track Order.
- All CSS/JS/image URLs are relative so the project works under a GitHub Pages project URL such as `/DAS-ENTERPRISES/`.
- No admin password is embedded in frontend code. For a public production admin, connect Supabase Auth + RLS.

## GitHub Pages deployment
1. Extract this ZIP.
2. Upload the CONTENTS of this folder to the ROOT of the `DAS-ENTERPRISES` repository.
3. Confirm `index.html` is directly in the repository root.
4. GitHub → Settings → Pages → Deploy from a branch → `main` → `/ (root)` → Save.
5. Open `https://<username>.github.io/DAS-ENTERPRISES/`.
6. Admin UI: `https://<username>.github.io/DAS-ENTERPRISES/admin/`

## Important limitation
GitHub Pages is static hosting. The browser-local database is only a working demo and is not shared between different customers/devices. For real e-commerce data, replace the localStorage adapter with Supabase Database + Auth + Storage + Row Level Security.

Never put a Supabase service-role/secret key in this repository.
