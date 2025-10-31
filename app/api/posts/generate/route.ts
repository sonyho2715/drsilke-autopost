import { NextResponse } from 'next/server';
import { generatePost, savePost } from '@/lib/post-generator';
import { generateImage } from '@/lib/image-generator';
import { getNextPostingDate } from '@/lib/scheduler';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { autoSchedule = true, scheduleDate } = body;

    // Generate post content
    const post = await generatePost();

    // Determine schedule date
    let scheduledFor: Date | undefined;
    if (autoSchedule) {
      scheduledFor = scheduleDate ? new Date(scheduleDate) : getNextPostingDate();
    }

    // Save post to database
    const savedPost = await savePost(post, scheduledFor);

    // Generate image
    let imageUrl: string | undefined;
    try {
      imageUrl = await generateImage(post.imagePrompt, savedPost.id);

      // Update post with image URL
      const { prisma } = await import('@/lib/prisma');
      await prisma.post.update({
        where: { id: savedPost.id },
        data: { imageUrl }
      });
    } catch (imageError) {
      console.error('Error generating image:', imageError);
      // Continue without image
    }

    return NextResponse.json({
      success: true,
      post: {
        ...savedPost,
        imageUrl
      }
    });
  } catch (error: any) {
    console.error('Error generating post:', error);
    return NextResponse.json(
      { error: 'Failed to generate post', message: error.message },
      { status: 500 }
    );
  }
}
