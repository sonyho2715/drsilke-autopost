// Quick test to see if we can post text-only to Facebook
const axios = require('axios');
require('dotenv').config();

const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
const pageId = process.env.FACEBOOK_PAGE_ID;

async function testPost() {
  try {
    console.log('Testing Facebook post...');
    console.log('Page ID:', pageId);

    // Try posting text only
    const response = await axios.post(
      `https://graph.facebook.com/v18.0/${pageId}/feed`,
      {
        message: 'Test post from Dr. Silke Auto-Post System - Testing connection!',
        access_token: pageAccessToken
      }
    );

    console.log('✅ SUCCESS! Post created:', response.data);
    console.log('Post ID:', response.data.id);
  } catch (error) {
    console.error('❌ ERROR:', error.response?.data || error.message);
  }
}

testPost();
