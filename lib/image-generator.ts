import OpenAI from 'openai';
import axios from 'axios';
import { writeFile } from 'fs/promises';
import { join } from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function generateImage(prompt: string, postId: string): Promise<string> {
  try {
    // Generate image using DALL-E
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
    });

    const imageUrl = response.data?.[0]?.url;

    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E');
    }

    // Download image
    const imageResponse = await axios.get(imageUrl, {
      responseType: 'arraybuffer'
    });

    // Save to public folder
    const filename = `post-${postId}-${Date.now()}.png`;
    const filepath = join(process.cwd(), 'public', 'generated', filename);

    // Ensure directory exists
    const { mkdir } = await import('fs/promises');
    await mkdir(join(process.cwd(), 'public', 'generated'), { recursive: true });

    await writeFile(filepath, imageResponse.data);

    return `/generated/${filename}`;
  } catch (error) {
    console.error('Error generating image:', error);
    throw error;
  }
}

export async function generateImageWithReplicate(prompt: string, postId: string): Promise<string> {
  // Alternative: Use Replicate API for image generation
  // This is a placeholder - implement based on your preference
  try {
    const response = await axios.post(
      'https://api.replicate.com/v1/predictions',
      {
        version: 'stable-diffusion-version-id',
        input: { prompt }
      },
      {
        headers: {
          'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
        }
      }
    );

    // Poll for result and download
    // Implementation depends on Replicate's API structure

    return `/generated/placeholder-${postId}.png`;
  } catch (error) {
    console.error('Error with Replicate:', error);
    throw error;
  }
}
