import { Request, Response } from 'express';
import { UpdateStudentGroupService } from '../../services/student_groups/UpdateStudentGroupService';
import { StudentGroupRepository } from '../../repositories/student_groups/StudentGroupRepository';

export class UpdateStudentGroupController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;
    const { theme, university_course, description, modality } = req.body;

    try {
      const repository = new StudentGroupRepository();
      const service = new UpdateStudentGroupService(repository);

      const group = await service.execute(id, {
        theme,
        university_course,
        description,
        modality
      });

      return res.status(200).json(group);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao atualizar grupo de estudos.' });
    }
  }
}
