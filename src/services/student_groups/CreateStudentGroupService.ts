import { StudentGroupRepository, CreateStudentGroupDTO } from '../../repositories/student_groups/StudentGroupRepository';

export class CreateStudentGroupService {
  constructor(private repository: StudentGroupRepository) {}

  async execute(data: Omit<CreateStudentGroupDTO, 'joinCode'>) {
    if (!data.theme) {
      throw new Error('O tema do grupo é obrigatório.');
    }

    const generateCode = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
      let result = '';
      for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
      }
      return result;
    };

    let joinCode = "";
    let isUnique = false;
    let attempts = 0;
    const maxAttempts = 20;

    // Generate a unique 6-character alphanumeric code
    while (!isUnique && attempts < maxAttempts) {
      joinCode = generateCode();
      const existingGroup = await this.repository.findByJoinCode(joinCode);
      if (!existingGroup) {
        isUnique = true;
      }
      attempts++;
    }

    if (!isUnique) {
      throw new Error('Não foi possível gerar um código único para o grupo. Tente novamente.');
    }

    return this.repository.create({ ...data, joinCode });
  }
}
