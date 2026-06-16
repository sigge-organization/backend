// src/services/users/AuthUserService.ts
import * as bcrypt from 'bcryptjs';
import * as jwt from 'jsonwebtoken';
import { AuthUserRepository } from '../../repositories/users/AuthUserRepository';
import 'dotenv/config';


interface AuthRequest{
    email: string;
    password: string;
}

interface AuthResponse{
    user: {
        id: string;
        email: string;
        name: string | null;
    };
    token: string;
}


// Continuar alterando essa classe.  
export class AuthUserService {
    private repository: AuthUserRepository;
    private jwtSecret: string;

    constructor(repository: AuthUserRepository) {
        this.repository = repository;
        this.jwtSecret = process.env.JWT_SECRET || 'fallback_secret'; // Pega do .env
    }

    async execute({ email, password }: AuthRequest): Promise<AuthResponse> {
    const user = await this.repository.findByEmail(email);

    // 1. Verifica se o usuário existe
    if (!user) {
      throw new Error('Credenciais inválidas: Email ou senha incorretos.');
    }

    // 2. Compara a senha (hashed)
    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Credenciais inválidas: Email ou senha incorretos.');
    }

    // 3. Gera o Token JWT
    const token = jwt.sign(
      { userId: user.id},
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    // 4. Retorna dados do usuário e token
    const { password: _, ...userInfo } = user; // Remove a senha do retorno

    return {
      user: userInfo,
      token,
    };
  }
}