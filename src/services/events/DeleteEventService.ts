import { EventRepository } from '../../repositories/events/EventRepository';

export class DeleteEventService {
  constructor(private eventRepository: EventRepository) {}

  async execute(id: string, userId: string) {
    const event = await this.eventRepository.findById(id);

    if (!event) {
      throw new Error('Event not found');
    }

    if (event.createdById && event.createdById !== userId) {
      throw new Error('You can only delete events that you created');
    }

    return this.eventRepository.softDelete(id);
  }
}
