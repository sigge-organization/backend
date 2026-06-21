import { Request, Response } from "express";
import { MyAllMaterialsService } from "../../services/student_groups/MyAllMaterialsService";

class MyAllMaterialsController {
  async handle(req: Request, res: Response) {
    const user_id = req.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    const myAllMaterialsService = new MyAllMaterialsService();

    const materials = await myAllMaterialsService.execute(user_id);

    return res.json(materials);
  }
}

export { MyAllMaterialsController };
