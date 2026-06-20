import { Request, Response } from 'express';
import { CreateMaterialService } from '../../services/materials/CreateMaterialService';
import { MaterialRepository } from '../../repositories/materials/MaterialRepository';

export class CreateMaterialController {
  async handle(req: Request, res: Response) {
    const studentGroupId = req.params.studentGroupId as string;
    const { title, external_url } = req.body;
    const user_id = req.user_id;

    if (!user_id) return res.status(401).json({ error: 'Unauthorized' });

    try {
      const repository = new MaterialRepository();
      const service = new CreateMaterialService(repository);
      const material = await service.execute({
        studentGroupId,
        uploadedById: user_id,
        title,
        external_url
      });
      return res.status(201).json(material);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
