import { MaterialRepository, CreateMaterialDTO } from '../../repositories/materials/MaterialRepository';

export class CreateMaterialService {
  constructor(private repository: MaterialRepository) {}

  async execute(data: CreateMaterialDTO) {
    if (!data.title || !data.external_url) {
      throw new Error("Title and external_url are required");
    }
    return this.repository.create(data);
  }
}
