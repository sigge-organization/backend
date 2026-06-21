import prisma from '../../prisma';

class MyRecentMaterialsService {
  async execute(user_id: string) {
    const materials = await prisma.material.findMany({
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
      },
      take: 10
    });

    return materials;
  }
}

export { MyRecentMaterialsService };
