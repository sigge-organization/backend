import { Request, Response } from 'express';
import { CreateEventService } from '../../services/events/CreateEventService';
import { EventRepository } from '../../repositories/events/EventRepository';

export class CreateEventController {
  async handle(req: Request, res: Response) {
    const studentGroupId = req.params.studentGroupId as string;
    const { title, date_time_event, local_or_link_event } = req.body;

    try {
      const repository = new EventRepository();
      const service = new CreateEventService(repository);
      const event = await service.execute({
        studentGroupId,
        title,
        date_time_event: new Date(date_time_event),
        local_or_link_event
      });
      return res.status(201).json(event);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
