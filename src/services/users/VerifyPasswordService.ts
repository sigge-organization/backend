import { prisma } from '../../repositories/users/AuthUserRepository';
import { compare } from 'bcryptjs';

export class VerifyPasswordService {
  async execute({ userId, currentPassword }: { userId: string, currentPassword: string }) {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const passwordMatch = await compare(currentPassword, user.password);
    return { valid: passwordMatch };
  }
}
