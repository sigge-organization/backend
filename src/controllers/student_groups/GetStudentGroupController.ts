import { Request, Response } from 'express';
import { GetStudentGroupService } from '../../services/student_groups/GetStudentGroupService';
import { StudentGroupRepository } from '../../repositories/student_groups/StudentGroupRepository';

export class GetStudentGroupController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    try {
      const repository = new StudentGroupRepository();
      const service = new GetStudentGroupService(repository);

      const group = await service.execute(id);

      return res.status(200).json(group);
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao buscar grupo de estudos.' });
    }
  }
}
