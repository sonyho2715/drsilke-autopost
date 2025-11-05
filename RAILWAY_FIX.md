# Fix Railway Deployment Error

## The Problem

Railway build is failing with:
```
Missing required environment variable: DATABASE_URL
```

## Why This Happens

Railway tries to build your app BEFORE the PostgreSQL database is added or connected.

## Solution (Do This Now!)

### ✅ Step 1: Add PostgreSQL Database

**In your Railway Dashboard** (you should see your drsilke-autopost project):

1. Look for a **"+ New"** or **"New Service"** button
2. Click it
3. Select **"Database"**
4. Choose **"PostgreSQL"**
5. Wait 30 seconds for it to provision

You should now see TWO services in your project:
- 🟦 drsilke-autopost (your app)
- 🟪 Postgres (your database)

### ✅ Step 2: Connect Database to App

Railway usually does this automatically, but let's verify:

1. Click on your **drsilke-autopost service** (not the database)
2. Go to **"Variables"** tab
3. Look for `DATABASE_URL` - it should appear automatically
4. If it's NOT there, Railway needs to connect them:
   - Go to service settings
   - Look for "Service Variables" or "Reference Variables"
   - Add reference to Postgres DATABASE_URL

### ✅ Step 3: Add Other Environment Variables

Still in the **Variables** tab of your app service:

Click **"Raw Editor"** and paste ALL of these:

```
OPENAI_API_KEY=your-openai-key-from-local-env-file
FACEBOOK_PAGE_ACCESS_TOKEN=your-facebook-token-from-local-env-file
FACEBOOK_PAGE_ID=701016076625177
CRON_SECRET=drsilke-secure-cron-secret-2024-prod
BUSINESS_NAME=Dr. Silke Vogelmann-Sine, Ph.D.
BUSINESS_URL=https://www.silke.com
BUSINESS_TYPE=Mental Health / Psychology
BUSINESS_LOCATION=Honolulu, Hawaii
```

**Note:** Copy the actual values from the `railway-env-vars.txt` file I opened in TextEdit!

Click **"Save"** or it saves automatically.

### ✅ Step 4: Trigger Redeploy

1. Go to **"Deployments"** tab
2. Click **"Redeploy"** or **"Deploy"**
3. Watch the logs - it should succeed this time!

## Alternative: Use Railway CLI

If the dashboard is confusing, you can also add PostgreSQL via CLI:

```bash
# This is currently disabled because Railway CLI needs interactive input
# But if you want to try in a real terminal:
# railway add --database postgres
```

## What Should Happen

After adding PostgreSQL:
- ✅ Railway automatically creates DATABASE_URL
- ✅ Build will have access to DATABASE_URL
- ✅ Prisma migrations will run
- ✅ App will deploy successfully

## Check Your Setup

In Railway dashboard, you should see:

**Services (2)**
- drsilke-autopost (Node.js app)
- Postgres (Database)

**Variables on drsilke-autopost service:**
- DATABASE_URL (auto-added by Postgres)
- OPENAI_API_KEY
- FACEBOOK_PAGE_ACCESS_TOKEN
- FACEBOOK_PAGE_ID
- CRON_SECRET
- BUSINESS_NAME
- BUSINESS_URL
- BUSINESS_TYPE
- BUSINESS_LOCATION

## Still Failing?

If you still get DATABASE_URL errors after adding PostgreSQL:

1. **Screenshot your Railway dashboard** showing both services
2. **Screenshot the Variables tab** of your app service
3. Share with me and I'll help debug

The most common issue is that the database hasn't been added yet, or the services aren't in the same project/environment.
