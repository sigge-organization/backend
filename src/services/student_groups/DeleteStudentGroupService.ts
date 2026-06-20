import { StudentGroupRepository } from '../../repositories/student_groups/StudentGroupRepository';

export class DeleteStudentGroupService {
  constructor(private repository: StudentGroupRepository) {}

  async execute(id: string) {
    const group = await this.repository.findById(id);
    if (!group) {
      throw new Error('Grupo de estudos não encontrado.');
    }
    return this.repository.delete(id);
  }
}
