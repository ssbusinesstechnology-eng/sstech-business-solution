# Roadmap

## SEO
- [x] Per-route titles, descriptions, OG/Twitter, canonical
- [x] sitemap.xml + robots.txt
- [x] Google Search Console verified, sitemap submitted
- [x] Church poster landing page (/church-poster-design)

## Routes
- [x] /, /solutions, /services, /portfolio, /about, /contact, /admin
- [x] Shared header/footer on every page

## WhatsApp flows
- [x] Service cards, tier buttons, poster rows, portfolio items, contact form, quote builder

## Quote builder
- [x] Package + add-on selector with live estimated total and WhatsApp send

## Admin
- [x] Sign-in, upload with caption/category/tags, publish/hide, delete
- [x] Public portfolio grid reads from database
- [x] Enquiries panel: quote requests + contact leads with status updates

## Backend hardening
- [x] Roles extended (admin/manager/staff/content_manager), role checks in private schema
- [x] quote_requests + contact_leads tables with RLS (staff read/update)
- [x] Server-side quote totals (never trusted from the browser)
- [x] Upload validation: image types only, 10MB cap on the storage bucket

## Pending
- [ ] Publish so the new pages and metadata reach the live address
