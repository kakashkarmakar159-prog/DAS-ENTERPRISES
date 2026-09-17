# Supabase production connection plan

The static build is intentionally Supabase-ready but does not contain any Supabase project URL or secret key.

Recommended production architecture:

Customer browser → Supabase Auth → PostgreSQL tables (`products`, `orders`, `order_items`, `profiles`, `addresses`, `wishlists`, `coupons`, `banners`, `reviews`) → Storage for product/banner images.

Admin browser → Supabase Auth (admin user) → RLS-protected admin operations.

Never put the Supabase `service_role`/secret key in GitHub Pages or browser JavaScript.

The public/publishable key can be used in browser code together with properly configured RLS policies.
