import { NextResponse } from 'next/server';
import { getScheduledPosts } from '@/lib/scheduler';
import { postToFacebook } from '@/lib/facebook-poster';

export async function GET(request: Request) {
  try {
    // Verify this is a cron request from Vercel
    const authHeader = request.headers.get('authorization');
    const cronSecret = process.env.CRON_SECRET;

    // In production, require authorization
    if (process.env.NODE_ENV === 'production' && cronSecret) {
      if (authHeader !== `Bearer ${cronSecret}`) {
        console.log('Cron: Unauthorized request rejected');
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
    }

    // Get scheduled posts that should be posted now
    const posts = await getScheduledPosts();

    const results = [];
    for (const post of posts) {
      try {
        const facebookPostId = await postToFacebook(
          post.id,
          post.content,
          post.imageUrl || undefined
        );

        results.push({
          postId: post.id,
          success: true,
          facebookPostId
        });
      } catch (error: any) {
        results.push({
          postId: post.id,
          success: false,
          error: error.message
        });
      }
    }

    return NextResponse.json({
      success: true,
      postsProcessed: results.length,
      results
    });
  } catch (error: any) {
    console.error('Error in cron job:', error);
    return NextResponse.json(
      { error: 'Cron job failed', message: error.message },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  return GET(request);
}
