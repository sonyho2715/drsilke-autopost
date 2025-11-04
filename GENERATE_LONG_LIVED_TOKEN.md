# Generate Long-Lived Access Token (60+ Days)

I've created an automated script to generate a long-lived token for you!

## 🎯 Quick Guide (3 Steps)

### Step 1: Get Your App ID and App Secret

1. **Go to your Facebook App Dashboard**
   - Open: https://developers.facebook.com/apps/
   - Click on **"DrSilke"** app

2. **Get App ID and App Secret**
   - Click **"Settings" → "Basic"** in left sidebar
   - You'll see:
     - **App ID**: A number (e.g., 123456789)
     - **App Secret**: Click **"Show"** button to reveal it

3. **Add them to your .env file**
   ```bash
   FACEBOOK_APP_ID="your-app-id-here"
   FACEBOOK_APP_SECRET="your-app-secret-here"
   ```

### Step 2: Generate Short-Lived User Token

1. **Go to Graph API Explorer**
   - Open: https://developers.facebook.com/tools/explorer/

2. **Select Your App**
   - In the dropdown at top, select **"DrSilke"**

3. **Generate Token with Permissions**
   - Click **"Generate Access Token"** button
   - ✅ Check these permissions:
     - `pages_show_list`
     - `pages_read_engagement`
     - `pages_manage_posts` ← **CRITICAL**
     - `pages_read_user_content`
   - Click **"Generate Access Token"**
   - **Allow all permissions**

4. **Copy the Token**
   - You'll see a long token in the "Access Token" field
   - Copy this token (starts with "EAAG...")

### Step 3: Run the Script

Open terminal and run:

```bash
node generate-long-lived-token.js "YOUR_SHORT_LIVED_TOKEN_HERE"
```

**Example:**
```bash
node generate-long-lived-token.js "EAAGm0PX4ZCpsBO8..."
```

The script will:
- ✅ Exchange your short-lived token for a long-lived user token (60 days)
- ✅ Convert it to a long-lived page token (60+ days)
- ✅ Display the token and expiration date
- ✅ Offer to update your .env file automatically
- ✅ Verify the token has correct permissions

## 🔄 What the Script Does

```
Short-lived User Token (1-2 hours)
         ↓
Long-lived User Token (60 days)
         ↓
Long-lived Page Token (60+ days, refreshable)
```

## 🎁 Bonus: Never-Expiring Token (For Production)

If you want a token that NEVER expires, use **System Users**:

### Option A: Meta Business Suite (Recommended)

1. **Go to Meta Business Settings**
   - Open: https://business.facebook.com/settings/system-users

2. **Create/Select System User**
   - Click **"Add"** to create a new System User
   - Name it: "DrSilke AutoPost"
   - Select **"Admin"** role

3. **Assign Your Page**
   - Click on the System User
   - Click **"Assign Assets"** → **"Pages"**
   - Select your Dr. Silke page
   - Grant **"Full control"**

4. **Generate Token**
   - Click **"Generate New Token"**
   - Select your app: **"DrSilke"**
   - Select permissions:
     - `pages_show_list`
     - `pages_read_engagement`
     - `pages_manage_posts`
   - Set expiration: **"Never"** ← THIS IS THE KEY!
   - Click **"Generate Token"**

5. **Copy and Save**
   - Copy the token (you'll only see it once!)
   - Update your .env file
   - This token will NEVER expire!

### Option B: Use Access Token Tool

1. **Go to Access Token Tool**
   - Open: https://developers.facebook.com/tools/accesstoken/

2. **Find Your App**
   - Look for "DrSilke" in the list
   - You'll see your page listed

3. **Extend Token**
   - Click **"Extend Access Token"**
   - This gives you 60 days

4. **Set to Never Expire (Advanced)**
   - Use the long-lived token with System Users
   - This makes it permanent

## 🔍 Verify Your Token

After generating, always verify:

```bash
node verify-facebook-token.js
```

This checks:
- ✅ Token is valid
- ✅ Has required permissions
- ✅ Expiration date
- ✅ Can access your page

## ⚠️ Important Notes

### Security
- **Never share** your App Secret publicly
- **Never commit** .env file to Git
- **Store tokens securely**

### Token Lifespan
- **Short-lived user token**: 1-2 hours
- **Long-lived user token**: 60 days
- **Long-lived page token**: 60+ days (can be refreshed)
- **System user token**: Never expires (best for production)

### Why Tokens Expire
Facebook expires tokens for security. The longer the token lives, the more critical it is to:
- Keep it secret
- Rotate it regularly
- Use HTTPS only
- Monitor for unauthorized access

## 🆘 Troubleshooting

### Error: "Invalid OAuth access token"
- Token has expired
- Generate a new one using the script

### Error: "App secret is invalid"
- Make sure you copied the full App Secret
- Don't include quotes or spaces
- Click "Show" button in Facebook dashboard

### Error: "Pages permission not granted"
- Regenerate token in Graph API Explorer
- Make sure to check `pages_manage_posts` permission
- Click "Generate Access Token" again

### Script asks for App ID/Secret
- They're not in your .env file
- Get them from: https://developers.facebook.com/apps/ → DrSilke → Settings → Basic
- Add to .env file

## 📞 Need Help?

If you get stuck, share the error message and I'll help debug!
