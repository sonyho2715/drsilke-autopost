# Deploy to Vercel & Railway - Quick Guide

## Prerequisites ✅

- ✅ Code pushed to GitHub: https://github.com/sonyho2715/drsilke-autopost
- ✅ Facebook token valid until Feb 3, 2026
- ✅ Local development working

## Step 1: Create Neon Database (2 minutes)

I've opened Neon for you: https://neon.tech

1. **Sign in** (or create account)
2. Click **"Create Project"**
3. Project name: `drsilke-autopost`
4. Region: Choose closest to your users (US East recommended)
5. Click **"Create Project"**
6. **Copy the Connection String** - looks like:
   ```
   postgresql://username:password@ep-xxx.us-east-2.aws.neon.tech/neondb?sslmode=require
   ```

## Step 2: Deploy to Vercel (5 minutes)

I've opened Vercel dashboard for you: https://vercel.com/dashboard

### Add Environment Variables to Vercel:

1. Go to your **drsilke-autopost** project
2. Click **"Settings"** → **"Environment Variables"**
3. Add these variables:

```bash
# Database - Use your Neon connection string from Step 1
DATABASE_URL
postgresql://YOUR_NEON_CONNECTION_STRING_HERE

# OpenAI
OPENAI_API_KEY
your-openai-api-key-here (starts with sk-proj-)

# Facebook
FACEBOOK_PAGE_ACCESS_TOKEN
your-facebook-page-access-token-here (starts with EAAL)

FACEBOOK_PAGE_ID
701016076625177

# Security - Generate a random string or use this one
CRON_SECRET
drsilke-secure-cron-secret-2024-prod

# Business Info
BUSINESS_NAME
Dr. Silke Vogelmann-Sine, Ph.D.

BUSINESS_URL
https://www.silke.com

BUSINESS_TYPE
Mental Health / Psychology

BUSINESS_LOCATION
Honolulu, Hawaii
```

### Trigger Deployment:

After adding environment variables:

**Option A: Through Dashboard**
1. Go to **"Deployments"** tab
2. Click **"Redeploy"** on the latest deployment

**Option B: Through Git** (Recommended)
```bash
# Just push any small change
git commit --allow-empty -m "Trigger Vercel deployment with new env vars"
git push origin main
```

## Step 3: Verify Vercel Deployment

1. Wait for deployment to complete (~2-3 minutes)
2. Visit your Vercel URL (will be like: `https://drsilke-autopost.vercel.app`)
3. You should see the dashboard!
4. Try generating a post to test

## Step 4: Deploy to Railway (Optional, 5 minutes)

Railway is an alternative to Vercel with simpler setup:

### Install Railway CLI
```bash
npm i -g @railway/cli
```

### Login and Deploy
```bash
# Login to Railway
railway login

# Initialize project (if not linked)
railway init

# Add Postgres service
railway add --postgres

# This automatically creates DATABASE_URL

# Deploy
railway up
```

### Add Other Environment Variables in Railway:

1. Go to https://railway.app/dashboard
2. Select your project
3. Click on your service
4. Go to **"Variables"** tab
5. Add the same environment variables as Vercel (except DATABASE_URL which is automatic)

## Automated Posting Schedule

Once deployed, posts will automatically publish on:
- **Monday** at 10:00 AM
- **Wednesday** at 10:00 AM
- **Friday** at 10:00 AM
- **Saturday** at 10:00 AM

Configured in `vercel.json` (for Vercel cron jobs).

## Troubleshooting

### Deployment Fails with "Cannot find module '@prisma/client'"

Run this command to trigger a fresh build:
```bash
git commit --allow-empty -m "Rebuild Prisma client"
git push origin main
```

### Database Connection Error

- Make sure DATABASE_URL is correct
- Check that Neon database is running
- Verify connection string includes `?sslmode=require`

### Facebook Posts Not Publishing

- Check Facebook token hasn't expired (valid until Feb 3, 2026)
- Verify CRON_SECRET is set correctly
- Check deployment logs for errors

## Check Deployment Status

### Vercel
```bash
vercel ls
```

### Railway
```bash
railway status
```

## View Logs

### Vercel
- Dashboard → Deployments → Click deployment → "Runtime Logs"

### Railway
```bash
railway logs
```

## Production URLs

After deployment, your app will be available at:
- **Vercel**: `https://drsilke-autopost.vercel.app` (or custom domain)
- **Railway**: `https://drsilke-autopost.up.railway.app`

## Dashboard Access

Visit your production URL to:
- View scheduled posts
- Generate new posts
- Publish posts manually
- Monitor posting status

## Security Notes

✅ Never commit `.env` file to Git
✅ Rotate Facebook token before it expires (Feb 3, 2026)
✅ Keep CRON_SECRET secure
✅ Use HTTPS only (automatic on Vercel/Railway)

## Need Help?

If you encounter issues:
1. Check deployment logs
2. Verify all environment variables are set
3. Ensure database is accessible
4. Test Facebook token with: `node verify-facebook-token.js`

---

🎉 Once deployed, your Dr. Silke auto-post system will run 24/7 automatically!
