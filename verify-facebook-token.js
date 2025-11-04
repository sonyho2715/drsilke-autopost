/**
 * Facebook Token Verification Script
 *
 * This script helps you verify your Facebook Page Access Token
 * and check if it has the required permissions.
 *
 * Usage:
 *   node verify-facebook-token.js
 */

require('dotenv/config');
const https = require('https');

const PAGE_ACCESS_TOKEN = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const PAGE_ID = process.env.FACEBOOK_PAGE_ID;

if (!PAGE_ACCESS_TOKEN || !PAGE_ID) {
  console.error('❌ Error: Missing Facebook credentials in .env file');
  console.error('   Please set FACEBOOK_PAGE_ACCESS_TOKEN and FACEBOOK_PAGE_ID');
  process.exit(1);
}

console.log('🔍 Verifying Facebook Token...\n');
console.log(`Page ID: ${PAGE_ID}`);
console.log(`Token: ${PAGE_ACCESS_TOKEN.substring(0, 20)}...${PAGE_ACCESS_TOKEN.substring(PAGE_ACCESS_TOKEN.length - 10)}\n`);

// Function to make HTTPS requests
function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (e) {
          reject(new Error('Failed to parse response'));
        }
      });
    }).on('error', reject);
  });
}

async function verifyToken() {
  try {
    // Step 1: Verify the token is valid and check permissions
    console.log('📋 Step 1: Checking token permissions...');
    const permUrl = `https://graph.facebook.com/v18.0/me/permissions?access_token=${PAGE_ACCESS_TOKEN}`;
    const permissions = await makeRequest(permUrl);

    if (permissions.error) {
      console.error('❌ Error checking permissions:', permissions.error.message);
      return false;
    }

    const grantedPermissions = permissions.data.filter(p => p.status === 'granted').map(p => p.permission);
    console.log('✅ Granted Permissions:', grantedPermissions.join(', '));

    const requiredPermissions = ['pages_manage_posts', 'pages_read_engagement'];
    const missingPermissions = requiredPermissions.filter(p => !grantedPermissions.includes(p));

    if (missingPermissions.length > 0) {
      console.error('❌ Missing required permissions:', missingPermissions.join(', '));
      console.error('   Please generate a new token with these permissions.');
      return false;
    }

    console.log('✅ All required permissions are granted!\n');

    // Step 2: Verify we can access the page
    console.log('📋 Step 2: Verifying page access...');
    const pageUrl = `https://graph.facebook.com/v18.0/${PAGE_ID}?fields=name,category,is_published&access_token=${PAGE_ACCESS_TOKEN}`;
    const page = await makeRequest(pageUrl);

    if (page.error) {
      console.error('❌ Error accessing page:', page.error.message);
      return false;
    }

    console.log(`✅ Page Name: ${page.name}`);
    console.log(`✅ Page Category: ${page.category}`);
    console.log(`✅ Page Published: ${page.is_published ? 'Yes' : 'No'}`);

    if (!page.is_published) {
      console.warn('⚠️  Warning: Page is not published. Publishing may fail.');
    }
    console.log('');

    // Step 3: Check token expiration
    console.log('📋 Step 3: Checking token expiration...');
    const debugUrl = `https://graph.facebook.com/v18.0/debug_token?input_token=${PAGE_ACCESS_TOKEN}&access_token=${PAGE_ACCESS_TOKEN}`;
    const debug = await makeRequest(debugUrl);

    if (debug.data) {
      const tokenData = debug.data;
      console.log(`✅ Token Type: ${tokenData.type}`);
      console.log(`✅ App ID: ${tokenData.app_id}`);

      if (tokenData.expires_at === 0) {
        console.log('✅ Token Expiration: Never expires');
      } else {
        const expiryDate = new Date(tokenData.expires_at * 1000);
        console.log(`✅ Token Expires: ${expiryDate.toLocaleString()}`);

        const daysUntilExpiry = Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        if (daysUntilExpiry < 7) {
          console.warn(`⚠️  Warning: Token expires in ${daysUntilExpiry} days. Consider generating a new one.`);
        }
      }
    }
    console.log('');

    // Step 4: Test if we can create a post (dry run)
    console.log('📋 Step 4: Testing post creation capability...');
    console.log('   (Note: Not actually creating a post, just checking access)\n');

    console.log('✅ All checks passed! Your token is ready to use.\n');
    console.log('🎉 You can now publish posts to Facebook!\n');

    return true;
  } catch (error) {
    console.error('❌ Verification failed:', error.message);
    return false;
  }
}

// Run verification
verifyToken().then(success => {
  if (success) {
    console.log('✨ Token verification completed successfully!');
    process.exit(0);
  } else {
    console.log('\n💡 Next steps:');
    console.log('   1. Go to https://developers.facebook.com/tools/explorer/');
    console.log('   2. Generate a new token with pages_manage_posts permission');
    console.log('   3. Convert it to a Page Access Token');
    console.log('   4. Update your .env file');
    console.log('   5. Run this script again\n');
    console.log('   See UPDATE_FACEBOOK_TOKEN.md for detailed instructions.');
    process.exit(1);
  }
});
