import { Request, Response } from "express";
import { MyAllMaterialsService } from "../../services/student_groups/MyAllMaterialsService";

class MyAllMaterialsController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 20;

    const myAllMaterialsService = new MyAllMaterialsService();

    const materials = await myAllMaterialsService.execute(user_id, page, limit);

    return res.json(materials);
  }
}

export { MyAllMaterialsController };
