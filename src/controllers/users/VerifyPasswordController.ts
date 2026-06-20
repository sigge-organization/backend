import { Request, Response } from "express";
import { VerifyPasswordService } from "../../services/users/VerifyPasswordService";

export class VerifyPasswordController {
  async handle(req: Request, res: Response) {
    const userId = req.user_id;
    const { currentPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    try {
      const service = new VerifyPasswordService();
      const result = await service.execute({ userId, currentPassword });
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
