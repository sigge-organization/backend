import { Request, Response } from 'express';
import { UpdateMaterialService } from '../../services/materials/UpdateMaterialService';
import { MaterialRepository } from '../../repositories/materials/MaterialRepository';

export class UpdateMaterialController {
  async handle(req: Request, res: Response) {
    const id = req.params.materialId as string;
    const data = req.body;
    const userId = req.user_id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const repository = new MaterialRepository();
      const service = new UpdateMaterialService(repository);
      const updatedMaterial = await service.execute(id, userId, data);

      return res.json(updatedMaterial);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
