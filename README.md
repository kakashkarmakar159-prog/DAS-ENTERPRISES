# DAS ENTERPRISES Jewellery Website

## Included
- Customer Home, Categories, Product Details, Cart, Checkout, Order Success, Tracking, Account and Wishlist.
- Responsive mobile layout.
- Dark/Light mode.
- Admin Login + Dashboard.
- Product add/edit/delete, Orders/status, Customers, Coupons, Banners, Reviews, Reports, Settings.
- Node.js + Express backend.
- JSON database in `data/db.json`.
- Locally generated JPG demo jewellery and banner assets.

## Run
Install Node.js 18+.
1. `npm install`
2. `npm start`
3. Open `http://localhost:3000`
4. Admin: `http://localhost:3000/admin/`

### Admin credentials
Username: `dasinterface1234`
Password: `das@1234`

The password is represented to the application as a salted scrypt hash; it is not embedded in the browser JavaScript. For production, keep the hash/salt in environment variables and never commit `.env`.

## Production notes
Replace the JSON database with MongoDB/PostgreSQL, add real customer authentication, payment gateway, HTTPS, rate limiting, CSRF protection, image object storage and notification services.
