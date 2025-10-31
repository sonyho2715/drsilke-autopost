# Railway Database Setup Guide

Since Railway CLI requires interactive input, follow these steps to set up your PostgreSQL database via the Railway dashboard:

## Step 1: Create New Project on Railway

1. Go to https://railway.app/dashboard
2. Click **"New Project"**
3. Select **"Provision PostgreSQL"**
4. Railway will create a new PostgreSQL database

## Step 2: Get Database Connection String

1. In your Railway project, click on the **PostgreSQL** service
2. Go to the **"Variables"** tab
3. Find and copy the **DATABASE_URL** value
   - It will look like: `postgresql://postgres:password@host:port/railway`

## Step 3: Add Database URL to Vercel

Run this command in your terminal (replace with your actual DATABASE_URL from Railway):

```bash
cd ~/drsilke-autopost

# Add DATABASE_URL to Vercel production
vercel env add DATABASE_URL production
# When prompted, paste the Railway DATABASE_URL
```

## Step 4: Run Database Migrations

After adding the DATABASE_URL to Vercel, run the Prisma migration:

```bash
# Pull the environment variables from Vercel
vercel env pull .env.production

# Run the migration using the DATABASE_URL
npx prisma migrate deploy
```

Or manually set the DATABASE_URL and run migration:

```bash
# Replace with your actual Railway DATABASE_URL
export DATABASE_URL="postgresql://postgres:password@host:port/railway"

# Generate Prisma client
npx prisma generate

# Run migration
npx prisma migrate deploy

# Verify with Prisma Studio (optional)
npx prisma studio
```

## Step 5: Redeploy Vercel

After setting up the database, trigger a new deployment:

```bash
vercel --prod
```

Or simply push a commit to GitHub (which will auto-deploy):

```bash
git add railway.json RAILWAY_SETUP.md
git commit -m "Add Railway configuration"
git push
```

## Step 6: Verify Database Connection

1. Visit your Vercel app: https://drsilke-autopost-sony-hos-projects.vercel.app
2. Try to generate a post
3. Check if posts are being saved to the database

## Alternative: Quick Setup via Railway CLI

If you want to set up Railway via CLI later, here's a script:

```bash
# This requires interactive terminal, won't work in non-interactive mode
railway login
railway init
railway add --database postgres
railway up
```

## Railway Project Configuration

A `railway.json` file has been created with the following settings:
- Builder: NIXPACKS (auto-detects Node.js)
- Start command: `npm start`
- Restart policy: ON_FAILURE with max 10 retries

## Optional: Deploy App to Railway (Backup to Vercel)

If you want to also deploy the app to Railway as a backup:

1. In Railway dashboard, click **"New"** → **"GitHub Repo"**
2. Connect to `sonyho2715/drsilke-autopost`
3. Railway will detect it's a Next.js app and configure automatically
4. Add all environment variables (same as Vercel)
5. Railway will deploy the app

However, **Vercel is better for Next.js apps** due to:
- Better Next.js optimization
- Built-in cron jobs (Railway needs separate cron service)
- Edge network for faster loading
- Free SSL and domains

So I recommend:
- **Railway**: PostgreSQL database only
- **Vercel**: Host the Next.js application (current setup)

## Summary

Your setup will be:
- ✅ **GitHub**: Source code repository
- ✅ **Vercel**: Next.js app hosting + Cron jobs
- 🔄 **Railway**: PostgreSQL database (in progress)

This is a great architecture because:
- Railway provides reliable PostgreSQL with backups
- Vercel handles the app with automatic scaling
- Both have free tiers that work for this project
- Database can be accessed from both Vercel and locally

## Troubleshooting

### Can't connect to database
- Verify DATABASE_URL is correctly formatted
- Check Railway database is running (green status)
- Ensure IP whitelist allows connections (Railway allows all by default)

### Migration fails
- Make sure DATABASE_URL uses `postgresql://` not `postgres://`
- Check database is empty or compatible with schema
- Try running `npx prisma db push` instead of migrate

### Vercel still shows errors
- Verify environment variables are set in Vercel dashboard
- Check if latest deployment has DATABASE_URL
- Try manual redeploy: `vercel --prod --force`

## Next Steps

1. Create PostgreSQL database on Railway (Step 1-2 above)
2. Copy the DATABASE_URL
3. Add to Vercel (Step 3)
4. Run migrations (Step 4)
5. Test the application!

Once complete, your auto-posting system will be fully operational! 🚀
