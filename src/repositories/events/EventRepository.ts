import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

export interface CreateEventDTO {
  studentGroupId: string;
  title: string;
  date_time_event: Date;
  local_or_link_event: string;
}

export class EventRepository {
  async create(data: CreateEventDTO) {
    return prisma.event.create({ data });
  }

  async findByGroupId(studentGroupId: string) {
    return prisma.event.findMany({
      where: { studentGroupId, deleted_at: null },
      orderBy: { date_time_event: 'asc' }
    });
  }
}
