import { Request, Response } from "express";
import { EditUserService } from "../../services/users/EditUserService";

export class EditUserController {
  async handle(req: Request, res: Response) {
    const userId = req.user_id;
    const { name, email, password } = req.body;

    const editUserService = new EditUserService();

     if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

    try {
      const user = await editUserService.execute({
        userId,
        name,
        email,
        password,
      });

      return res.json(user);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}