import { Request, Response } from 'express';
import { CreateStudentGroupService } from '../../services/student_groups/CreateStudentGroupService';
import { StudentGroupRepository } from '../../repositories/student_groups/StudentGroupRepository';

export class CreateStudentGroupController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { theme, university_course, description, modality } = req.body;
    const user_id = req.user_id;

    if (!user_id) {
      return res.status(401).json({ error: 'Usuário não autenticado.' });
    }

    if (!theme) {
      return res.status(400).json({ error: 'O tema do grupo é obrigatório.' });
    }

    try {
      const repository = new StudentGroupRepository();
      const service = new CreateStudentGroupService(repository);

      const group = await service.execute({
        theme,
        university_course,
        description,
        modality,
        creator_id: user_id
      });

      return res.status(201).json(group);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao criar grupo de estudos.' });
    }
  }
}
