import { Request, Response } from 'express';
import { GetMeService } from '../../services/users/GetMeService';

export class GetMeController {
    async handle(req: Request, res: Response): Promise<Response> {
        const userId = req.user_id;

        if (!userId) {
            return res.status(401).json({ error: 'Usuário não autenticado.' });
        }

        try {
            const service = new GetMeService();
            const user = await service.execute(userId);

            return res.status(200).json(user);

        } catch (error: any) {
            console.error('Erro ao buscar dados do usuário logado:', error);
            return res.status(500).json({ error: 'Erro interno do servidor ao buscar dados do usuário.' });
        }
    }
}