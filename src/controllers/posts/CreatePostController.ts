import { Request, Response } from 'express';
import { CreatePostService } from '../../services/posts/CreatePostService';
import { PostRepository } from '../../repositories/posts/PostRepository';

export class CreatePostController {
  async handle(req: Request, res: Response) {
    const studentGroupId = req.params.studentGroupId as string;
    const { content } = req.body;
    const user_id = req.user_id;

    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const repository = new PostRepository();
      const service = new CreatePostService(repository);
      const post = await service.execute({
        studentGroupId,
        authorId: user_id,
        content
      });

      const io = req.app.get('io');
      if (io) {
        io.to(studentGroupId).emit('new_post', post);
      }

      return res.status(201).json(post);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
