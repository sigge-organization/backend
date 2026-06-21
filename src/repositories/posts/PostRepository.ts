import prisma from '../../prisma';

export interface CreatePostDTO {
  authorId: string;
  studentGroupId: string;
  content: string;
}

export class PostRepository {
  async create(data: CreatePostDTO) {
    return prisma.post.create({ data });
  }

  async findByGroupId(studentGroupId: string, page: number = 1, limit: number = 20) {
    const skip = (page - 1) * limit;
    return prisma.post.findMany({
      where: { studentGroupId, deleted_at: null },
      include: { author: { select: { id: true, name: true, email: true } } },
      orderBy: { post_date: 'desc' },
      skip,
      take: limit,
    });
  }
}
