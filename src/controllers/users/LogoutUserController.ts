// src/controllers/users/LogoutUserController.ts
import { Request, Response } from 'express';

export class LogoutUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const isProduction = process.env.NODE_ENV === 'production';

    // As opções precisam ser exatamente as mesmas usadas na hora de CRIAR o cookie
    const cookieOptions = {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? 'none' as const : 'lax' as const,
    };

    // Manda o navegador apagar o cookie
    res.clearCookie('auth_token', cookieOptions);

    return res.status(200).json({ message: 'Logout realizado com sucesso.' });
  }
}