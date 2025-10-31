# Facebook Integration Setup Guide

## Step 1: Create a Facebook App

1. Go to **Facebook Developers**: https://developers.facebook.com/
2. Click **"My Apps"** in the top right
3. Click **"Create App"**
4. Choose **"Business"** as app type
5. Fill in:
   - **App Name**: "Dr Silke Auto Post" (or any name)
   - **App Contact Email**: Your email
6. Click **"Create App"**

## Step 2: Add Facebook Login Product

1. In your app dashboard, find **"Add Products"** section
2. Find **"Facebook Login"** and click **"Set Up"**
3. Choose **"Web"** as platform
4. For Site URL, enter: `http://localhost:3005` (for now)
5. Click **"Save"** and **"Continue"**

## Step 3: Configure App Settings

1. Go to **Settings** → **Basic** (left sidebar)
2. Scroll down and click **"Add Platform"** → **"Website"**
3. Enter Site URL: `http://localhost:3005`
4. Save changes

## Step 4: Get Your Page Access Token

### Method 1: Using Graph API Explorer (Easiest)

1. Go to **Graph API Explorer**: https://developers.facebook.com/tools/explorer/
2. In the top right:
   - Select your app from dropdown
   - Click **"Generate Access Token"**
3. Grant permissions when prompted:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts`
   - `pages_manage_engagement`
4. You'll get a **User Access Token** - we need to convert this to a **Page Access Token**

### Method 2: Get Long-Lived Page Access Token

#### A. Get Long-Lived User Token:

1. Go to: https://developers.facebook.com/tools/accesstoken/
2. Find your app
3. Click **"Extend Access Token"**
4. Copy the extended token

#### B. Convert to Page Access Token:

Use this URL in your browser (replace YOUR_APP_ID, YOUR_APP_SECRET, and YOUR_EXTENDED_TOKEN):

```
https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_EXTENDED_TOKEN
```

This will return JSON with all your pages. Find your Dr. Silke page and copy the `access_token` value.

**This token will be valid for 60 days.**

### Alternative: Using Meta Business Suite

1. Go to **Business Settings**: https://business.facebook.com/settings/
2. Click **"System Users"** in the left menu
3. Create a system user or use existing
4. Assign your page to this system user
5. Generate a token with `pages_manage_posts` permission
6. This token can be set to never expire!

## Step 5: Get Your Page ID

### Method 1: From Facebook Page

1. Go to your Dr. Silke Facebook page
2. Click **"About"** tab
3. Scroll down to find **"Page ID"**
4. Copy the number

### Method 2: Using Graph API

1. Use the Graph API Explorer: https://developers.facebook.com/tools/explorer/
2. Enter: `me/accounts` in the query field
3. Click **Submit**
4. Find your page in the response and copy the `id` value

### Method 3: From Page URL

If your page URL is like: `facebook.com/DrSilkePageName`

1. Go to: `https://findmyfbid.com/`
2. Paste your page URL
3. Get the numeric ID

## Step 6: Test Your Credentials

Once you have both:
- **Page Access Token** (long string starting with `EAAG...`)
- **Page ID** (numeric, like `123456789012345`)

Test them using Graph API Explorer:

```
GET https://graph.facebook.com/v18.0/YOUR_PAGE_ID?access_token=YOUR_TOKEN
```

You should see your page information returned.

## Step 7: Add to .env File

I'll help you add these to the `.env` file once you have them!

## Important Notes

### Token Expiration
- Short-lived tokens: 1-2 hours
- Long-lived user tokens: 60 days
- Long-lived page tokens: 60 days (but can be refreshed)
- System user tokens: Can be set to never expire

### Required Permissions
Your token MUST have these permissions:
- `pages_show_list` - To list your pages
- `pages_read_engagement` - To read page data
- `pages_manage_posts` - To create posts
- `pages_manage_engagement` - To manage posts (optional)

### Security
- Never share your access token publicly
- Don't commit `.env` file to git
- Rotate tokens regularly
- Use system user tokens for production

## Troubleshooting

### Error: "Invalid OAuth access token"
- Token expired - generate a new one
- Wrong token - make sure it's a PAGE token, not USER token

### Error: "Permissions error"
- Token doesn't have required permissions
- Re-generate token with correct permissions

### Error: "Page not found"
- Wrong Page ID
- Token doesn't have access to this page
- Page is not published

## Need Help?

If you get stuck at any step, let me know and I can help troubleshoot!
