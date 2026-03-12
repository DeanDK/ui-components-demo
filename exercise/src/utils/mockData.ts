import type { Event } from '@/types';

const titles = [
  'Team Meeting',
  'Client Presentation',
  'Code Review',
  'Sprint Planning',
  'Design Workshop',
  'Product Demo',
  'Training Session',
  'Performance Review',
  'Budget Discussion',
  'Project Kickoff',
  'Stakeholder Sync',
  'Technical Debt Review',
  'Architecture Meeting',
  'User Testing',
  'Release Planning',
];

const descriptions = [
  'Discuss quarterly objectives and team goals',
  'Review progress and address blockers',
  'Align on deliverables and timeline',
  'Gather feedback and iterate on design',
  'Present findings and recommendations',
];

const categories = ['Development', 'Design', 'Management', 'Sales', 'Support'];

const STATUSES: Event['status'][] = ['pending', 'completed', 'cancelled'];
const PRIORITIES: Event['priority'][] = ['low', 'medium', 'high'];

const randomItem = <T>(arr: T[]): T => {
  return arr[Math.floor(Math.random() * arr.length)];
};

const randomInt = (max: number) => {
  return Math.floor(Math.random() * max);
};

const generateRandomDate = (baseDate: Date) => {
  const date = new Date(baseDate);

  const daysOffset = randomInt(360) - 180;
  date.setDate(date.getDate() + daysOffset);

  const hour = randomInt(14) + 8;
  const minute = randomInt(60);

  date.setHours(hour, minute, 0, 0);

  return date;
};

export const generateMockEvents = (count: number): Event[] => {
  const events: Event[] = [];
  const now = new Date();

  for (let i = 0; i < count; i++) {
    const date = generateRandomDate(now);

    const event: Event = {
      id: `event-${i + 1}`,
      title: randomItem(titles),
      date,
      description: Math.random() > 0.3 ? randomItem(descriptions) : undefined,
      status: randomItem(STATUSES),
      priority: randomItem(PRIORITIES),
      category: randomItem(categories),
    };

    events.push(event);
  }

  return events.sort((a, b) => b.date.getTime() - a.date.getTime());
};
