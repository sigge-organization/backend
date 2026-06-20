// src/services/users/RequestPasswordResetService.ts
import { prisma } from '../../repositories/users/AuthUserRepository';
import { sendPasswordResetEmail } from '../../utils/EmailSender';

export class ForgotPasswordService {
  async execute({ email }: { email: string }) {
    const user = await prisma.users.findUnique({ where: { email } });

    if (!user) {
      // Retorna sucesso mesmo sem usuário (segurança: não revela se email existe)
      return { message: "Se o e-mail existir, você receberá o código." };
    }

    // Gera código de 6 dígitos
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 1000 * 60 * 60); // 1 hora

    await prisma.users.update({
      where: { email },
      data: {
        passwordResetCode: resetCode,
        passwordResetExpires: expiresAt,
      },
    });

    // Usa a função do EmailSender.ts
    await sendPasswordResetEmail(email, user.name ?? 'Usuário', resetCode);

    return { message: "E-mail de recuperação enviado com sucesso." };
  }
}