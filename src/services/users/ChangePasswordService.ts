import { prisma } from '../../repositories/users/AuthUserRepository';
import { hash, compare } from 'bcryptjs';

export class ChangePasswordService {
  async execute({ userId, currentPassword, newPassword }: any) {
    const user = await prisma.users.findUnique({
      where: { id: userId }
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const passwordMatch = await compare(currentPassword, user.password);
    if (!passwordMatch) {
      throw new Error("Senha atual incorreta.");
    }

    const newPasswordHash = await hash(newPassword, 10);

    await prisma.users.update({
      where: { id: userId },
      data: { password: newPasswordHash }
    });

    return { success: true };
  }
}
