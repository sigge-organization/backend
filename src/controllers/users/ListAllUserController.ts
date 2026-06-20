import { Request, Response } from 'express';
import { ListAllUsersService } from '../../services/users/ListAllUsersService';

export class ListAllUsersController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const service = new ListAllUsersService();
      const users = await service.execute();

      return res.status(200).json({
        message: 'Lista de usuários retornada com sucesso.',
        results: users,
      });

    } catch (error: any) {
      console.error('Erro ao buscar lista de usuários:', error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}