# ToolStaq — AI Tools Directory

A modern Next.js 16 application that serves a curated directory of 2,689+ AI tools with filtering, live search, side-by-side comparison, newsletter subscription, and an automated AI News section.

> [!CAUTION]
> **CRITICAL SECURITY & SECRET ROTATION WARNING**
> If any API keys, tokens, or credentials (e.g. Supabase Service Role Keys, Resend API Keys, Cron Secrets, or Currents API Keys) were ever committed or stored locally during development, **they may still exist in your Git commit history**.
> 
> **You MUST rotate all production secrets immediately before deploying to production:**
> 1. **Supabase**: Rotate `SUPABASE_SERVICE_ROLE_KEY` in the Supabase Dashboard under *Project Settings -> API*.
> 2. **Resend**: Revoke and generate a new `RESEND_API_KEY` in the Resend Dashboard under *API Keys*.
> 3. **Cron Secret**: Generate a new random token for `CRON_SECRET` using `openssl rand -hex 32`.
> 4. **Currents API**: Regenerate your `CURRENTS_API_KEY` under *Currents API Settings*.

---

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

Copy `.env.example` to `.env.local` and fill in your service credentials:

```bash
cp .env.example .env.local
```

```ini
# Supabase (Database Backend)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Resend Mailer (Newsletter Subscriptions)
RESEND_API_KEY=re_your_resend_api_key
RESEND_AUDIENCE_ID=your_resend_audience_id
RESEND_FROM_EMAIL=ToolStaq <newsletter@yourdomain.com>

# Cron Job Secret
CRON_SECRET=your_random_cron_secret_token

# Currents API (Weekly News Sync)
CURRENTS_API_KEY=your_currents_api_key
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
