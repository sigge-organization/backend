import { Request, Response } from 'express';
import { ListEventsService } from '../../services/events/ListEventsService';
import { EventRepository } from '../../repositories/events/EventRepository';

export class ListEventsController {
  async handle(req: Request, res: Response) {
    const studentGroupId = req.params.studentGroupId as string;

    try {
      const repository = new EventRepository();
      const service = new ListEventsService(repository);
      const events = await service.execute(studentGroupId);
      return res.json(events);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
