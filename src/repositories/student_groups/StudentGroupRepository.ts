import { PrismaClient, Modality } from '../../generated/prisma';
const prisma = new PrismaClient();

export interface CreateStudentGroupDTO {
  theme: string;
  university_course?: string;
  description?: string;
  modality?: Modality;
}

export interface UpdateStudentGroupDTO {
  theme?: string;
  university_course?: string;
  description?: string;
  modality?: Modality;
}

export class StudentGroupRepository {
  async create(data: CreateStudentGroupDTO) {
    return prisma.student_Group.create({ data });
  }

  async findAll() {
    return prisma.student_Group.findMany({
      where: { deleted_at: null },
      include: {
        _count: {
          select: { members: true }
        }
      }
    });
  }

  async findById(id: string) {
    return prisma.student_Group.findFirst({
      where: { id, deleted_at: null },
      include: {
        members: {
          include: { user: { select: { id: true, name: true, email: true, course: true } } }
        }
      }
    });
  }

  async update(id: string, data: UpdateStudentGroupDTO) {
    return prisma.student_Group.update({
      where: { id },
      data
    });
  }

  async delete(id: string) {
    return prisma.student_Group.update({
      where: { id },
      data: { deleted_at: new Date() }
    });
  }
}
