import { Request, Response } from 'express';
import { DeleteEventService } from '../../services/events/DeleteEventService';
import { EventRepository } from '../../repositories/events/EventRepository';

export class DeleteEventController {
  async handle(req: Request, res: Response) {
    const id = req.params.eventId as string;
    const userId = req.user_id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const repository = new EventRepository();
      const service = new DeleteEventService(repository);
      await service.execute(id, userId);

      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
