import { beforeEach, describe, expect, it, vi } from "vitest";
import bcrypt from "bcrypt";
import authService from "./auth.service.js";
import prisma from "../data/prismaClient.js";
vi.mock("bcrypt");
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
            vi.mocked(prisma.users.create).mockResolvedValue(expectedCreatedUser);
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
            });
            await expect(authService.register(mockUserData)).rejects.toThrow("Email already registered");
            try {
                await authService.register(mockUserData);
            }
            catch (error) {
                expect(error.statusCode).toBe(409);
            }
            expect(bcrypt.hash).not.toHaveBeenCalled();
            expect(prisma.users.create).not.toHaveBeenCalled();
        });
    });
});
