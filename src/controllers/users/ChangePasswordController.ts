import { Request, Response } from "express";
import { ChangePasswordService } from "../../services/users/ChangePasswordService";

export class ChangePasswordController {
  async handle(req: Request, res: Response) {
    const userId = req.user_id;
    const { currentPassword, newPassword } = req.body;

    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado." });
    }

    try {
      const service = new ChangePasswordService();
      const result = await service.execute({ userId, currentPassword, newPassword });
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
