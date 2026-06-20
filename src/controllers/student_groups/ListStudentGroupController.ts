import { Request, Response } from 'express';
import { ListStudentGroupService } from '../../services/student_groups/ListStudentGroupService';
import { StudentGroupRepository } from '../../repositories/student_groups/StudentGroupRepository';

export class ListStudentGroupController {
  async handle(req: Request, res: Response): Promise<Response> {
    try {
      const userId = req.user_id;
      if (!userId) {
        return res.status(401).json({ error: 'Usuário não autenticado.' });
      }

      const repository = new StudentGroupRepository();
      const service = new ListStudentGroupService(repository);

      const groups = await service.execute(userId);

      return res.status(200).json(groups);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao listar grupos de estudos.' });
    }
  }
}
