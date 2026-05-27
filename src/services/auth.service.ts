import bcrypt from "bcrypt";
import prisma from "../data/prismaClient.js";

type RegisterInput = {
  username: string;
  email: string;
  password: string;
  course?: string;
};

type HttpError = Error & { statusCode: number };

class AuthService {
  async register({ username, email, password, course }: RegisterInput) {
    const userExists = await prisma.users.findUnique({
      where: { email },
    });

    if (userExists) {
      const error = new Error("Email already registered") as HttpError;
      error.statusCode = 409;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.users.create({
      data: {
        username,
        email,
        password: hashedPassword,
        course,
      },
      select: {
        id: true,
        username: true,
        email: true,
        course: true,
        created_at: true,
      },
    });

    return user;
  }
}

export default new AuthService();
