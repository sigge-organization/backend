import { Request, Response } from 'express';
import { DeleteStudentGroupService } from '../../services/student_groups/DeleteStudentGroupService';
import { StudentGroupRepository } from '../../repositories/student_groups/StudentGroupRepository';

export class DeleteStudentGroupController {
  async handle(req: Request, res: Response): Promise<Response> {
    const id = req.params.id as string;

    try {
      const repository = new StudentGroupRepository();
      const service = new DeleteStudentGroupService(repository);

      await service.execute(id);

      return res.status(204).send();
    } catch (error: any) {
      if (error.message.includes('não encontrado')) {
        return res.status(404).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao deletar grupo de estudos.' });
    }
  }
}
