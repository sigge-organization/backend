// src/controllers/users/AuthUserController.ts
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

      // Detecta se está em produção (Vercel/Heroku) ou desenvolvimento (localhost)
      const isProduction = process.env.NODE_ENV === 'production';

      const cookieOptions = {
        httpOnly: true, 
        secure: isProduction, // true em produção (HTTPS), false no localhost (HTTP)
        // sameSite 'none' exige HTTPS. No localhost usamos 'lax'
        sameSite: isProduction ? 'none' as const : 'lax' as const, 
        maxAge: rememberMe ? 7 * 24 * 60 * 60 * 1000 : undefined, 
      };

      res.cookie('auth_token', result.token, cookieOptions);

      // RETORNAMOS O TOKEN NO JSON TAMBÉM! 
      // Assim o seu authServices.ts vai voltar a salvar no localStorage (Fallback)
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
