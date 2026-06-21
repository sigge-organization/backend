import prisma from '../../prisma';

class MyAllMaterialsService {
  async execute(user_id: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;

    const materials = await prisma.material.findMany({
      skip,
      take: limit,
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
        },
        uploadedBy: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: {
        created_at: 'desc'
      }
    });

    return materials;
  }
}

export { MyAllMaterialsService };
