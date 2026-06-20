// src/services/users/ListAllUsersService.ts
import { prisma } from '../../repositories/users/AuthUserRepository';

interface UserListItem {
  id: string;
  email: string;
  name: string | null;
  course: string | null;
}

export class ListAllUsersService {
  /**
   * Retorna uma lista de todos os usuários, excluindo a senha.
   * depois criar um filtro para listar os usuários por grupos
   */
  async execute(): Promise<UserListItem[]> {
    const users = await prisma.users.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        course: true,
      },
      orderBy: {
        name: 'asc',
      },
    });

    return users;
  }
}