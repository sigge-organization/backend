import { StudentGroupRepository, CreateStudentGroupDTO } from '../../repositories/student_groups/StudentGroupRepository';

export class CreateStudentGroupService {
  constructor(private repository: StudentGroupRepository) {}

  async execute(data: CreateStudentGroupDTO) {
    if (!data.theme) {
      throw new Error('O tema do grupo é obrigatório.');
    }
    return this.repository.create(data);
  }
}
