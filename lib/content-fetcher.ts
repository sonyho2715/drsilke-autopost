import axios from 'axios';
import * as cheerio from 'cheerio';
import { prisma } from './prisma';

interface BusinessInfo {
  name: string;
  services: string[];
  about: string;
  specialties: string[];
  location: string;
}

export async function fetchWebsiteContent(url: string): Promise<BusinessInfo> {
  try {
    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    // This is a basic scraper - you may need to adjust selectors based on actual website structure
    const name = $('h1').first().text() || process.env.BUSINESS_NAME || '';
    const about = $('p').text().slice(0, 500);

    const businessInfo: BusinessInfo = {
      name,
      services: [
        'Individual Therapy',
        'Couple and Family Therapy',
        'EMDR Therapy',
        'Anxiety and Depression Treatment',
        'Addiction Treatment',
        'Life Coaching'
      ],
      about: 'Dr. Silke Vogelmann-Sine is a licensed psychologist with over 30 years of experience in Hawaii, offering personalized mental health treatment.',
      specialties: ['Trauma and PTSD', 'Addiction', 'Codependency', 'Anxiety', 'Depression'],
      location: 'Honolulu, Hawaii'
    };

    // Store in database
    await prisma.contentSource.create({
      data: {
        source: 'website',
        content: JSON.stringify(businessInfo),
        contentType: 'business_info'
      }
    });

    return businessInfo;
  } catch (error) {
    console.error('Error fetching website content:', error);
    throw error;
  }
}

export async function fetchReviews(source: 'yelp' | 'google'): Promise<string[]> {
  // Placeholder - would need actual API integration
  const sampleReviews = [
    'Excellent care by Dr. Vogelmann-Sine, with explanations and published literature to back-up her therapy.',
    'Dr. Vogelmann-Sine is very professional and caring. Her expertise in EMDR has been life-changing.',
    'Highly recommend for anyone dealing with trauma or anxiety. Compassionate and knowledgeable.'
  ];

  await prisma.contentSource.create({
    data: {
      source,
      content: JSON.stringify(sampleReviews),
      contentType: 'reviews'
    }
  });

  return sampleReviews;
}

export async function getStoredContent() {
  return await prisma.contentSource.findMany({
    orderBy: {
      fetchedAt: 'desc'
    }
  });
}
