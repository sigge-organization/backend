import { StudentGroupRepository } from '../../repositories/student_groups/StudentGroupRepository';

interface JoinGroupRequest {
  userId: string;
  joinCode: string;
  password?: string;
}

export class JoinStudentGroupService {
  constructor(private repository: StudentGroupRepository) {}

  async execute({ userId, joinCode, password }: JoinGroupRequest) {
    const group = await this.repository.findByJoinCode(joinCode);

    if (!group) {
      throw new Error("Grupo não encontrado ou código inválido.");
    }

    if (group.password && group.password !== password) {
      throw new Error("Senha incorreta para este grupo.");
    }

    const isMember = await this.repository.isMember(group.id, userId);

    if (isMember) {
      throw new Error("Você já é membro deste grupo.");
    }

    await this.repository.addMember(group.id, userId);

    return group;
  }
}
