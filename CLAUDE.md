# Dr. Silke Autopost

## Project Overview
Automated social media posting system for Dr. Silke. Scrapes content, generates posts, and publishes to Facebook.

## Tech Stack
- **Framework:** Next.js 16 (App Router)
- **Database:** PostgreSQL on Railway + Prisma
- **Scraping:** Cheerio
- **Social:** Facebook Business SDK
- **Scheduling:** node-cron
- **Monitoring:** Sentry

## Key Features
- Content scraping with Cheerio
- Automated Facebook posting
- Scheduled posts with node-cron
- Error monitoring with Sentry

## Database Commands
```bash
npm run db:generate   # After schema changes
npm run db:push       # Push to database
```

## Build/Deploy Scripts
```json
"build": "prisma generate && next build",
"start": "prisma migrate deploy && next start"
```

## Environment Variables
- `DATABASE_URL` - Railway PostgreSQL
- `FACEBOOK_ACCESS_TOKEN` - Facebook page token
- `FACEBOOK_PAGE_ID` - Target page
- `SENTRY_DSN` - Error monitoring

## Cron Jobs
Uses node-cron for scheduled tasks. Jobs defined in the codebase.

## Deployment
- **Hosting:** Vercel
- **Database:** Railway PostgreSQL
- Migrations run on start

## Notes
- Automated content pipeline
- Facebook tokens need periodic refresh
- Check Sentry for errors
