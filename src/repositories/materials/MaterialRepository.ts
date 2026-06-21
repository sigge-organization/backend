import prisma from '../../prisma';

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

  async findByGroupId(studentGroupId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return prisma.material.findMany({
      where: { studentGroupId, deleted_at: null },
      include: { uploadedBy: { select: { id: true, name: true, email: true } } },
      orderBy: { created_at: 'desc' },
      skip,
      take: limit,
    });
  }

  async findById(id: string) {
    return prisma.material.findFirst({
      where: { id, deleted_at: null }
    });
  }

  async update(id: string, data: Partial<CreateMaterialDTO>) {
    return prisma.material.update({
      where: { id },
      data
    });
  }

  async softDelete(id: string) {
    return prisma.material.update({
      where: { id },
      data: { deleted_at: new Date() }
    });
  }
}
