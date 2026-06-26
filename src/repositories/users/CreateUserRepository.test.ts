import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFindUnique = vi.hoisted(() => vi.fn());
const mockCreate = vi.hoisted(() => vi.fn());

// CreateUserRepository reutiliza a instância `prisma` exportada por AuthUserRepository.
// Mockar @prisma/client aqui intercepta o PrismaClient que AuthUserRepository instancia,
// fazendo com que o `prisma` compartilhado também seja o mock.
vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(function () {
    return { users: { findUnique: mockFindUnique, create: mockCreate } };
  }),
}));

import { CreateUserRepository } from './CreateUserRepository';

const fakeUser = {
  id: 'user-1',
  name: 'João',
  email: 'joao@mail.com',
  password: 'hashed-password',
  course: 'Engenharia',
  created_at: new Date(),
  updated_at: new Date(),
};

describe('CreateUserRepository', () => {
  let repository: CreateUserRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new CreateUserRepository();
  });

  describe('findByEmail', () => {
    it('deve buscar por email usando findUnique', async () => {
      mockFindUnique.mockResolvedValue(fakeUser);

      await repository.findByEmail('joao@mail.com');

      expect(mockFindUnique).toHaveBeenCalledWith({
        where: { email: 'joao@mail.com' },
      });
    });

    it('deve retornar o usuário quando encontrado', async () => {
      mockFindUnique.mockResolvedValue(fakeUser);

      const result = await repository.findByEmail('joao@mail.com');

      expect(result).toEqual(fakeUser);
    });

    it('deve retornar null quando o email não existe', async () => {
      mockFindUnique.mockResolvedValue(null);

      const result = await repository.findByEmail('novo@mail.com');

      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('deve criar o usuário com todos os campos informados', async () => {
      mockCreate.mockResolvedValue(fakeUser);

      await repository.create({
        name: 'João',
        email: 'joao@mail.com',
        password: 'hashed-password',
        course: 'Engenharia',
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          name: 'João',
          email: 'joao@mail.com',
          password: 'hashed-password',
          course: 'Engenharia',
        },
      });
    });

    it('deve criar o usuário sem os campos opcionais', async () => {
      const userSemOpcionals = { ...fakeUser, name: undefined, course: undefined };
      mockCreate.mockResolvedValue(userSemOpcionals);

      await repository.create({
        email: 'novo@mail.com',
        password: 'hashed-password',
      });

      expect(mockCreate).toHaveBeenCalledWith({
        data: {
          name: undefined,
          email: 'novo@mail.com',
          password: 'hashed-password',
          course: undefined,
        },
      });
    });

    it('deve retornar o usuário criado', async () => {
      mockCreate.mockResolvedValue(fakeUser);

      const result = await repository.create({
        name: 'João',
        email: 'joao@mail.com',
        password: 'hashed-password',
      });

      expect(result).toEqual(fakeUser);
    });
  });
});
