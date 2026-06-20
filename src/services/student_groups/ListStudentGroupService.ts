import { StudentGroupRepository } from '../../repositories/student_groups/StudentGroupRepository';

export class ListStudentGroupService {
  constructor(private repository: StudentGroupRepository) {}

  async execute(userId: string) {
    return this.repository.findAll(userId);
  }
}
