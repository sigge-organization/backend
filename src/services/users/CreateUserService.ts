// src/services/users/CreateUserService.ts
import * as bcrypt from 'bcryptjs';
import { CreateUserRepository, CreateUserDTO } from '../../repositories/users/CreateUserRepository';

export class CreateUserService {
  private repository: CreateUserRepository;

  constructor(repository: CreateUserRepository) {
    this.repository = repository;
  }

  async execute({ name, email, password, course }: CreateUserDTO) {
    // 1. Verificar se o e-mail já está cadastrado
    const userAlreadyExists = await this.repository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error('Usuário já cadastrado com este e-mail.');
    }

    // 2. Criptografar a senha
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Salvar no banco de dados
    const user = await this.repository.create({
      name,
      email,
      password: hashedPassword,
      course
    });

    // 4. Retornar dados do usuário (sem a senha)
    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  }
}