import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isGroupMember } from './isGroupMember';

const mockFindFirst = vi.hoisted(() => vi.fn());

vi.mock('@prisma/client', () => ({
  PrismaClient: vi.fn().mockImplementation(function () {
    return { group_Members: { findFirst: mockFindFirst } };
  }),
}));

const makeReq = (overrides: Record<string, any> = {}) => ({
  params: {},
  ...overrides,
});

const makeRes = () => {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  return { status, json };
};

describe('isGroupMember', () => {
  const next = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('deve retornar 401 quando user_id não está presente na requisição', async () => {
    const req = makeReq({ user_id: undefined, params: { studentGroupId: 'g-1' } }) as any;
    const res = makeRes();

    await isGroupMember(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Usuário não autenticado.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 400 quando o ID do grupo não está presente nos params', async () => {
    const req = makeReq({ user_id: 'u-1', params: {} }) as any;
    const res = makeRes();

    await isGroupMember(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({ error: 'ID do grupo de estudos não fornecido.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 403 quando o usuário não é membro do grupo', async () => {
    mockFindFirst.mockResolvedValue(null);
    const req = makeReq({ user_id: 'u-1', params: { studentGroupId: 'g-1' } }) as any;
    const res = makeRes();

    await isGroupMember(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(res.json).toHaveBeenCalledWith({
      error: 'Você não tem permissão para acessar os recursos deste grupo porque não é um participante.',
    });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve chamar next() quando o usuário é membro com role STUDENT', async () => {
    mockFindFirst.mockResolvedValue({ role: 'STUDENT' });
    const req = makeReq({ user_id: 'u-1', params: { studentGroupId: 'g-1' } }) as any;
    const res = makeRes();

    await isGroupMember(req, res as any, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('deve chamar next() quando o usuário é membro com role ADMIN', async () => {
    mockFindFirst.mockResolvedValue({ role: 'ADMIN' });
    const req = makeReq({ user_id: 'u-1', params: { studentGroupId: 'g-1' } }) as any;
    const res = makeRes();

    await isGroupMember(req, res as any, next);

    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('deve consultar o Prisma com o ID lido de req.params.studentGroupId', async () => {
    mockFindFirst.mockResolvedValue({ role: 'STUDENT' });
    const req = makeReq({ user_id: 'u-1', params: { studentGroupId: 'g-abc' } }) as any;
    const res = makeRes();

    await isGroupMember(req, res as any, next);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { user_id: 'u-1', group_id: 'g-abc' },
    });
  });

  it('deve usar req.params.id como fallback quando studentGroupId não está presente', async () => {
    mockFindFirst.mockResolvedValue({ role: 'STUDENT' });
    const req = makeReq({ user_id: 'u-1', params: { id: 'g-xyz' } }) as any;
    const res = makeRes();

    await isGroupMember(req, res as any, next);

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { user_id: 'u-1', group_id: 'g-xyz' },
    });
  });

  it('deve retornar 500 quando o Prisma lança uma exceção', async () => {
    mockFindFirst.mockRejectedValue(new Error('DB error'));
    const req = makeReq({ user_id: 'u-1', params: { studentGroupId: 'g-1' } }) as any;
    const res = makeRes();

    await isGroupMember(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: 'Erro ao verificar permissões do grupo.' });
    expect(next).not.toHaveBeenCalled();
  });
});
