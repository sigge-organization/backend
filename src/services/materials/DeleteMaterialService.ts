import { MaterialRepository } from '../../repositories/materials/MaterialRepository';

export class DeleteMaterialService {
  constructor(private materialRepository: MaterialRepository) {}

  async execute(id: string, userId: string) {
    const material = await this.materialRepository.findById(id);

    if (!material) {
      throw new Error('Material not found');
    }

    if (material.uploadedById !== userId) {
      throw new Error('You can only delete materials that you created');
    }

    return this.materialRepository.softDelete(id);
  }
}
