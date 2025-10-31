import { NextResponse } from 'next/server';
import { scheduleNextWeekPosts } from '@/lib/scheduler';
import { generatePost, savePost } from '@/lib/post-generator';
import { generateImage } from '@/lib/image-generator';
import { prisma } from '@/lib/prisma';

export async function POST() {
  try {
    // Get dates that need posts scheduled
    const scheduleDates = await scheduleNextWeekPosts();

    const generatedPosts = [];

    for (const date of scheduleDates) {
      try {
        // Generate post content
        const post = await generatePost();

        // Save post
        const savedPost = await savePost(post, date);

        // Generate image
        try {
          const imageUrl = await generateImage(post.imagePrompt, savedPost.id);

          // Update post with image
          await prisma.post.update({
            where: { id: savedPost.id },
            data: { imageUrl }
          });

          generatedPosts.push({
            ...savedPost,
            imageUrl
          });
        } catch (imageError) {
          console.error('Error generating image:', imageError);
          generatedPosts.push(savedPost);
        }
      } catch (error) {
        console.error('Error generating post for date:', date, error);
      }
    }

    return NextResponse.json({
      success: true,
      postsGenerated: generatedPosts.length,
      posts: generatedPosts
    });
  } catch (error: any) {
    console.error('Error scheduling posts:', error);
    return NextResponse.json(
      { error: 'Failed to schedule posts', message: error.message },
      { status: 500 }
    );
  }
}
