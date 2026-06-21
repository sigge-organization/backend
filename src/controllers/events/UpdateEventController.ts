import { Request, Response } from 'express';
import { UpdateEventService } from '../../services/events/UpdateEventService';
import { EventRepository } from '../../repositories/events/EventRepository';

export class UpdateEventController {
  async handle(req: Request, res: Response) {
    const id = req.params.eventId as string;
    const data = req.body;
    const userId = req.user_id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const repository = new EventRepository();
      const service = new UpdateEventService(repository);
      const updatedEvent = await service.execute(id, userId, data);

      return res.json(updatedEvent);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
