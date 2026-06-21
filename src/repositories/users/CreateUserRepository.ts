import { prisma } from './AuthUserRepository'; // Reaproveitando a instância do prisma
import { Users } from '@prisma/client';

export interface CreateUserDTO {
  name?: string;
  email: string;
  password: string;
  course?: string;
}

export class CreateUserRepository {
  async findByEmail(email: string): Promise<Users | null> {
    return await prisma.users.findUnique({
      where: { email }
    });
  }

  async create({ name, email, password, course }: CreateUserDTO): Promise<Users> {
    const user = await prisma.users.create({
      data: {
        name,
        email,
        password,
        course
      }
    });

    return user;
  }
}