import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreate = vi.hoisted(() => vi.fn());
const mockFindMany = vi.hoisted(() => vi.fn());

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(function () {
    return { material: { create: mockCreate, findMany: mockFindMany } };
  }),
}));

import { MaterialRepository } from './MaterialRepository';

const fakeMaterialData = {
  uploadedById: 'user-1',
  studentGroupId: 'group-1',
  title: 'Apostila de Cálculo',
  external_url: 'https://example.com/apostila.pdf',
};

const fakeMaterial = {
  id: 'material-1',
  ...fakeMaterialData,
  deleted_at: null,
  uploadedBy: { id: 'user-1', name: 'João', email: 'joao@mail.com' },
};

describe('MaterialRepository', () => {
  let repository: MaterialRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new MaterialRepository();
  });

  describe('create', () => {
    it('deve criar o material com os dados informados', async () => {
      mockCreate.mockResolvedValue(fakeMaterial);

      await repository.create(fakeMaterialData);

      expect(mockCreate).toHaveBeenCalledWith({ data: fakeMaterialData });
    });

    it('deve retornar o material criado', async () => {
      mockCreate.mockResolvedValue(fakeMaterial);

      const result = await repository.create(fakeMaterialData);

      expect(result).toEqual(fakeMaterial);
    });
  });

  describe('findByGroupId', () => {
    it('deve filtrar materiais deletados (deleted_at: null)', async () => {
      mockFindMany.mockResolvedValue([fakeMaterial]);

      await repository.findByGroupId('group-1');

      const whereArg = mockFindMany.mock.calls[0][0].where;
      expect(whereArg.deleted_at).toBeNull();
    });

    it('deve filtrar pelo grupo correto', async () => {
      mockFindMany.mockResolvedValue([fakeMaterial]);

      await repository.findByGroupId('group-1');

      const whereArg = mockFindMany.mock.calls[0][0].where;
      expect(whereArg.studentGroupId).toBe('group-1');
    });

    it('deve incluir dados do uploadedBy', async () => {
      mockFindMany.mockResolvedValue([fakeMaterial]);

      await repository.findByGroupId('group-1');

      const includeArg = mockFindMany.mock.calls[0][0].include;
      expect(includeArg.uploadedBy).toMatchObject({
        select: { id: true, name: true, email: true },
      });
    });

    it('deve ordenar por created_at descendente', async () => {
      mockFindMany.mockResolvedValue([fakeMaterial]);

      await repository.findByGroupId('group-1');

      const orderByArg = mockFindMany.mock.calls[0][0].orderBy;
      expect(orderByArg).toEqual({ created_at: 'desc' });
    });

    it('deve retornar lista vazia quando não há materiais', async () => {
      mockFindMany.mockResolvedValue([]);

      const result = await repository.findByGroupId('group-vazio');

      expect(result).toEqual([]);
    });
  });
});
