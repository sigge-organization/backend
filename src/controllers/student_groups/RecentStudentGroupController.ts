import { Request, Response } from 'express';
import { PrismaClient } from '../../generated/prisma';

const prisma = new PrismaClient();

export class RecentStudentGroupController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user_id;

      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const groups = await prisma.student_Group.findMany({
        where: { 
          deleted_at: null,
          members: {
            some: {
              user_id: userId
            }
          }
        },
        include: {
          _count: {
            select: { members: true }
          },
          events: { orderBy: { created_at: 'desc' }, take: 1 },
          posts: { orderBy: { post_date: 'desc' }, take: 1 },
          materials: { orderBy: { created_at: 'desc' }, take: 1 }
        }
      });

      const groupsWithActivity = groups.map(group => {
        const eventDate = group.events[0]?.created_at?.getTime() || 0;
        const postDate = group.posts[0]?.post_date?.getTime() || 0;
        const materialDate = group.materials[0]?.created_at?.getTime() || 0;
        const groupUpdated = group.updated_at?.getTime() || group.created_at.getTime();

        const latestActivity = Math.max(eventDate, postDate, materialDate, groupUpdated);

        return {
          ...group,
          latestActivity
        };
      });

      groupsWithActivity.sort((a, b) => b.latestActivity - a.latestActivity);

      const recentGroups = groupsWithActivity.slice(0, 3).map(({ events, posts, materials, latestActivity, ...rest }) => rest);

      return res.status(200).json(recentGroups);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao listar atividades recentes dos grupos.' });
    }
  }
}
