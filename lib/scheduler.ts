import { prisma } from './prisma';

export const POSTING_DAYS = [1, 3, 5, 6]; // Monday, Wednesday, Friday, Saturday (0 = Sunday)
export const POSTING_TIME = { hour: 10, minute: 0 }; // 10:00 AM

export function getNextPostingDate(): Date {
  const now = new Date();
  const currentDay = now.getDay();
  const currentHour = now.getHours();
  const currentMinute = now.getMinutes();

  // Find next posting day
  let daysUntilNext = 0;
  let nextDay = currentDay;

  // If we're on a posting day but haven't reached the posting time yet, schedule for today
  if (POSTING_DAYS.includes(currentDay)) {
    if (currentHour < POSTING_TIME.hour || (currentHour === POSTING_TIME.hour && currentMinute < POSTING_TIME.minute)) {
      daysUntilNext = 0;
      nextDay = currentDay;
    } else {
      // Already posted today, find next day
      daysUntilNext = 1;
      nextDay = (currentDay + 1) % 7;
    }
  } else {
    daysUntilNext = 1;
    nextDay = (currentDay + 1) % 7;
  }

  // Find the next posting day
  while (!POSTING_DAYS.includes(nextDay)) {
    daysUntilNext++;
    nextDay = (currentDay + daysUntilNext) % 7;
  }

  // Create date for next posting
  const nextDate = new Date(now);
  nextDate.setDate(now.getDate() + daysUntilNext);
  nextDate.setHours(POSTING_TIME.hour, POSTING_TIME.minute, 0, 0);

  return nextDate;
}

export function isPostingDay(date: Date = new Date()): boolean {
  return POSTING_DAYS.includes(date.getDay());
}

export async function getScheduledPosts() {
  return await prisma.post.findMany({
    where: {
      status: 'scheduled',
      scheduledFor: {
        lte: new Date()
      }
    },
    orderBy: {
      scheduledFor: 'asc'
    }
  });
}

export async function scheduleNextWeekPosts() {
  const posts = [];
  let currentDate = new Date();

  // Schedule posts for the next 7 days
  for (let i = 0; i < 7; i++) {
    const date = new Date(currentDate);
    date.setDate(currentDate.getDate() + i);

    if (isPostingDay(date)) {
      date.setHours(POSTING_TIME.hour, POSTING_TIME.minute, 0, 0);

      // Check if we already have a post scheduled for this date
      const existingPost = await prisma.post.findFirst({
        where: {
          scheduledFor: date,
          status: {
            in: ['scheduled', 'posted']
          }
        }
      });

      if (!existingPost) {
        posts.push(date);
      }
    }
  }

  return posts;
}
