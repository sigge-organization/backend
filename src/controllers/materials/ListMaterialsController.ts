import { Request, Response } from 'express';
import { ListMaterialsService } from '../../services/materials/ListMaterialsService';
import { MaterialRepository } from '../../repositories/materials/MaterialRepository';

export class ListMaterialsController {
  async handle(req: Request, res: Response) {
    const studentGroupId = req.params.studentGroupId as string;

    try {
      const repository = new MaterialRepository();
      const service = new ListMaterialsService(repository);
      const materials = await service.execute(studentGroupId);
      return res.json(materials);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
