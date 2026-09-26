# Focused website and SEO intelligence update

## Scope
- Keep the current S&S name, logo, brown/gold visual texture, phone numbers, WhatsApp links, and Nairobi location unchanged.
- Change only the public contact email to `ssbusinesstechnology@gmail.com` everywhere it is displayed or used.
- Preserve the working quote builder, enquiry saving, CRM, portfolio upload limits, WhatsApp flows, and permissions.

## Google Search Console and AI recommendations
- Add an admin-only **SEO Insights** tab to the existing operations dashboard.
- Read verified Search Console properties at runtime, never hardcode a property, and support explicit selection if Google returns more than one match.
- Fetch query and page performance for a practical recent comparison period, showing clicks, impressions, CTR, position, and changes.
- Cache the latest snapshot in Lovable Cloud so page loads do not repeatedly call Google; admins can refresh it deliberately.
- Send the cached performance snapshot plus the website’s existing service/page context to Lovable AI using `openai/gpt-6-astra` with low reasoning.
- Return a concise, prioritized action list with impact, evidence, target page/query, and recommended change. Generate only on an admin click to control credit use, with no automatic repeated AI calls.
- Display safe, specific Google or AI error messages and stop on access, credit, or policy blocks rather than retrying wastefully.

## Website refinements
- Tighten the first screen and service messaging so technology, web development, business systems, branding, and Nairobi availability are immediately clear.
- Keep the established structure and visual identity; improve wording and hierarchy rather than redesigning the site.
- Add the supplied portfolio’s real poster examples to the public work showcase using optimized image assets and accurate categories/captions.
- Keep contact and WhatsApp actions obvious so any visitor can send a brief and receive a follow-up.

## Repairs and verification
- Fix the public portfolio permission error by separating public published-item access from staff-only access without widening write permissions.
- Correct stale production URLs in canonical metadata, Open Graph data, sitemap, and robots references to the current published address.
- Confirm every content page retains unique title, description, Open Graph, Twitter card, and canonical metadata.
- Validate the public website, portfolio, WhatsApp links, admin SEO flow, mobile layout, build output, and backend security.

## Technical details
- Add narrowly scoped database tables for Search Console snapshots, selected property, and generated recommendations, with explicit grants and staff-only row policies.
- Use authenticated server functions for Google and AI calls; credentials remain server-side.
- Use one streamed AI Gateway request per manual analysis and consume the result server-side before saving it.
- Record the connector/cache architecture in the project’s technical decisions file.
