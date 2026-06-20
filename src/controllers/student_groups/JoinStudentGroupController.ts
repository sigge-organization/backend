import { Request, Response } from 'express';
import { JoinStudentGroupService } from '../../services/student_groups/JoinStudentGroupService';
import { StudentGroupRepository } from '../../repositories/student_groups/StudentGroupRepository';

export class JoinStudentGroupController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { joinCode, password } = req.body;
    const user_id = req.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (!joinCode) {
      return res.status(400).json({ error: 'O código do grupo é obrigatório.' });
    }

    try {
      const repository = new StudentGroupRepository();
      const service = new JoinStudentGroupService(repository);

      const group = await service.execute({
        userId: user_id,
        joinCode,
        password
      });

      return res.status(200).json(group);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}
