import { Request, Response } from 'express';
import { ListMaterialsService } from '../../services/materials/ListMaterialsService';
import { MaterialRepository } from '../../repositories/materials/MaterialRepository';

export class ListMaterialsController {
  async handle(req: Request, res: Response) {
    const studentGroupId = req.params.studentGroupId as string;
    const page = req.query.page ? parseInt(req.query.page as string, 10) : 1;
    const limit = req.query.limit ? parseInt(req.query.limit as string, 10) : 20;

    try {
      const repository = new MaterialRepository();
      const service = new ListMaterialsService(repository);
      const materials = await service.execute(studentGroupId, page, limit);
      return res.json(materials);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
