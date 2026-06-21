import { MaterialRepository } from '../../repositories/materials/MaterialRepository';

export class ListMaterialsService {
  constructor(private repository: MaterialRepository) {}

  async execute(groupId: string, page: number = 1, limit: number = 20) {
    return this.repository.findByGroupId(groupId, page, limit);
  }
}
