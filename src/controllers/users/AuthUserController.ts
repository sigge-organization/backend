import { Request, Response } from 'express';
import { AuthUserService } from '../../services/users/AuthUserService';
import { AuthUserRepository } from '../../repositories/users/AuthUserRepository';

export class AuthUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { email, password, rememberMe } = req.body; 

    try {
      const repository = new AuthUserRepository();
      const service = new AuthUserService(repository);

      const result = await service.execute({ email, password });

      const isProduction = process.env.NODE_ENV === 'production';

      const cookieOptions = {
        httpOnly: true, 
        secure: isProduction,
        sameSite: isProduction ? 'none' as const : 'lax' as const, 
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined, 
      };

      res.cookie('auth_token', result.token, cookieOptions);

      return res.status(200).json({ 
        user: result.user,
        token: result.token 
      });

    } catch (error: any) {
      if (error.message.includes('Credenciais inválidas')) {
        return res.status(401).json({ error: error.message });
      }
      console.error(error);
      return res.status(500).json({ error: 'Erro interno do servidor.' });
    }
  }
}
