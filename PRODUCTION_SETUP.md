# Production Deployment Setup

## Database for Production

**Important**: SQLite works great for local development, but for production (Vercel/Railway), you need PostgreSQL.

### Option 1: Neon (Recommended for Vercel) ✅

Neon is a serverless PostgreSQL database that's perfect for Vercel.

#### Steps:

1. **Create Neon Account**
   - Go to: https://neon.tech
   - Sign up (free tier available)
   - Create a new project: "drsilke-autopost"

2. **Get Database URL**
   - After creating project, copy the **Connection String**
   - It looks like: `postgresql://user:password@ep-xxx.us-east-2.aws.neon.tech/neondb`

3. **Update Prisma Schema for Production**
   - The schema is already set to use `env("DATABASE_URL")`
   - We'll use different URLs for dev vs production

4. **Set Environment Variables on Vercel**
   ```bash
   DATABASE_URL="postgresql://..." # Your Neon URL
   OPENAI_API_KEY="sk-proj-..."
   FACEBOOK_PAGE_ACCESS_TOKEN="EAALOlnj..."
   FACEBOOK_PAGE_ID="701016076625177"
   CRON_SECRET="your-secure-secret"
   ```

### Option 2: Vercel Postgres

1. Go to: https://vercel.com/dashboard
2. Select your drsilke-autopost project
3. Go to **Storage** tab
4. Click **"Create Database"** → **"Postgres"**
5. It will automatically set `DATABASE_URL` environment variable

### Option 3: Railway Postgres

Railway provides built-in PostgreSQL:

1. Create Railway account: https://railway.app
2. Create new project
3. Add PostgreSQL service
4. Railway will automatically provide `DATABASE_URL`

## Deployment Strategy

### Development (Local)
- Uses SQLite (`prisma/dev.db`)
- Fast and simple
- No external dependencies

### Production (Vercel/Railway)
- Uses PostgreSQL (Neon/Vercel Postgres/Railway Postgres)
- Scalable and reliable
- Serverless-friendly

## Deploy Command

After setting up the database:

### Deploy to Vercel
```bash
# With environment variables
vercel --prod

# Or through Vercel dashboard
# 1. Go to https://vercel.com/dashboard
# 2. Import GitHub repo
# 3. Add environment variables
# 4. Deploy
```

### Deploy to Railway
```bash
# Install Railway CLI
npm i -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up
```

## Environment Variables Needed

For both Vercel and Railway, set these environment variables:

```bash
# Database (Different for dev vs production)
DATABASE_URL="postgresql://..." # Neon/Vercel/Railway Postgres URL

# OpenAI
OPENAI_API_KEY="sk-proj-..."

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN="EAALOlnj..."
FACEBOOK_PAGE_ID="701016076625177"

# Security
CRON_SECRET="your-secure-random-secret"
```

## Prisma Schema - Already Configured!

Your current `prisma/schema.prisma` is flexible:

```prisma
datasource db {
  provider = "sqlite"      // Change to "postgresql" for production
  url      = env("DATABASE_URL")
}
```

We can have different schemas for dev vs prod, or use the same schema with different providers.

## Migration Strategy

### For Development
```bash
# Uses SQLite
npx prisma db push
```

### For Production (First Time)
```bash
# Set DATABASE_URL to your Neon/Vercel/Railway URL
DATABASE_URL="postgresql://..." npx prisma db push

# Or through Vercel/Railway deploy (automatic)
```

## Which Should You Choose?

### Choose Neon if:
- ✅ Deploying to Vercel
- ✅ Want serverless PostgreSQL
- ✅ Need free tier
- ✅ Want global edge network

### Choose Vercel Postgres if:
- ✅ Already using Vercel
- ✅ Want integrated solution
- ✅ Need automatic configuration

### Choose Railway if:
- ✅ Want both hosting and database in one place
- ✅ Prefer traditional infrastructure
- ✅ Need persistent storage
- ✅ Want easy deployment

## Next Steps

1. Choose your database provider (I recommend Neon for Vercel)
2. Create database and get connection URL
3. Update Prisma schema if needed
4. Set environment variables on Vercel/Railway
5. Deploy!

Let me know which option you prefer and I'll help you set it up!
