// src/prisma/index.ts
import { PrismaClient } from '../../generated/prisma';
import type { Users } from '../../generated/prisma';
const prisma = new PrismaClient();

export { prisma };


type AuthUser = Pick<Users, 'id' | 'email' | 'password' | 'name' | 'course' >;

export class AuthUserRepository {
  async findByEmail(email: string): Promise<AuthUser | null> {
    const user = await prisma.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        course: true,
      },
    });
    
    return user;
  }
}

