import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt.js";

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

function unauthorizedError(): HttpError {
  const error = new Error("Invalid email or password") as HttpError;
  error.statusCode = 401;
  return error;
}

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

      select: {
        id: true,
        username: true,
        email: true,
        password: true,
        course: true,
        created_at: true,
      },
    });

    if (!user?.password) {
      throw unauthorizedError();
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      throw unauthorizedError();
    }

    const token = jwt.sign({ sub: user.id }, getJwtSecret(), {
      expiresIn: "7d",
    });

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        course: user.course,
        created_at: user.created_at,
      },
      token,
    };
  }

  async getProfile(userId: number) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
      select: {
        id: true,
        username: true,
        email: true,
        course: true,
        created_at: true,
      },
    });

    if (!user) {
      const error = new Error("User not found") as HttpError;
      error.statusCode = 404;
      throw error;
    }

    return user;
  
  }

  async updateProfile(userId: number, data: { username?: string; course?: string; email?: string }) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user) {
      const error = new Error("User not found") as HttpError;
      error.statusCode = 404;
      throw error;
    }

    if (data.email && data.email !== user.email) {
      const emailExists = await prisma.users.findUnique({
        where: { email: data.email },
      });

      if (emailExists) {
        const error = new Error("Email already in use") as HttpError;
        error.statusCode = 409;
        throw error;
      }
    }

    return await prisma.users.update({
      where: { id: userId },
      data,
      select: {
        id: true,
        username: true,
        email: true,
        course: true,
        created_at: true,
      },
    });
  }

  async verifyPassword(userId: number, currentPassword: string) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      return { valid: false };
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);
    return { valid: passwordMatch };
  }

  async changePassword(userId: number, currentPassword: string, newPassword: string) {
    const user = await prisma.users.findUnique({
      where: { id: userId },
    });

    if (!user || !user.password) {
      const error = new Error("User not found") as HttpError;
      error.statusCode = 404;
      throw error;
    }

    const passwordMatch = await bcrypt.compare(currentPassword, user.password);

    if (!passwordMatch) {
      const error = new Error("Senha atual incorreta") as HttpError;
      error.statusCode = 401;
      throw error;
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await prisma.users.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true };
  }
}

export default new AuthService();
