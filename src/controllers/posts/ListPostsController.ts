import { Request, Response } from 'express';
import { ListPostsService } from '../../services/posts/ListPostsService';
import { PostRepository } from '../../repositories/posts/PostRepository';

export class ListPostsController {
  async handle(req: Request, res: Response) {
    const studentGroupId = req.params.studentGroupId as string;

    try {
      const repository = new PostRepository();
      const service = new ListPostsService(repository);
      const posts = await service.execute(studentGroupId);
      return res.json(posts);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
