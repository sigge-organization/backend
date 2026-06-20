import { MaterialRepository } from '../../repositories/materials/MaterialRepository';

export class ListMaterialsService {
  constructor(private repository: MaterialRepository) {}

  async execute(groupId: string) {
    return this.repository.findByGroupId(groupId);
  }
}
