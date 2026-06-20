import { EventRepository, CreateEventDTO } from '../../repositories/events/EventRepository';

export class CreateEventService {
  constructor(private repository: EventRepository) {}

  async execute(data: CreateEventDTO) {
    if (!data.title || !data.date_time_event || !data.local_or_link_event) {
      throw new Error("Missing required event fields");
    }
    return this.repository.create(data);
  }
}
