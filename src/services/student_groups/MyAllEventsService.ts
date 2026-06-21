import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

class MyAllEventsService {
  async execute(user_id: string) {
    const events = await prisma.event.findMany({
      where: {
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

export { MyAllEventsService };
