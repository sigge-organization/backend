import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockFindUnique = vi.hoisted(() => vi.fn());

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(function () {
    return { users: { findUnique: mockFindUnique } };
  }),
}));

import { AuthUserRepository } from './AuthUserRepository';

const fakeUser = {
  id: 'user-1',
  email: 'joao@mail.com',
  password: 'hashed-password',
  name: 'João',
  course: 'Engenharia',
};

describe('AuthUserRepository', () => {
  let repository: AuthUserRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new AuthUserRepository();
  });

  it('deve buscar o usuário pelo email com select incluindo password', async () => {
    mockFindUnique.mockResolvedValue(fakeUser);

    await repository.findByEmail('joao@mail.com');

    expect(mockFindUnique).toHaveBeenCalledWith({
      where: { email: 'joao@mail.com' },
      select: {
        id: true,
        email: true,
        password: true,
        name: true,
        course: true,
      },
    });
  });

  it('deve retornar o usuário quando encontrado', async () => {
    mockFindUnique.mockResolvedValue(fakeUser);

    const result = await repository.findByEmail('joao@mail.com');

    expect(result).toEqual(fakeUser);
  });

  it('deve retornar null quando o email não existe', async () => {
    mockFindUnique.mockResolvedValue(null);

    const result = await repository.findByEmail('inexistente@mail.com');

    expect(result).toBeNull();
  });

  it('deve incluir o campo password no select — sem ele a autenticação falha', async () => {
    mockFindUnique.mockResolvedValue(fakeUser);

    await repository.findByEmail('joao@mail.com');

    const selectArg = mockFindUnique.mock.calls[0][0].select;
    expect(selectArg.password).toBe(true);
  });
});
