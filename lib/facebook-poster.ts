import axios from 'axios';
import { prisma } from './prisma';
import { readFile } from 'fs/promises';
import { join } from 'path';
import FormData from 'form-data';
import { createReadStream } from 'fs';

const FB_API_VERSION = 'v18.0';
const FB_GRAPH_API = `https://graph.facebook.com/${FB_API_VERSION}`;

interface FacebookPostResponse {
  id: string;
  post_id?: string;
}

export async function postToFacebook(
  postId: string,
  content: string,
  imageUrl?: string
): Promise<string> {
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!pageAccessToken || !pageId) {
    throw new Error('Facebook credentials not configured');
  }

  try {
    let response: FacebookPostResponse;

    if (imageUrl) {
      // Try to post with photo, fallback to text if it fails
      try {
        // Check if imageUrl is a full URL (from DALL-E) or a local path
        const isExternalUrl = imageUrl.startsWith('http://') || imageUrl.startsWith('https://');

        if (isExternalUrl) {
          // Post image from URL (DALL-E direct URL)
          const photoResponse = await axios.post(
            `${FB_GRAPH_API}/${pageId}/photos`,
            {
              url: imageUrl,
              message: content,
              access_token: pageAccessToken,
              published: true
            },
            {
              timeout: 60000
            }
          );

          response = photoResponse.data;
          console.log('✅ Photo posted from URL successfully!');
        } else {
          // Post from local file (for backward compatibility)
          const imagePath = join(process.cwd(), 'public', imageUrl);

          const formData = new FormData();
          formData.append('message', content);
          formData.append('access_token', pageAccessToken);
          formData.append('published', 'true');
          formData.append('source', createReadStream(imagePath));

          // Upload photo with increased timeout
          const photoResponse = await axios.post(
            `${FB_GRAPH_API}/${pageId}/photos`,
            formData,
            {
              headers: {
                ...formData.getHeaders()
              },
              timeout: 60000, // 60 seconds timeout
              maxContentLength: Infinity,
              maxBodyLength: Infinity
            }
          );

          response = photoResponse.data;
          console.log('✅ Photo posted from file successfully!');
        }
      } catch (photoError: any) {
        console.error('⚠️  Photo upload failed, posting text only:', photoError.message);

        // Fallback: Post text only
        const postResponse = await axios.post(
          `${FB_GRAPH_API}/${pageId}/feed`,
          {
            message: content,
            access_token: pageAccessToken
          }
        );

        response = postResponse.data;
        console.log('✅ Text-only post successful (photo failed)');
      }
    } else {
      // Post text only
      const postResponse = await axios.post(
        `${FB_GRAPH_API}/${pageId}/feed`,
        {
          message: content,
          access_token: pageAccessToken
        }
      );

      response = postResponse.data;
    }

    const postIdFromFb = response.post_id || response.id;

    // Update post in database
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'posted',
        platformPostId: postIdFromFb,
        postedAt: new Date()
      }
    });

    return postIdFromFb;
  } catch (error: any) {
    console.error('Error posting to Facebook:', error.response?.data || error.message);

    // Update post with error
    await prisma.post.update({
      where: { id: postId },
      data: {
        status: 'failed',
        error: error.response?.data?.error?.message || error.message
      }
    });

    throw error;
  }
}

export async function verifyFacebookCredentials(): Promise<boolean> {
  const pageAccessToken = process.env.FACEBOOK_PAGE_ACCESS_TOKEN;
  const pageId = process.env.FACEBOOK_PAGE_ID;

  if (!pageAccessToken || !pageId) {
    return false;
  }

  try {
    const response = await axios.get(
      `${FB_GRAPH_API}/${pageId}`,
      {
        params: {
          access_token: pageAccessToken,
          fields: 'id,name'
        }
      }
    );

    return response.status === 200;
  } catch (error) {
    console.error('Facebook credentials verification failed:', error);
    return false;
  }
}
