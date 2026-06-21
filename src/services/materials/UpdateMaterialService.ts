import { MaterialRepository, CreateMaterialDTO } from '../../repositories/materials/MaterialRepository';

export class UpdateMaterialService {
  constructor(private materialRepository: MaterialRepository) {}

  async execute(id: string, userId: string, data: Partial<CreateMaterialDTO>) {
    const material = await this.materialRepository.findById(id);

    if (!material) {
      throw new Error('Material not found');
    }

    if (material.uploadedById !== userId) {
      throw new Error('You can only update materials that you created');
    }

    return this.materialRepository.update(id, data);
  }
}
