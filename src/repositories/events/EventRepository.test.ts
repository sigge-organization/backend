import { describe, it, expect, vi, beforeEach } from 'vitest';

const mockCreate = vi.hoisted(() => vi.fn());
const mockFindMany = vi.hoisted(() => vi.fn());

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(function () {
    return { event: { create: mockCreate, findMany: mockFindMany } };
  }),
}));

import { EventRepository } from './EventRepository';

const fakeEventData = {
  studentGroupId: 'group-1',
  title: 'Revisão de Cálculo',
  date_time_event: new Date('2026-07-10T14:00:00'),
  local_or_link_event: 'Sala 101',
};

const fakeEvent = { id: 'event-1', ...fakeEventData, deleted_at: null };

describe('EventRepository', () => {
  let repository: EventRepository;

  beforeEach(() => {
    vi.clearAllMocks();
    repository = new EventRepository();
  });

  describe('create', () => {
    it('deve criar o evento com os dados informados', async () => {
      mockCreate.mockResolvedValue(fakeEvent);

      await repository.create(fakeEventData);

      expect(mockCreate).toHaveBeenCalledWith({ data: fakeEventData });
    });

    it('deve retornar o evento criado', async () => {
      mockCreate.mockResolvedValue(fakeEvent);

      const result = await repository.create(fakeEventData);

      expect(result).toEqual(fakeEvent);
    });
  });

  describe('findByGroupId', () => {
    it('deve filtrar eventos deletados (deleted_at: null)', async () => {
      mockFindMany.mockResolvedValue([fakeEvent]);

      await repository.findByGroupId('group-1');

      const whereArg = mockFindMany.mock.calls[0][0].where;
      expect(whereArg.deleted_at).toBeNull();
    });

    it('deve filtrar pelo grupo correto', async () => {
      mockFindMany.mockResolvedValue([fakeEvent]);

      await repository.findByGroupId('group-1');

      const whereArg = mockFindMany.mock.calls[0][0].where;
      expect(whereArg.studentGroupId).toBe('group-1');
    });

    it('deve ordenar por date_time_event ascendente', async () => {
      mockFindMany.mockResolvedValue([fakeEvent]);

      await repository.findByGroupId('group-1');

      const orderByArg = mockFindMany.mock.calls[0][0].orderBy;
      expect(orderByArg).toEqual({ date_time_event: 'asc' });
    });

    it('deve retornar lista vazia quando não há eventos', async () => {
      mockFindMany.mockResolvedValue([]);

      const result = await repository.findByGroupId('group-vazio');

      expect(result).toEqual([]);
    });
  });
});
