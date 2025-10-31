# Deployment Guide for Dr. Silke Auto-Post System

## ✅ Completed Deployments

### GitHub Repository
- **URL**: https://github.com/sonyho2715/drsilke-autopost
- **Status**: ✅ Deployed and synced

### Vercel Deployment
- **Production URL**: https://drsilke-autopost-o7iln7wfw-sony-hos-projects.vercel.app
- **Status**: ✅ Deployed with auto-deploy from GitHub
- **Environment Variables**: ✅ All configured
- **Cron Jobs**: ✅ Configured (Mon, Wed, Fri, Sat at 10:00 AM)

## 🔧 Required: Database Setup

Since Vercel uses a read-only filesystem, you need to set up a PostgreSQL database. Here are the recommended options:

### Option 1: Vercel Postgres (Recommended)

1. Go to your Vercel project dashboard: https://vercel.com/sony-hos-projects/drsilke-autopost
2. Click on the "Storage" tab
3. Click "Create Database" and select "Postgres"
4. Follow the setup wizard
5. Vercel will automatically add the `DATABASE_URL` environment variable
6. Redeploy the application to apply the database connection

### Option 2: Neon (Free PostgreSQL)

1. Go to https://neon.tech and sign up
2. Create a new project
3. Copy the connection string
4. Add to Vercel environment variables:
   ```bash
   vercel env add DATABASE_URL production
   # Paste the Neon connection string when prompted
   ```
5. Redeploy: `vercel --prod`

### Option 3: Supabase (Free PostgreSQL)

1. Go to https://supabase.com and create a project
2. Go to Settings > Database
3. Copy the connection string (use "Transaction" pooler)
4. Add to Vercel:
   ```bash
   vercel env add DATABASE_URL production
   # Paste the Supabase connection string
   ```
5. Redeploy: `vercel --prod`

## 📊 Database Migration

After setting up the database, you need to run Prisma migrations:

1. Pull the environment variables locally:
   ```bash
   vercel env pull .env.production
   ```

2. Run the migration against production database:
   ```bash
   DATABASE_URL="your-postgres-url" npx prisma migrate dev --name init
   ```

Or use Prisma Studio to verify the connection:
   ```bash
   DATABASE_URL="your-postgres-url" npx prisma studio
   ```

## 🤖 Automatic Posting Configuration

The cron job is already configured in `vercel.json`:
- **Schedule**: Monday, Wednesday, Friday, Saturday at 10:00 AM (Hawaii time)
- **Endpoint**: `/api/cron/post`
- **Authentication**: Uses `CRON_SECRET` environment variable

### How It Works

1. Vercel Cron triggers `/api/cron/post` on schedule
2. The endpoint checks for scheduled posts in the database
3. For each scheduled post:
   - Generates AI content using GPT-4o
   - Generates AI image using DALL-E 3
   - Posts to Facebook with image (falls back to text-only if image fails)
4. Updates post status to "posted" or "failed"

### Testing the Cron Job

To manually trigger a post (for testing):

1. Go to your dashboard: https://drsilke-autopost-o7iln7wfw-sony-hos-projects.vercel.app
2. Click "Generate New Post" to create a test post
3. Click "Publish Now" to immediately post to Facebook

Or use the API directly:
```bash
curl -X POST https://drsilke-autopost-o7iln7wfw-sony-hos-projects.vercel.app/api/posts/generate \
  -H "Content-Type: application/json" \
  -d '{"autoSchedule": true}'
```

## 📝 Environment Variables Summary

All environment variables are configured in Vercel:

- ✅ `OPENAI_API_KEY` - GPT-4o for content generation
- ✅ `FACEBOOK_PAGE_ACCESS_TOKEN` - Facebook API access
- ✅ `FACEBOOK_PAGE_ID` - Your Facebook page
- ✅ `BUSINESS_NAME` - Dr. Silke Vogelmann-Sine, Ph.D.
- ✅ `BUSINESS_URL` - https://www.silke.com
- ✅ `BUSINESS_TYPE` - Mental Health / Psychology
- ✅ `BUSINESS_LOCATION` - Honolulu, Hawaii
- ✅ `CRON_SECRET` - Secure random key for cron authentication
- ✅ `BASE_URL` - Production URL
- ⚠️  `DATABASE_URL` - **NEEDS TO BE CONFIGURED** (see Database Setup above)

## 🚀 Next Steps

1. **Set up PostgreSQL database** (see Database Setup section above)
2. **Run database migrations** to create tables
3. **Test the system**:
   - Visit the dashboard
   - Generate a test post
   - Publish manually to verify Facebook integration works
4. **Monitor cron jobs**: Check Vercel logs to ensure automatic posting works

## 📱 Accessing the Dashboard

- **Production Dashboard**: https://drsilke-autopost-o7iln7wfw-sony-hos-projects.vercel.app
- Features:
  - Generate new posts
  - Schedule week of posts (Mon, Wed, Fri, Sat)
  - View all posts with status
  - Retry failed posts
  - Delete draft posts
  - See error messages for failed posts

## 🔍 Monitoring and Logs

View deployment logs:
```bash
vercel logs drsilke-autopost-o7iln7wfw-sony-hos-projects.vercel.app
```

Or visit the Vercel dashboard: https://vercel.com/sony-hos-projects/drsilke-autopost

## ⚙️ Updating the Application

Since GitHub is connected to Vercel, any push to the `main` branch will automatically trigger a new deployment:

```bash
# Make changes
git add .
git commit -m "Your changes"
git push

# Vercel will automatically deploy
```

## 🔐 Security Notes

- The `CRON_SECRET` is used to authenticate cron requests
- Facebook access token is stored securely in Vercel environment variables
- OpenAI API key is also stored securely
- Never commit `.env` files to Git (already in `.gitignore`)

## 🎯 Content Strategy

The system automatically rotates through 8 different post types:
1. Educational Tips
2. Myth-Busting
3. Self-Care Practices
4. Therapeutic Insights
5. Relatable Scenarios
6. Encouragement
7. Service Highlights
8. Professional Guidance

Posts are:
- 100-150 words
- NO hashtags (as requested)
- Professional, warm, and compassionate tone
- Include AI-generated calming images (no text in images)
- Posted Mon, Wed, Fri, Sat at 10 AM

## ❓ Troubleshooting

### Posts not appearing on Facebook
- Check Facebook access token is valid (they expire)
- Verify `pages_manage_posts` or `CREATE_CONTENT` permission is enabled
- Check Vercel logs for error messages

### Database connection errors
- Ensure `DATABASE_URL` is set in Vercel environment variables
- Verify the PostgreSQL database is accessible from Vercel
- Check database credentials are correct

### Cron jobs not running
- Verify you're on a Vercel plan that supports cron (Hobby plan includes it)
- Check Vercel logs for cron execution
- Ensure `CRON_SECRET` environment variable matches

## 📞 Support

For issues or questions:
- GitHub Issues: https://github.com/sonyho2715/drsilke-autopost/issues
- Vercel Dashboard: https://vercel.com/sony-hos-projects/drsilke-autopost
