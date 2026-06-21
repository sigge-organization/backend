import { EventRepository, CreateEventDTO } from '../../repositories/events/EventRepository';

export class UpdateEventService {
  constructor(private eventRepository: EventRepository) {}

  async execute(id: string, userId: string, data: Partial<CreateEventDTO>) {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.createdById && event.createdById !== userId) {
      throw new Error('You can only update events that you created');
    }

    return this.eventRepository.update(id, data);
  }
}
