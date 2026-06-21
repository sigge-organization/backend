import { prisma } from '../../repositories/users/AuthUserRepository';
import { hash } from "bcryptjs";

interface EditUserRequest {
  userId: string;
  name?: string;
  email?: string;
  password?: string;
  course?: string;
}

export class EditUserService {
  async execute({ userId, name, email, password, course }: EditUserRequest) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new Error("Usuário não encontrado.");
    }

    const data: any = {};

    if (name) {
      if (name.length < 3 || name.length > 100) {
        throw new Error("O nome deve ter entre 3 e 100 caracteres.");
      }
      data.name = name;
    }
    
    if (course !== undefined) {
      if (course && course.length > 100) {
        throw new Error("O curso deve ter no máximo 100 caracteres.");
      }
      data.course = course;
    }
    
    if (email && email !== user.email) {
      const emailExists = await prisma.users.findUnique({
        where: { email },
      });
      if (emailExists) {
        throw new Error("E-mail já está em uso.");
      }
      data.email = email;
    }

    if (password) {
      data.password = await hash(password, 10);
    }

    const updatedUser = await prisma.users.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        name: true,
        email: true,
        course: true,
        },
    });

    return updatedUser;
  }
}