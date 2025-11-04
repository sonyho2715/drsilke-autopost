# Quick Guide: Get New Facebook Access Token

## You Are Here: ✅ In the DrSilke App Dashboard

## Step 1: Ensure You're an App Administrator

1. In the left sidebar, click **"Vai trò trong ứng dụng"** (App Roles)
2. Check if you're listed as Administrator/Developer/Tester
3. If not, add yourself

## Step 2: Go to Graph API Explorer

Open this link: https://developers.facebook.com/tools/explorer/

## Step 3: Generate Token in Graph API Explorer

1. **Select Your App**:
   - At the top, click the dropdown that says "Graph API Explorer" or an app name
   - Select **"DrSilke"**

2. **Generate Access Token**:
   - Click the **"Generate Access Token"** button
   - A permissions dialog will appear

3. **Select These Permissions** (CRITICAL):
   - ✅ `pages_show_list`
   - ✅ `pages_read_engagement`
   - ✅ `pages_manage_posts` ← **MUST HAVE THIS ONE**
   - ✅ `pages_read_user_content`
   - ✅ `business_management` (optional)

4. Click **"Generate Access Token"**
5. Click **"Continue as [Your Name]"**
6. **Allow all permissions**

You'll now see a token in the "Access Token" field - this is your USER ACCESS TOKEN.

## Step 4: Convert to Page Access Token

Copy the user token from Graph API Explorer, then:

### Option A: Use the Browser

Open this URL in a new tab (replace YOUR_USER_TOKEN):

```
https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_USER_TOKEN
```

You'll see JSON like this:

```json
{
  "data": [
    {
      "access_token": "EAAxxxx...",  ← THIS IS YOUR PAGE TOKEN
      "category": "Health/Beauty",
      "name": "Dr. Silke Vogelmann-Sine",
      "id": "701016076625177",
      "tasks": ["ANALYZE", "ADVERTISE", "MODERATE", "CREATE_CONTENT", "MANAGE"]
    }
  ]
}
```

Copy the `access_token` value.

### Option B: Use curl in Terminal

```bash
curl "https://graph.facebook.com/v18.0/me/accounts?access_token=YOUR_USER_TOKEN"
```

## Step 5: Update Your .env File

I'll help you update the .env file once you have the new PAGE ACCESS TOKEN!

Just paste the token here and I'll update it for you.

## Step 6: Verify the Token

After updating .env, run:

```bash
node verify-facebook-token.js
```

This will check if your token has the right permissions and hasn't expired.

## If You Get Stuck

Common issues:

1. **"pages_manage_posts not available"**
   - Make sure you're added as an App Administrator/Developer/Tester
   - Make sure the app is in Development mode (not Live)

2. **"Token expired immediately"**
   - You might have copied the USER token instead of the PAGE token
   - Make sure you completed Step 4 above

3. **"Permission denied"**
   - Make sure you're an admin of the Dr. Silke Facebook Page
   - Check that the page is published (not in draft)

Let me know when you have the PAGE ACCESS TOKEN and I'll update your .env file!
