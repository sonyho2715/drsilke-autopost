# Quick Setup Guide for Dr. Silke Auto-Post

## What You Need

1. **OpenAI API Key** - For generating posts and images
2. **Facebook Page Access Token** - For posting to Facebook
3. **Facebook Page ID** - Your page's ID

## Step-by-Step Setup

### 1. Get OpenAI API Key

1. Go to https://platform.openai.com/api-keys
2. Sign up or log in
3. Create a new API key
4. Copy the key

### 2. Get Facebook Credentials

#### Get Page Access Token:

1. Go to https://developers.facebook.com/
2. Create an app (if you don't have one)
3. Add "Facebook Login" product
4. Go to Graph API Explorer: https://developers.facebook.com/tools/explorer/
5. Select your app from the dropdown
6. Click "Get Token" → "Get User Access Token"
7. Grant permissions: `pages_manage_posts`, `pages_read_engagement`
8. Use the Access Token Tool to get a long-lived token:
   - Go to https://developers.facebook.com/tools/debug/accesstoken/
   - Paste your token and click "Debug"
   - Click "Extend Access Token"
   - Copy the new long-lived token

#### Get Page ID:

1. Go to your Facebook page
2. Click "About"
3. Scroll to find "Page ID" or
4. Use Graph API Explorer: `me/accounts` to list your pages

### 3. Configure Environment Variables

Open `.env` file in the project and add your keys:

```env
OPENAI_API_KEY="sk-your-actual-openai-key-here"
FACEBOOK_PAGE_ACCESS_TOKEN="your-long-lived-page-access-token"
FACEBOOK_PAGE_ID="your-page-id-number"
CRON_SECRET="change-this-to-random-string-123"
```

### 4. Run the Application

```bash
# Make sure you're in the project directory
cd ~/drsilke-autopost

# Start the development server
npm run dev
```

### 5. Open Dashboard

Open your browser and go to: http://localhost:3000

## Using the Dashboard

### Generate a Single Post

1. Click "Generate New Post" button
2. Wait for AI to create content and image (may take 30-60 seconds)
3. Post will be automatically scheduled for the next posting day

### Schedule Posts for the Week

1. Click "Schedule Week (Mon, Wed, Fri, Sat)" button
2. System will generate posts for all upcoming posting days
3. Each post will be created with unique content and image

### Publish Manually

1. Find a draft or scheduled post in the list
2. Click "Publish Now" to post immediately to Facebook
3. Status will change to "posted" after successful publication

### Delete Posts

1. Click "Delete" button on any draft or scheduled post
2. Confirm deletion

## Automated Posting

When deployed to Vercel:
- Posts automatically publish on Mon, Wed, Fri, Sat at 10:00 AM
- No manual intervention needed
- System checks for scheduled posts and publishes them

## Deployment to Vercel

1. Create GitHub repository and push your code
2. Go to https://vercel.com
3. Import your repository
4. Add environment variables in Vercel dashboard:
   - `OPENAI_API_KEY`
   - `FACEBOOK_PAGE_ACCESS_TOKEN`
   - `FACEBOOK_PAGE_ID`
   - `CRON_SECRET`
   - `DATABASE_URL` (use "file:./dev.db" or upgrade to Vercel Postgres)
5. Deploy

## Troubleshooting

### "No posts showing"
- Check that API keys are correctly set in `.env`
- Look at browser console (F12) for errors

### "Image generation failed"
- Verify OpenAI API key has credits
- Check if DALL-E 3 is available for your account

### "Facebook posting failed"
- Ensure Page Access Token is long-lived
- Verify token has correct permissions
- Check Page ID is correct
- Token may need to be refreshed every 60 days

## Support

For issues, check the main README.md or contact the developer.

## Posting Schedule

Current schedule (configurable in `lib/scheduler.ts`):
- **Monday**: 10:00 AM
- **Wednesday**: 10:00 AM
- **Friday**: 10:00 AM
- **Saturday**: 10:00 AM

All times are in your server's timezone.
