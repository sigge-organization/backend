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


export class AuthUserService {
    private repository: AuthUserRepository;
    private jwtSecret: string;

    constructor(repository: AuthUserRepository) {
        this.repository = repository;
        this.jwtSecret = process.env.JWT_SECRET || 'fallback_secret';
    }

    async execute({ email, password }: AuthRequest): Promise<AuthResponse> {
    const user = await this.repository.findByEmail(email);

    if (!user) {
      throw new Error('Credenciais inválidas: Email ou senha incorretos.');
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw new Error('Credenciais inválidas: Email ou senha incorretos.');
    }

    const token = jwt.sign(
      { userId: user.id},
      this.jwtSecret,
      { expiresIn: '7d' }
    );

    const { password: _, ...userInfo } = user;

    return {
      user: userInfo,
      token,
    };
  }
}