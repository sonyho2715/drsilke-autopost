import { NextResponse } from 'next/server';
import { fetchWebsiteContent, fetchReviews } from '@/lib/content-fetcher';

export async function POST() {
  try {
    const websiteUrl = process.env.BUSINESS_URL || 'https://www.silke.com';

    // Fetch content from various sources
    const websiteContent = await fetchWebsiteContent(websiteUrl);
    const yelpReviews = await fetchReviews('yelp');
    const googleReviews = await fetchReviews('google');

    return NextResponse.json({
      success: true,
      data: {
        website: websiteContent,
        yelp: yelpReviews,
        google: googleReviews
      }
    });
  } catch (error: any) {
    console.error('Error fetching content:', error);
    return NextResponse.json(
      { error: 'Failed to fetch content', message: error.message },
      { status: 500 }
    );
  }
}

export async function GET() {
  return NextResponse.json({
    message: 'Use POST to fetch new content'
  });
}
