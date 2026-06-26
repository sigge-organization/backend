import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import * as jwt from 'jsonwebtoken';
import { isAuthenticated } from './isAuthenticated';

const TEST_SECRET = 'test-secret';

const makeToken = (userId: string, secret = TEST_SECRET, options?: jwt.SignOptions) =>
  jwt.sign({ userId }, secret, options);

const makeReq = (overrides: Record<string, any> = {}) => ({
  cookies: {},
  headers: {},
  ...overrides,
});

const makeRes = () => {
  const json = vi.fn();
  const status = vi.fn().mockReturnValue({ json });
  return { status, json };
};

describe('isAuthenticated', () => {
  const next = vi.fn();
  let originalSecret: string | undefined;

  beforeEach(() => {
    vi.clearAllMocks();
    originalSecret = process.env.JWT_SECRET;
    process.env.JWT_SECRET = TEST_SECRET;
  });

  afterEach(() => {
    if (originalSecret === undefined) {
      delete process.env.JWT_SECRET;
    } else {
      process.env.JWT_SECRET = originalSecret;
    }
  });

  it('deve retornar 401 quando não há token no cookie nem no header', () => {
    const req = makeReq() as any;
    const res = makeRes();

    isAuthenticated(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token não fornecido ou cookie ausente.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve autenticar com token válido no cookie', () => {
    const token = makeToken('user-123');
    const req = makeReq({ cookies: { auth_token: token } }) as any;
    const res = makeRes();

    isAuthenticated(req, res as any, next);

    expect(req.user_id).toBe('user-123');
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('deve autenticar com token válido no header Authorization', () => {
    const token = makeToken('user-456');
    const req = makeReq({ headers: { authorization: `Bearer ${token}` } }) as any;
    const res = makeRes();

    isAuthenticated(req, res as any, next);

    expect(req.user_id).toBe('user-456');
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it('deve priorizar o cookie quando ambos cookie e header estão presentes', () => {
    const tokenCookie = makeToken('user-cookie');
    const tokenHeader = makeToken('user-header');
    const req = makeReq({
      cookies: { auth_token: tokenCookie },
      headers: { authorization: `Bearer ${tokenHeader}` },
    }) as any;
    const res = makeRes();

    isAuthenticated(req, res as any, next);

    expect(req.user_id).toBe('user-cookie');
    expect(next).toHaveBeenCalledOnce();
  });

  it('deve retornar 401 para token com assinatura inválida', () => {
    const tokenInvalido = makeToken('user-1', 'secret-errado');
    const req = makeReq({ cookies: { auth_token: tokenInvalido } }) as any;
    const res = makeRes();

    isAuthenticated(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve retornar 401 para token expirado', () => {
    const tokenExpirado = jwt.sign(
      { userId: 'user-1', exp: Math.floor(Date.now() / 1000) - 3600 },
      TEST_SECRET
    );
    const req = makeReq({ cookies: { auth_token: tokenExpirado } }) as any;
    const res = makeRes();

    isAuthenticated(req, res as any, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: 'Token inválido ou expirado.' });
    expect(next).not.toHaveBeenCalled();
  });

  it('deve usar o JWT_SECRET definido no ambiente para validar o token', () => {
    const token = makeToken('user-env', TEST_SECRET);
    const req = makeReq({ cookies: { auth_token: token } }) as any;
    const res = makeRes();

    isAuthenticated(req, res as any, next);

    expect(req.user_id).toBe('user-env');
    expect(next).toHaveBeenCalledOnce();
  });

  it('deve aceitar token assinado com fallback_secret quando JWT_SECRET não está definido', () => {
    delete process.env.JWT_SECRET;

    const tokenFallback = jwt.sign({ userId: 'user-fallback' }, 'fallback_secret');
    const req = makeReq({ cookies: { auth_token: tokenFallback } }) as any;
    const res = makeRes();

    isAuthenticated(req, res as any, next);

    expect(req.user_id).toBe('user-fallback');
    expect(next).toHaveBeenCalledOnce();
  });
});
