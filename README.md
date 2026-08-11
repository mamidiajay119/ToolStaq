# ToolStaq — AI Tools Directory

A modern Next.js 16 application that serves a curated directory of 2,689+ AI tools with filtering, live search, side-by-side comparison, newsletter subscription, and an automated AI News section.

## Features

- **Supabase Backend**: Fully database-driven application displaying thousands of AI tools.
- **Client-Side Optimization**: Instant client-side search, filtering, and pagination.
- **Category Browsing**: Detailed category breakdown for all tools.
- **Comparison Engine**: Side-by-side comparison of pricing models, feature sets, and target audiences.
- **AI News Hub**: Auto-syncing news section powered by Currents API with automatic old article purging.
- **Newsletter Subscription**: Newsletter subscription system integrated with Resend.

---

## Getting Started

### 1. Clone & Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root containing the following services credentials:

```ini
# Currents API (Weekly News Sync)
# Register at: https://currentsapi.services/
CURRENTS_API_KEY=your_currents_api_key

# Resend Mailer (Newsletter Subscriptions)
# Register at: https://resend.com/
RESEND_API_KEY=your_resend_api_key
RESEND_AUDIENCE_ID=your_resend_audience_id

# Supabase (Database Backend)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 3. Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000).

---

## Build and Production

To build the static site and run in production:

```bash
npm run build     # Compiles Next.js pages and statically syncs latest news
npm run start     # Starts production server
npm run lint      # Runs ESLint code check
```

---

## News Auto-Sync & Purge

The AI News section automatically synchronizes itself during page build/request:
- Fetches new articles under relevant AI categories from the Currents API.
- Cleans and formats the raw feed.
- De-duplicates slugs and updates the Supabase database.
- Automatically purges news articles older than **1 month** to keep the feed current.

---

## Project Structure

```
src/
  app/              # Next.js App Router (pages and layouts)
    news/           # AI News and Changelog
    tools/          # Tools archive list & dynamic detail pages (/tools/[slug])
    categories/     # All tool categories listing
    category/       # Filtered category dynamic views
    compare/        # Interactive side-by-side comparison tool
  components/       # React components (Layout, UI, tools card, upvotes, etc.)
  lib/              # Data access layers (Supabase, Resend, currents news)
  types/            # Shared TypeScript type definitions
```
