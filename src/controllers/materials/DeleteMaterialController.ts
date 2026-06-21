import { Request, Response } from 'express';
import { DeleteMaterialService } from '../../services/materials/DeleteMaterialService';
import { MaterialRepository } from '../../repositories/materials/MaterialRepository';

export class DeleteMaterialController {
  async handle(req: Request, res: Response) {
    const id = req.params.materialId as string;
    const userId = req.user_id;

    if (!userId) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const repository = new MaterialRepository();
      const service = new DeleteMaterialService(repository);
      await service.execute(id, userId);

      return res.status(204).send();
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
