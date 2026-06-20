import { Request, Response } from 'express';
import { CreateUserService } from '../../services/users/CreateUserService';
import { CreateUserRepository } from '../../repositories/users/CreateUserRepository';

export class CreateUserController {
  async handle(req: Request, res: Response): Promise<Response> {
    const { name, email, password, course } = req.body;

    // Validação básica
    if (!email || !password) {
      return res.status(400).json({ error: 'E-mail e senha são obrigatórios.' });
    }

    try {
      const repository = new CreateUserRepository();
      const service = new CreateUserService(repository);

      const user = await service.execute({
        name,
        email,
        password,
        course
      });

      return res.status(201).json(user);

    } catch (error: any) {
      if (error.message.includes('já cadastrado')) {
        return res.status(409).json({ error: error.message });
      }
      
      console.error(error);
      return res.status(500).json({ error: 'Erro interno ao criar usuário.' });
    }
  }
}