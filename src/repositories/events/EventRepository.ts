import prisma from '../../prisma';

export interface CreateEventDTO {
  studentGroupId: string;
  title: string;
  date_time_event: Date;
  local_or_link_event: string;
  createdById: string;
}

export class EventRepository {
  async create(data: CreateEventDTO) {
    return prisma.event.create({ data });
  }

  async findByGroupId(studentGroupId: string) {
    return prisma.event.findMany({
      where: { studentGroupId, deleted_at: null },
      include: { createdBy: { select: { id: true, name: true, email: true } } },
      orderBy: { date_time_event: 'asc' }
    });
  }

  async findById(id: string) {
    return prisma.event.findFirst({
      where: { id, deleted_at: null }
    });
  }

  async update(id: string, data: Partial<CreateEventDTO>) {
    return prisma.event.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return prisma.event.update({
      where: { id },
      data: { deleted_at: new Date() }
    });
  }
}
