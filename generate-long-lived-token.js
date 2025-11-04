/**
 * Generate Long-Lived Facebook Page Access Token
 *
 * This script helps you convert a short-lived user token into a
 * long-lived page token that lasts 60+ days.
 *
 * Usage:
 *   node generate-long-lived-token.js YOUR_SHORT_LIVED_USER_TOKEN
 */

require('dotenv/config');
const https = require('https');

// Get token from command line argument
const shortLivedToken = process.argv[2];

if (!shortLivedToken) {
  console.error('❌ Error: Please provide a short-lived user token');
  console.error('\nUsage:');
  console.error('  node generate-long-lived-token.js YOUR_SHORT_LIVED_USER_TOKEN');
  console.error('\nSteps to get a short-lived token:');
  console.error('  1. Go to https://developers.facebook.com/tools/explorer/');
  console.error('  2. Select your DrSilke app');
  console.error('  3. Click "Generate Access Token"');
  console.error('  4. Select permissions: pages_show_list, pages_read_engagement, pages_manage_posts');
  console.error('  5. Copy the token and pass it to this script\n');
  process.exit(1);
}

// You'll need these from your Facebook App dashboard
// Go to: https://developers.facebook.com/apps/ -> Select DrSilke -> Settings -> Basic
const APP_ID = process.env.FACEBOOK_APP_ID;
const APP_SECRET = process.env.FACEBOOK_APP_SECRET;

if (!APP_ID || !APP_SECRET) {
  console.log('\n⚠️  Warning: FACEBOOK_APP_ID and FACEBOOK_APP_SECRET not found in .env');
  console.log('   Please add them to continue.\n');
  console.log('   To find them:');
  console.log('   1. Go to https://developers.facebook.com/apps/');
  console.log('   2. Select DrSilke app');
  console.log('   3. Go to Settings > Basic');
  console.log('   4. Copy App ID and App Secret\n');
  console.log('   Then add to .env:');
  console.log('   FACEBOOK_APP_ID="your-app-id"');
  console.log('   FACEBOOK_APP_SECRET="your-app-secret"\n');

  // Ask for them interactively
  const readline = require('readline');
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  console.log('Or enter them now:');
  rl.question('Facebook App ID: ', (appId) => {
    rl.question('Facebook App Secret: ', (appSecret) => {
      rl.close();
      generateLongLivedToken(appId, appSecret, shortLivedToken);
    });
  });
} else {
  generateLongLivedToken(APP_ID, APP_SECRET, shortLivedToken);
}

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          // Try to parse as JSON first
          try {
            resolve(JSON.parse(data));
          } catch {
            // If not JSON, parse as query string
            const params = new URLSearchParams(data);
            const result = {};
            for (const [key, value] of params) {
              result[key] = value;
            }
            resolve(result);
          }
        } catch (e) {
          reject(new Error('Failed to parse response: ' + data));
        }
      });
    }).on('error', reject);
  });
}

async function generateLongLivedToken(appId, appSecret, shortToken) {
  console.log('\n🔄 Converting to Long-Lived Token...\n');

  try {
    // Step 1: Exchange short-lived user token for long-lived user token
    console.log('📋 Step 1: Getting long-lived user token...');
    const userTokenUrl = `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${shortToken}`;

    const userTokenResponse = await makeRequest(userTokenUrl);

    if (userTokenResponse.error) {
      console.error('❌ Error:', userTokenResponse.error.message);
      return;
    }

    const longLivedUserToken = userTokenResponse.access_token;
    console.log('✅ Long-lived user token obtained');
    console.log(`   Expires in: ${Math.floor(userTokenResponse.expires_in / 86400)} days\n`);

    // Step 2: Get page access token using the long-lived user token
    console.log('📋 Step 2: Getting page access token...');
    const pagesUrl = `https://graph.facebook.com/v18.0/me/accounts?access_token=${longLivedUserToken}`;

    const pagesResponse = await makeRequest(pagesUrl);

    if (pagesResponse.error) {
      console.error('❌ Error:', pagesResponse.error.message);
      return;
    }

    if (!pagesResponse.data || pagesResponse.data.length === 0) {
      console.error('❌ No pages found. Make sure you manage at least one Facebook page.');
      return;
    }

    console.log('✅ Found', pagesResponse.data.length, 'page(s):\n');

    // Display all pages
    pagesResponse.data.forEach((page, index) => {
      console.log(`   ${index + 1}. ${page.name} (ID: ${page.id})`);
    });

    // Find Dr. Silke's page
    const drSilkePage = pagesResponse.data.find(page =>
      page.id === '701016076625177' ||
      page.name.toLowerCase().includes('silke')
    );

    if (!drSilkePage) {
      console.log('\n⚠️  Could not find Dr. Silke page automatically.');
      console.log('   Please use one of the tokens above.\n');
      return;
    }

    console.log(`\n✅ Found Dr. Silke page: ${drSilkePage.name}`);
    console.log(`   Page ID: ${drSilkePage.id}`);

    const pageToken = drSilkePage.access_token;

    // Step 3: Check token expiration
    console.log('\n📋 Step 3: Checking token details...');
    const debugUrl = `https://graph.facebook.com/v18.0/debug_token?input_token=${pageToken}&access_token=${pageToken}`;
    const debugResponse = await makeRequest(debugUrl);

    if (debugResponse.data) {
      const tokenData = debugResponse.data;
      console.log(`✅ Token Type: ${tokenData.type}`);

      if (tokenData.expires_at === 0) {
        console.log('✅ Token Expiration: ♾️  NEVER EXPIRES!');
      } else {
        const expiryDate = new Date(tokenData.expires_at * 1000);
        const daysUntilExpiry = Math.floor((expiryDate - new Date()) / (1000 * 60 * 60 * 24));
        console.log(`✅ Token Expires: ${expiryDate.toLocaleString()} (${daysUntilExpiry} days)`);
      }

      // Check permissions
      if (tokenData.scopes && tokenData.scopes.length > 0) {
        console.log('✅ Permissions:', tokenData.scopes.join(', '));

        if (!tokenData.scopes.includes('pages_manage_posts')) {
          console.log('\n⚠️  WARNING: Token does NOT have pages_manage_posts permission!');
          console.log('   You need to regenerate with this permission included.');
        }
      }
    }

    // Step 4: Display results
    console.log('\n' + '='.repeat(70));
    console.log('🎉 SUCCESS! Here is your long-lived page access token:');
    console.log('='.repeat(70));
    console.log(`\nPage Name: ${drSilkePage.name}`);
    console.log(`Page ID: ${drSilkePage.id}`);
    console.log(`\nPage Access Token:`);
    console.log(pageToken);
    console.log('\n' + '='.repeat(70));

    console.log('\n📝 Next Steps:');
    console.log('   1. Copy the token above');
    console.log('   2. Update your .env file:');
    console.log(`      FACEBOOK_PAGE_ACCESS_TOKEN="${pageToken}"`);
    console.log(`      FACEBOOK_PAGE_ID="${drSilkePage.id}"`);
    console.log('   3. Run: node verify-facebook-token.js');
    console.log('   4. Test posting from your dashboard!\n');

    // Offer to update .env automatically
    const readline = require('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    rl.question('Would you like me to update your .env file now? (y/n): ', (answer) => {
      if (answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes') {
        updateEnvFile(drSilkePage.id, pageToken);
      } else {
        console.log('\n✅ Done! Remember to update your .env file manually.');
      }
      rl.close();
    });

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
}

function updateEnvFile(pageId, pageToken) {
  const fs = require('fs');
  const envPath = '/Users/sonyho/drsilke-autopost/.env';

  try {
    let envContent = fs.readFileSync(envPath, 'utf8');

    // Update token
    if (envContent.includes('FACEBOOK_PAGE_ACCESS_TOKEN=')) {
      envContent = envContent.replace(
        /FACEBOOK_PAGE_ACCESS_TOKEN="[^"]*"/,
        `FACEBOOK_PAGE_ACCESS_TOKEN="${pageToken}"`
      );
    } else {
      envContent += `\nFACEBOOK_PAGE_ACCESS_TOKEN="${pageToken}"`;
    }

    // Update page ID
    if (envContent.includes('FACEBOOK_PAGE_ID=')) {
      envContent = envContent.replace(
        /FACEBOOK_PAGE_ID="[^"]*"/,
        `FACEBOOK_PAGE_ID="${pageId}"`
      );
    } else {
      envContent += `\nFACEBOOK_PAGE_ID="${pageId}"`;
    }

    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env file updated successfully!');
    console.log('\n🧪 Running verification...\n');

    // Run verification
    const { exec } = require('child_process');
    exec('node verify-facebook-token.js', (error, stdout, stderr) => {
      console.log(stdout);
      if (error) {
        console.error(stderr);
      }
    });

  } catch (error) {
    console.error('\n❌ Error updating .env file:', error.message);
    console.log('   Please update it manually.');
  }
}
