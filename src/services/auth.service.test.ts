import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import authService from "./auth.service.js";
import prisma from "../data/prismaClient.js";

vi.mock("bcrypt");
vi.mock("jsonwebtoken", () => ({
  default: {
    sign: vi.fn(() => "mock-jwt-token"),
  },
}));
vi.mock("../data/prismaClient.js", () => ({
  default: {
    users: {
      findUnique: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe("AuthService", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    process.env.JWT_SECRET = "test-secret";
  });

  describe("register", () => {
    const mockUserData = {
      username: "testuser",
      email: "test@example.com",
      password: "password123",
      course: "Computer Science",
    };

    it("should successfully register a new user", async () => {
      vi.mocked(prisma.users.findUnique).mockResolvedValue(null);
      vi.mocked(bcrypt.hash).mockImplementation(async () => "hashedPassword123");

      const expectedCreatedUser = {
        id: 1,
        username: mockUserData.username,
        email: mockUserData.email,
        course: mockUserData.course,
        created_at: new Date(),
      };

      vi.mocked(prisma.users.create).mockResolvedValue(expectedCreatedUser as never);

      const result = await authService.register(mockUserData);

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { email: mockUserData.email },
      });
      expect(bcrypt.hash).toHaveBeenCalledWith(mockUserData.password, 10);
      expect(prisma.users.create).toHaveBeenCalledWith({
        data: {
          username: mockUserData.username,
          email: mockUserData.email,
          password: "hashedPassword123",
          course: mockUserData.course,
        },
        select: {
          id: true,
          username: true,
          email: true,
          course: true,
          created_at: true,
        },
      });
      expect(result).toEqual(expectedCreatedUser);
    });

    it("should throw an error if the email is already registered", async () => {
      vi.mocked(prisma.users.findUnique).mockResolvedValue({
        id: 1,
        email: mockUserData.email,
      } as never);

      await expect(authService.register(mockUserData)).rejects.toThrow(
        "Email already registered",
      );

      try {
        await authService.register(mockUserData);
      } catch (error) {
        expect((error as { statusCode?: number }).statusCode).toBe(409);
      }

      expect(bcrypt.hash).not.toHaveBeenCalled();
      expect(prisma.users.create).not.toHaveBeenCalled();
    });
  });

  describe("login", () => {
    const loginData = {
      email: "test@example.com",
      password: "password123",
    };

    const storedUser = {
      id: 1,
      username: "testuser",
      email: loginData.email,
      password: "hashedPassword123",
      course: "Computer Science",
      created_at: new Date(),
    };

    it("should successfully authenticate a user", async () => {
      vi.mocked(prisma.users.findUnique).mockResolvedValue(storedUser as never);
      vi.mocked(bcrypt.compare).mockImplementation(async () => true);

      const result = await authService.login(loginData);

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { email: loginData.email },
        select: {
          id: true,
          username: true,
          email: true,
          password: true,
          course: true,
          created_at: true,
        },
      });
      expect(bcrypt.compare).toHaveBeenCalledWith(
        loginData.password,
        storedUser.password,
      );
      expect(jwt.sign).toHaveBeenCalledWith(
        { sub: storedUser.id },
        "test-secret",
        { expiresIn: "7d" },
      );
      expect(result).toEqual({
        user: {
          id: storedUser.id,
          username: storedUser.username,
          email: storedUser.email,
          course: storedUser.course,
          created_at: storedUser.created_at,
        },
        token: "mock-jwt-token",
      });
    });

    it("should throw an error if the user does not exist", async () => {
      vi.mocked(prisma.users.findUnique).mockResolvedValue(null);

      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid email or password",
      );

      try {
        await authService.login(loginData);
      } catch (error) {
        expect((error as { statusCode?: number }).statusCode).toBe(401);
      }

      expect(bcrypt.compare).not.toHaveBeenCalled();
      expect(jwt.sign).not.toHaveBeenCalled();
    });

    it("should throw an error if the password is invalid", async () => {
      vi.mocked(prisma.users.findUnique).mockResolvedValue(storedUser as never);
      vi.mocked(bcrypt.compare).mockImplementation(async () => false);

      await expect(authService.login(loginData)).rejects.toThrow(
        "Invalid email or password",
      );

      expect(jwt.sign).not.toHaveBeenCalled();
    });
  });

  describe("getProfile", () => {
    it("should return the user profile", async () => {
      const user = {
        id: 1,
        username: "testuser",
        email: "test@example.com",
        course: "Computer Science",
        created_at: new Date(),
      };

      vi.mocked(prisma.users.findUnique).mockResolvedValue(user as never);

      const result = await authService.getProfile(1);

      expect(prisma.users.findUnique).toHaveBeenCalledWith({
        where: { id: 1 },
        select: {
          id: true,
          username: true,
          email: true,
          course: true,
          created_at: true,
        },
      });
      expect(result).toEqual(user);
    });

    it("should throw an error if the user does not exist", async () => {
      vi.mocked(prisma.users.findUnique).mockResolvedValue(null);

      await expect(authService.getProfile(999)).rejects.toThrow("User not found");

      try {
        await authService.getProfile(999);
      } catch (error) {
        expect((error as { statusCode?: number }).statusCode).toBe(404);
      }
    });
  });
});
