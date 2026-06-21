import { Request, Response } from "express";
import { MyRecentMaterialsService } from "../../services/student_groups/MyRecentMaterialsService";

class MyRecentMaterialsController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const myRecentMaterialsService = new MyRecentMaterialsService();

    const materials = await myRecentMaterialsService.execute(user_id);

    return res.json(materials);
  }
}

export { MyRecentMaterialsController };
