# Dr. Silke Auto-Post System

Automated social media posting system for Dr. Silke Vogelmann-Sine, Ph.D.

## Features

- 🤖 **AI-Powered Content Generation**: Uses OpenAI GPT-4 to generate engaging mental health content
- 🎨 **Automatic Image Creation**: Generates professional images using DALL-E 3
- 📅 **Smart Scheduling**: Automatically posts on Monday, Wednesday, Friday, and Saturday at 10:00 AM
- 🚫 **No Hashtags**: Content is generated without hashtags as specified
- 📱 **Facebook Integration**: Direct posting to Facebook pages
- 💾 **Content Database**: Stores all posts, schedules, and content sources
- 🎛️ **Admin Dashboard**: Easy-to-use interface for managing posts

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite with Prisma ORM
- **AI**: OpenAI GPT-4 for content + DALL-E 3 for images
- **Social Media**: Facebook Graph API
- **Styling**: Tailwind CSS
- **Deployment**: Vercel (with Cron Jobs)

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Update your `.env` file with the following:

```env
# OpenAI API Key (required)
OPENAI_API_KEY="your-openai-api-key"

# Facebook API credentials (required)
FACEBOOK_PAGE_ACCESS_TOKEN="your-facebook-page-access-token"
FACEBOOK_PAGE_ID="your-facebook-page-id"

# Cron job secret (change this to a secure random string)
CRON_SECRET="your-secure-random-secret-key-here"
```

### 3. Set Up Facebook App

1. Go to [Facebook Developers](https://developers.facebook.com/)
2. Create a new app
3. Add "Facebook Login" and "Pages" products
4. Get your Page Access Token
5. Add the token and page ID to your `.env` file

### 4. Run Development Server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the dashboard.

## Usage

### Dashboard Features

1. **Generate New Post**: Creates a single AI-generated post with image
2. **Schedule Week**: Automatically generates posts for all posting days (Mon, Wed, Fri, Sat)
3. **Publish Now**: Manually publish a scheduled post immediately
4. **Delete**: Remove unwanted posts

### Posting Schedule

- **Days**: Monday, Wednesday, Friday, Saturday
- **Time**: 10:00 AM (configurable in `lib/scheduler.ts`)
- **Automatic**: When deployed to Vercel, posts are automatically published via cron jobs

## Deployment to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add all environment variables in Vercel dashboard
4. Deploy

The `vercel.json` file configures automatic cron jobs.

## API Endpoints

- `POST /api/content/fetch` - Fetch content from business sources
- `POST /api/posts/generate` - Generate a new post
- `POST /api/posts/schedule-week` - Schedule posts for the week
- `POST /api/posts/publish` - Publish a specific post
- `GET /api/posts` - Get all posts
- `DELETE /api/posts?id={id}` - Delete a post
- `GET /api/cron/post` - Cron endpoint (secured with CRON_SECRET)
