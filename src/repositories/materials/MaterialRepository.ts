import { PrismaClient } from '../../generated/prisma';
const prisma = new PrismaClient();

export interface CreateMaterialDTO {
  uploadedById: string;
  studentGroupId: string;
  title: string;
  external_url: string;
}

export class MaterialRepository {
  async create(data: CreateMaterialDTO) {
    return prisma.material.create({ data });
  }

  async findByGroupId(studentGroupId: string) {
    return prisma.material.findMany({
      where: { studentGroupId, deleted_at: null },
      include: { uploadedBy: { select: { id: true, name: true, email: true } } },
      orderBy: { created_at: 'desc' }
    });
  }
}
