import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import prisma from "../data/prismaClient.js";

type RegisterInput = {
  username: string;
  email: string;
  password: string;
  course?: string;
};

type LoginInput = {
  email: string;
  password: string;
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

  async login({ email, password }: LoginInput) {
    const user = await prisma.users.findUnique({
      where: { email },
    });

    if (!user || !user.password) {
      const error = new Error("Invalid email or password") as HttpError;
      error.statusCode = 401;
      throw error;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      const error = new Error("Invalid email or password") as HttpError;
      error.statusCode = 401;
      throw error;
    }

    const token = jwt.sign(
      { id: user.id, username: user.username },
      process.env.JWT_SECRET || "default_secret",
      { expiresIn: "1d" }
    );

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        course: user.course,
      },
      token,
    };
  }
}

export default new AuthService();
