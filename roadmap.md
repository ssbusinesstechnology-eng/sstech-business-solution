# Roadmap

## SEO
- [x] Per-route titles, descriptions, OG/Twitter, canonical
- [x] sitemap.xml + robots.txt
- [x] Google Search Console verified, sitemap submitted
- [x] Church poster landing page (/church-poster-design)
- [x] Admin-only Search Console snapshots and on-demand AI recommendations
- [x] Correct production canonicals, social metadata, sitemap and robots URL

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
- [x] SEO Insights panel with live query/page data, caching and manual analysis

## Business operations dashboard
- [x] Tabs: Dashboard, Enquiries, Quotes, Customers, Projects, Services, Portfolio, Activity
- [x] Summary cards from real data only (zero/empty states when empty)
- [x] Lead + quote status, staff assignment, internal notes, save-as-customer (no duplicates)
- [x] Customer records linked to enquiries, quotes and projects
- [x] Projects with status, dates and assigned staff
- [x] Service catalogue with ordering and activate/deactivate
- [x] Activity log of status changes, assignments and portfolio actions
- [x] Verified end-to-end in the browser on desktop and mobile; test data removed

## Backend hardening
- [x] Roles extended (admin/manager/staff/content_manager), role checks in private schema
- [x] quote_requests + contact_leads tables with RLS (staff read/update)
- [x] Server-side quote totals (never trusted from the browser)
- [x] Upload validation: image types only, 10MB cap on the storage bucket
- [x] Published portfolio can be read publicly without evaluating staff-only permissions

## Portfolio samples
- [x] Four supplied poster designs added to the public showcase

## Pending
- [ ] Publish so the new pages and metadata reach the live address
