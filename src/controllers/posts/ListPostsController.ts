import { Request, Response } from 'express';
import { ListPostsService } from '../../services/posts/ListPostsService';
import { PostRepository } from '../../repositories/posts/PostRepository';

export class ListPostsController {
  async handle(req: Request, res: Response) {
    const studentGroupId = req.params.studentGroupId as string;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    try {
      const repository = new PostRepository();
      const service = new ListPostsService(repository);
      const posts = await service.execute(studentGroupId, page, limit);
      
      return res.json({
        posts,
        nextPage: posts.length === limit ? page + 1 : null,
      });
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
