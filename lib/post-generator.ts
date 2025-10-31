import OpenAI from 'openai';
import { prisma } from './prisma';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface GeneratedPost {
  content: string;
  imagePrompt: string;
}

export async function generatePost(): Promise<GeneratedPost> {
  // Get content from database
  const contentSources = await prisma.contentSource.findMany({
    orderBy: {
      fetchedAt: 'desc'
    },
    take: 10
  });

  const businessInfo = process.env.BUSINESS_NAME || 'Dr. Silke';
  const businessType = process.env.BUSINESS_TYPE || 'Mental Health';
  const location = process.env.BUSINESS_LOCATION || 'Honolulu, Hawaii';

  const contextData = contentSources.map(cs => cs.content).join('\n\n');

  const systemPrompt = `You are an expert social media content creator for ${businessInfo}, a licensed psychology practice with over 30 years of experience in ${location}.

VOICE & TONE:
- Warm, compassionate, and professional
- Expert yet approachable - like talking to a trusted friend with clinical expertise
- Empowering and validating - never condescending or preachy
- Hopeful and encouraging - focus on growth and healing

CONTENT STRATEGY:
Create diverse, engaging posts that rotate through these types:
1. Educational Tips: Brief, actionable mental health insights (3-5 tips)
2. Myth-Busting: Address common misconceptions about therapy/mental health
3. Self-Care Practices: Practical techniques people can use today
4. Therapeutic Insights: Explain concepts like EMDR, CBT, trauma processing in simple terms
5. Relatable Scenarios: "Do you ever feel..." posts that validate experiences
6. Encouragement: Motivational messages about healing journey
7. Service Highlights: Explain what makes the practice special (30+ years experience, EMDR expertise, telehealth)

POST STRUCTURE:
- Hook: Start with a relatable question, bold statement, or intriguing insight
- Body: 2-3 short paragraphs with valuable content (100-150 words total)
- Call-to-Action: Gentle invitation (e.g., "Schedule a consultation", "Let's talk about how therapy can help", "Contact us to learn more")

STRICT RULES:
✓ NO hashtags (absolutely critical - never use # symbols)
✓ Use emojis sparingly (1-2 max) and only when natural
✓ Write 100-150 words (concise but impactful)
✓ Use short paragraphs (2-3 sentences each)
✓ Include line breaks for readability
✓ HIPAA compliant - no client stories or identifying info
✓ Professional language but conversational tone

TOPICS TO COVER:
- Trauma & PTSD recovery (specialty area)
- EMDR therapy benefits and process
- Addiction and codependency healing
- Anxiety and depression management
- Couples and family therapy
- Life coaching and personal growth
- Telehealth convenience for Hawaii residents
- The importance of finding the right therapist

ENGAGEMENT TECHNIQUES:
- Ask thought-provoking questions
- Share "did you know?" facts about therapy
- Normalize seeking help
- Validate common struggles
- Offer hope and practical solutions

Context about the practice:
${contextData}

Remember: Create posts that make people feel seen, understood, and hopeful about their healing journey.`;

  // Add variety by rotating through different content types
  const contentTypes = [
    "Create an educational post sharing 3-4 practical mental health tips.",
    "Write a myth-busting post that addresses a common misconception about therapy or mental health.",
    "Share a self-care practice or coping strategy people can try today.",
    "Explain a therapeutic concept (like EMDR, trauma processing, or anxiety management) in simple, relatable terms.",
    "Write a validating 'Do you ever feel...' post that normalizes a common struggle.",
    "Create an encouraging post about the healing journey and personal growth.",
    "Highlight one of Dr. Silke's specialties: EMDR therapy, trauma & PTSD, addiction recovery, or 30+ years of experience.",
    "Share insights about when it's time to seek therapy or how to choose the right therapist."
  ];

  const randomType = contentTypes[Math.floor(Math.random() * contentTypes.length)];

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: `${randomType}\n\nIMPORTANT: NO hashtags. Write 100-150 words. Use engaging hooks and clear structure.` }
    ],
    temperature: 0.9,
  });

  const postContent = completion.choices[0].message.content || '';

  // Generate image prompt
  const imageCompletion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: "You are an expert at creating image prompts for social media posts. Create a professional, calming image prompt suitable for a mental health practice. IMPORTANT: The image should contain NO TEXT, NO WORDS, NO LETTERS - only visual elements."
      },
      {
        role: "user",
        content: `Based on this post, create a detailed image prompt for DALL-E that would create a professional, calming image suitable for a mental health practice:\n\n${postContent}\n\nIMPORTANT REQUIREMENTS:
- NO TEXT, NO WORDS, NO LETTERS in the image
- Professional and calming visual elements only
- Suitable for a psychology/mental health practice
- Soft blues, greens, or earth tones
- Abstract or nature-based imagery (peaceful scenes, natural elements, calming colors)
- Appropriate for Facebook social media post`
      }
    ],
    temperature: 0.7,
  });

  const imagePrompt = imageCompletion.choices[0].message.content || 'A calming, professional image with soft colors representing mental wellness and peace. NO TEXT, NO WORDS, NO LETTERS in the image - only visual elements like peaceful nature scenes with soft blues and greens';

  return {
    content: postContent,
    imagePrompt
  };
}

export async function savePost(post: GeneratedPost, scheduledFor?: Date) {
  return await prisma.post.create({
    data: {
      content: post.content,
      imagePrompt: post.imagePrompt,
      status: scheduledFor ? 'scheduled' : 'draft',
      scheduledFor: scheduledFor,
    }
  });
}
