import { StudentGroupRepository, UpdateStudentGroupDTO } from '../../repositories/student_groups/StudentGroupRepository';

export class UpdateStudentGroupService {
  constructor(private repository: StudentGroupRepository) {}

  async execute(id: string, data: UpdateStudentGroupDTO) {
    const group = await this.repository.findById(id);
    if (!group) {
      throw new Error('Grupo de estudos não encontrado.');
    }
    return this.repository.update(id, data);
  }
}
