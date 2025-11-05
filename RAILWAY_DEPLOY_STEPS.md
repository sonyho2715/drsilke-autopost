# Deploy to Railway - Dashboard Method (Easiest!)

## 🚀 Quick Deployment (5 minutes)

Railway dashboard is already open for you!

### Step 1: Create New Project (1 min)

1. **In Railway Dashboard** (already open)
2. Click **"New Project"** button
3. Choose **"Deploy from GitHub repo"**
4. Select **"sonyho2715/drsilke-autopost"**
5. Click **"Deploy Now"**

Railway will automatically:
- ✅ Detect it's a Next.js app
- ✅ Run `npm install`
- ✅ Run `npm run build`
- ✅ Deploy your app

### Step 2: Add PostgreSQL Database (1 min)

1. **In your new Railway project**
2. Click **"New"** button (or **"+ New Service"**)
3. Select **"Database"** → **"Add PostgreSQL"**
4. Railway will automatically:
   - ✅ Create PostgreSQL database
   - ✅ Set `DATABASE_URL` environment variable
   - ✅ Connect it to your app

### Step 3: Add Environment Variables (2 min)

1. Click on your **drsilke-autopost service** (not the database)
2. Go to **"Variables"** tab
3. Click **"+ New Variable"**
4. Add these variables (one by one):

```
OPENAI_API_KEY
your-actual-openai-key-from-local-env-file

FACEBOOK_PAGE_ACCESS_TOKEN
your-actual-facebook-token-from-local-env-file

FACEBOOK_PAGE_ID
701016076625177

CRON_SECRET
drsilke-secure-cron-secret-2024-prod

BUSINESS_NAME
Dr. Silke Vogelmann-Sine, Ph.D.

BUSINESS_URL
https://www.silke.com

BUSINESS_TYPE
Mental Health / Psychology

BUSINESS_LOCATION
Honolulu, Hawaii
```

**Note**: DATABASE_URL is automatically set by Railway when you added PostgreSQL!

### Step 4: Redeploy (30 seconds)

After adding all variables:
1. Click **"Deployments"** tab
2. Click **"Deploy"** button (or it will auto-deploy)
3. Wait for deployment to complete (~2-3 minutes)

### Step 5: Get Your Public URL

1. Click **"Settings"** tab
2. Under **"Environment"** → **"Domains"**
3. Click **"Generate Domain"**
4. Copy your Railway URL: `https://drsilke-autopost.up.railway.app`

### Step 6: Test Your Deployment

1. Visit your Railway URL
2. You should see the Dr. Silke dashboard!
3. Try generating a test post

## 🎉 That's It!

Your app is now:
- ✅ Deployed on Railway
- ✅ Using PostgreSQL database
- ✅ Running 24/7
- ✅ Ready to auto-post

## Automated Posting

Railway will use the cron job configuration (if you set it up), or you can use Railway's built-in Cron Jobs:

1. In Railway dashboard → Your service
2. Click **"Settings"**
3. Scroll to **"Cron Schedule"**
4. Add: `0 10 * * 1,3,5,6` (Mon, Wed, Fri, Sat at 10 AM)

## View Logs

To see what's happening:
1. Click **"Deployments"** tab
2. Click on latest deployment
3. View **"Build Logs"** and **"Deploy Logs"**

Or via CLI:
```bash
railway logs
```

## Troubleshooting

### Build Failed?
- Check build logs
- Make sure all dependencies are in package.json
- Verify Node.js version compatibility

### Database Connection Error?
- Make sure PostgreSQL service is added
- Verify DATABASE_URL is set
- Check that both services are in same project

### Environment Variables Missing?
- Go to Variables tab
- Make sure all required variables are set
- Redeploy after adding variables

## Railway vs Vercel

**Railway Advantages:**
✅ Built-in PostgreSQL database
✅ Simpler setup (fewer steps)
✅ Traditional hosting (not serverless)
✅ Better for background jobs

**Vercel Advantages:**
✅ Better for static/serverless
✅ Edge network (faster globally)
✅ More generous free tier

## Production URL

After deployment, your app will be at:
```
https://drsilke-autopost.up.railway.app
```

(Or your custom domain if you configure one)

## Next Steps

1. Set up custom domain (optional)
2. Monitor logs for any errors
3. Test automated posting
4. Set up alerts/monitoring

🎊 Congratulations! Your Dr. Silke auto-post system is now live on Railway!
