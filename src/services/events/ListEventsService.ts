import { EventRepository } from '../../repositories/events/EventRepository';

export class ListEventsService {
  constructor(private repository: EventRepository) {}

  async execute(groupId: string) {
    return this.repository.findByGroupId(groupId);
  }
}
