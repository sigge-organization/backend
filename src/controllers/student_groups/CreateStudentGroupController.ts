import { Request, Response } from 'express';
import { CreateStudentGroupService } from '../../services/student_groups/CreateStudentGroupService';
import { StudentGroupRepository } from '../../repositories/student_groups/StudentGroupRepository';

export class CreateStudentGroupController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { theme, university_course, description, modality } = req.body;

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
        modality
      });

      return res.status(201).json(group);
    } catch (error: any) {
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao criar grupo de estudos.' });
    }
  }
}
