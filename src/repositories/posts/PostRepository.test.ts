import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreate = vi.hoisted(() => vi.fn());
const mockFindMany = vi.hoisted(() => vi.fn());

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(function () {
    return { post: { create: mockCreate, findMany: mockFindMany } };
  }),
}));

import { PostRepository } from './PostRepository';

const fakePostData = {
  authorId: 'user-1',
  studentGroupId: 'group-1',
  content: 'Alguém tem o gabarito da lista 3?',
};

const fakePost = {
  id: 'post-1',
  ...fakePostData,
  post_date: new Date(),
  deleted_at: null,
  author: { id: 'user-1', name: 'João', email: 'joao@mail.com' },
};

describe('PostRepository', () => {
  let repository: PostRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new PostRepository();
  });

  describe('create', () => {
    it('deve criar o post com os dados informados', async () => {
      mockCreate.mockResolvedValue(fakePost);

      await repository.create(fakePostData);

      expect(mockCreate).toHaveBeenCalledWith({ data: fakePostData });
    });

    it('deve retornar o post criado', async () => {
      mockCreate.mockResolvedValue(fakePost);

      const result = await repository.create(fakePostData);

      expect(result).toEqual(fakePost);
    });
  });

  describe('findByGroupId', () => {
    it('deve filtrar posts deletados (deleted_at: null)', async () => {
      mockFindMany.mockResolvedValue([fakePost]);

      await repository.findByGroupId('group-1');

      const whereArg = mockFindMany.mock.calls[0][0].where;
      expect(whereArg.deleted_at).toBeNull();
    });

    it('deve filtrar pelo grupo correto', async () => {
      mockFindMany.mockResolvedValue([fakePost]);

      await repository.findByGroupId('group-1');

      const whereArg = mockFindMany.mock.calls[0][0].where;
      expect(whereArg.studentGroupId).toBe('group-1');
    });

    it('deve incluir dados do author', async () => {
      mockFindMany.mockResolvedValue([fakePost]);

      await repository.findByGroupId('group-1');

      const includeArg = mockFindMany.mock.calls[0][0].include;
      expect(includeArg.author).toMatchObject({
        select: { id: true, name: true, email: true },
      });
    });

    it('deve ordenar por post_date descendente', async () => {
      mockFindMany.mockResolvedValue([fakePost]);

      await repository.findByGroupId('group-1');

      const orderByArg = mockFindMany.mock.calls[0][0].orderBy;
      expect(orderByArg).toEqual({ post_date: 'desc' });
    });

    it('deve retornar lista vazia quando não há posts', async () => {
      mockFindMany.mockResolvedValue([]);

      const result = await repository.findByGroupId('group-vazio');

      expect(result).toEqual([]);
    });
  });
});
