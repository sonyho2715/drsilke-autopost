import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { postToFacebook } from '@/lib/facebook-poster';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { postId } = body;

    if (!postId) {
      return NextResponse.json(
        { error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Get post from database
    const post = await prisma.post.findUnique({
      where: { id: postId }
    });

    if (!post) {
      return NextResponse.json(
        { error: 'Post not found' },
        { status: 404 }
      );
    }

    // Post to Facebook
    const facebookPostId = await postToFacebook(
      post.id,
      post.content,
      post.imageUrl || undefined
    );

    return NextResponse.json({
      success: true,
      facebookPostId
    });
  } catch (error: any) {
    console.error('Error publishing post:', error);
    return NextResponse.json(
      { error: 'Failed to publish post', message: error.message },
      { status: 500 }
    );
  }
}
