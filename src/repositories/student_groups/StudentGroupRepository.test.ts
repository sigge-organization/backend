import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockGroupCreate = vi.hoisted(() => vi.fn());
const mockGroupFindMany = vi.hoisted(() => vi.fn());
const mockGroupFindFirst = vi.hoisted(() => vi.fn());
const mockGroupUpdate = vi.hoisted(() => vi.fn());
const mockMembersCreate = vi.hoisted(() => vi.fn());
const mockMembersFindFirst = vi.hoisted(() => vi.fn());

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(function () {
    return {
      student_Group: {
        create: mockGroupCreate,
        findMany: mockGroupFindMany,
        findFirst: mockGroupFindFirst,
        update: mockGroupUpdate,
      },
      group_Members: {
        create: mockMembersCreate,
        findFirst: mockMembersFindFirst,
      },
    };
  }),
}));

import { StudentGroupRepository } from './StudentGroupRepository';

const fakeGroup = {
  id: 'group-1',
  theme: 'Cálculo I',
  joinCode: 'ABC123',
  deleted_at: null,
};

describe('StudentGroupRepository', () => {
  let repository: StudentGroupRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new StudentGroupRepository();
  });

  describe('create', () => {
    it('deve criar o grupo e adicionar o criador como ADMIN automaticamente', async () => {
      mockGroupCreate.mockResolvedValue(fakeGroup);

      await repository.create({
        theme: 'Cálculo I',
        joinCode: 'ABC123',
        creator_id: 'user-1',
      });

      expect(mockGroupCreate).toHaveBeenCalledWith({
        data: {
          theme: 'Cálculo I',
          joinCode: 'ABC123',
          members: {
            create: { user_id: 'user-1', role: 'ADMIN' },
          },
        },
      });
    });

    it('não deve incluir creator_id nos dados diretos do grupo', async () => {
      mockGroupCreate.mockResolvedValue(fakeGroup);

      await repository.create({ theme: 'Tema', joinCode: 'XYZ', creator_id: 'user-1' });

      const callData = mockGroupCreate.mock.calls[0][0].data;
      expect(callData).not.toHaveProperty('creator_id');
    });
  });

  describe('findAll', () => {
    it('deve filtrar grupos deletados (deleted_at: null)', async () => {
      mockGroupFindMany.mockResolvedValue([fakeGroup]);

      await repository.findAll('user-1');

      const whereArg = mockGroupFindMany.mock.calls[0][0].where;
      expect(whereArg.deleted_at).toBeNull();
    });

    it('deve filtrar apenas grupos onde o usuário é membro', async () => {
      mockGroupFindMany.mockResolvedValue([fakeGroup]);

      await repository.findAll('user-1');

      const whereArg = mockGroupFindMany.mock.calls[0][0].where;
      expect(whereArg.members).toEqual({ some: { user_id: 'user-1' } });
    });

    it('deve incluir contagem de membros e role do usuário', async () => {
      mockGroupFindMany.mockResolvedValue([fakeGroup]);

      await repository.findAll('user-1');

      const includeArg = mockGroupFindMany.mock.calls[0][0].include;
      expect(includeArg._count).toEqual({ select: { members: true } });
      expect(includeArg.members).toMatchObject({
        where: { user_id: 'user-1' },
        select: { role: true, user_id: true },
      });
    });
  });

  describe('findById', () => {
    it('deve filtrar grupos deletados (deleted_at: null)', async () => {
      mockGroupFindFirst.mockResolvedValue(fakeGroup);

      await repository.findById('group-1');

      const whereArg = mockGroupFindFirst.mock.calls[0][0].where;
      expect(whereArg).toEqual({ id: 'group-1', deleted_at: null });
    });

    it('deve incluir membros com dados do usuário', async () => {
      mockGroupFindFirst.mockResolvedValue(fakeGroup);

      await repository.findById('group-1');

      const includeArg = mockGroupFindFirst.mock.calls[0][0].include;
      expect(includeArg.members.include.user.select).toMatchObject({
        id: true,
        name: true,
        email: true,
        course: true,
      });
    });

    it('deve retornar null quando o grupo não é encontrado', async () => {
      mockGroupFindFirst.mockResolvedValue(null);

      const result = await repository.findById('inexistente');

      expect(result).toBeNull();
    });
  });

  describe('findByJoinCode', () => {
    it('deve filtrar grupos deletados ao buscar por código', async () => {
      mockGroupFindFirst.mockResolvedValue(fakeGroup);

      await repository.findByJoinCode('ABC123');

      expect(mockGroupFindFirst).toHaveBeenCalledWith({
        where: { joinCode: 'ABC123', deleted_at: null },
      });
    });

    it('deve retornar null quando o código não existe', async () => {
      mockGroupFindFirst.mockResolvedValue(null);

      const result = await repository.findByJoinCode('INEXISTENTE');

      expect(result).toBeNull();
    });
  });

  describe('addMember', () => {
    it('deve adicionar o membro com role STUDENT', async () => {
      mockMembersCreate.mockResolvedValue({});

      await repository.addMember('group-1', 'user-2');

      expect(mockMembersCreate).toHaveBeenCalledWith({
        data: { group_id: 'group-1', user_id: 'user-2', role: 'STUDENT' },
      });
    });
  });

  describe('isMember', () => {
    it('deve retornar true quando o usuário é membro', async () => {
      mockMembersFindFirst.mockResolvedValue({ role: 'STUDENT' });

      const result = await repository.isMember('group-1', 'user-1');

      expect(result).toBe(true);
    });

    it('deve retornar false quando o usuário não é membro', async () => {
      mockMembersFindFirst.mockResolvedValue(null);

      const result = await repository.isMember('group-1', 'user-desconhecido');

      expect(result).toBe(false);
    });

    it('deve buscar com os IDs corretos', async () => {
      mockMembersFindFirst.mockResolvedValue(null);

      await repository.isMember('group-abc', 'user-xyz');

      expect(mockMembersFindFirst).toHaveBeenCalledWith({
        where: { group_id: 'group-abc', user_id: 'user-xyz' },
      });
    });
  });

  describe('update', () => {
    it('deve atualizar o grupo pelo id correto', async () => {
      mockGroupUpdate.mockResolvedValue(fakeGroup);

      await repository.update('group-1', { theme: 'Novo Tema' });

      expect(mockGroupUpdate).toHaveBeenCalledWith({
        where: { id: 'group-1' },
        data: { theme: 'Novo Tema' },
      });
    });
  });

  describe('delete', () => {
    it('deve fazer soft-delete preenchendo deleted_at — não apagar fisicamente', async () => {
      mockGroupUpdate.mockResolvedValue({ ...fakeGroup, deleted_at: new Date() });

      await repository.delete('group-1');

      expect(mockGroupUpdate).toHaveBeenCalledWith({
        where: { id: 'group-1' },
        data: { deleted_at: expect.any(Date) },
      });
    });

    it('não deve chamar student_Group.delete (exclusão física)', async () => {
      mockGroupUpdate.mockResolvedValue({});
      const mockDelete = vi.fn();

      await repository.delete('group-1');

      expect(mockDelete).not.toHaveBeenCalled();
    });
  });
});
