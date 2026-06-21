import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

function getStartOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day;
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}

function getEndOfWeek(date: Date) {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() + (6 - day);
  d.setDate(diff);
  d.setHours(23, 59, 59, 999);
  return d;
}

class MyWeeklyEventsService {
  async execute(user_id: string) {
    const now = new Date();
    const start = getStartOfWeek(now);
    const end = getEndOfWeek(now);

    const events = await prisma.event.findMany({
      where: {
        date_time_event: {
          gte: start,
          lte: end,
        },
        deleted_at: null,
        group: {
          members: {
            some: {
              user_id: user_id
            }
          },
          deleted_at: null
        }
      },
      include: {
        group: {
          select: {
            id: true,
            theme: true
          }
        }
      },
      orderBy: {
        date_time_event: 'asc'
      }
    });

    return events;
  }
}

export { MyWeeklyEventsService };
