# Update Facebook Access Token

## Quick Steps to Get a New Token

### Step 1: Ensure You're Added to the App
1. Go to https://developers.facebook.com/apps
2. Select your app
3. Go to **Roles** → Add yourself as **Administrator** or **Developer**

### Step 2: Generate Token with Correct Permissions
1. Go to **Graph API Explorer**: https://developers.facebook.com/tools/explorer/
2. Select your app from dropdown
3. Click **"Generate Access Token"**
4. Select these permissions:
   - `pages_show_list`
   - `pages_read_engagement`
   - `pages_manage_posts` ← CRITICAL
   - `pages_read_user_content`
   - `business_management` (optional)
5. Click **"Generate Access Token"** and **allow all permissions**

### Step 3: Get Your Page Access Token

Copy the token from Graph API Explorer, then visit this URL in your browser:

Replace `YOUR_USER_TOKEN` with the token you just generated:

```
https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_USER_TOKEN
```

You'll see JSON like this:

```json
{
  "data": [
    {
      "access_token": "EAAxxxxxxxxxxxx...",
      "category": "Health/Beauty",
      "name": "Dr. Silke Vogelmann-Sine",
      "id": "701016076625177",
      "tasks": ["ANALYZE", "ADVERTISE", "MODERATE", "CREATE_CONTENT", "MANAGE"]
    }
  ]
}
```

### Step 4: Verify Your Token Has the Right Permissions

Copy the `access_token` from the response above, then test it here:

```
https://graph.facebook.com/v18.0/me/permissions?access_token=YOUR_PAGE_TOKEN
```

You should see `pages_manage_posts` with `"status": "granted"`

### Step 5: Update Your .env File

Once you have your new Page Access Token, update it in your `.env` file:

```bash
FACEBOOK_PAGE_ACCESS_TOKEN="YOUR_NEW_PAGE_TOKEN"
FACEBOOK_PAGE_ID="701016076625177"
```

### Step 6: Test Posting

After updating the token, restart your dev server and try publishing a post!

## Troubleshooting

### Still Getting Permission Errors?

1. **Make sure your Facebook Page is published** (not in draft mode)
2. **Verify you're an admin of the page** - Go to your page settings
3. **Check if the app has access to your page**:
   - Go to Page Settings → Apps and Tabs
   - Make sure your app is listed and has permission
4. **Your token might have expired** - Tokens expire after 60 days

### Need a Never-Expiring Token?

Use **System Users** in Meta Business Suite:

1. Go to https://business.facebook.com/settings/system-users
2. Create or select a System User
3. Assign your page to this system user
4. Generate token with `pages_manage_posts` permission
5. Set expiration to **"Never"**
6. This is the best option for production!

## Testing Your Setup

Run this curl command to test your token:

```bash
curl -X POST "https://graph.facebook.com/v18.0/701016076625177/feed" \
  -d "message=Test post from command line" \
  -d "access_token=YOUR_PAGE_TOKEN"
```

If this works, your token is good!
