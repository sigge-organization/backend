import { prisma } from '../../repositories/users/AuthUserRepository';
import { hash } from "bcryptjs";

interface ResetPasswordRequest {
  email: string;
  code: string;
  password: string;
  confirmPassword: string;
}

export class ResetPasswordService {
  async execute({ email, code, password, confirmPassword }: ResetPasswordRequest) {
    if (password !== confirmPassword) {
      throw new Error("As senhas não coincidem.");
    }

    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    if (!user.passwordResetCode || user.passwordResetCode !== code) {
      throw new Error("Código de verificação inválido.");
    }

    if (!user.passwordResetExpires || new Date() > user.passwordResetExpires) {
      throw new Error("Código de verificação expirado.");
    }

    const hashedPassword = await hash(password, 10);

    await prisma.users.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetCode: null,
        passwordResetExpires: null,
      },
    });

    return { message: "Senha redefinida com sucesso." };
  }
}