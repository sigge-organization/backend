import * as bcrypt from 'bcryptjs';
import { CreateUserRepository, CreateUserDTO } from '../../repositories/users/CreateUserRepository';

export class CreateUserService {
  private repository: CreateUserRepository;

  constructor(repository: CreateUserRepository) {
    this.repository = repository;
  }

  async execute({ name, email, password, course }: CreateUserDTO) {
    const userAlreadyExists = await this.repository.findByEmail(email);

    if (userAlreadyExists) {
      throw new Error('Usuário já cadastrado com este e-mail.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await this.repository.create({
      name,
      email,
      password: hashedPassword,
      course
    });

    const { password: _, ...userWithoutPassword } = user;
    
    return userWithoutPassword;
  }
}