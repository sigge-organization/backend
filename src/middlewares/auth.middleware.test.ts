import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { authenticate } from "./auth.middleware.js";

function createMocks(authorization?: string) {
  const req = {
    headers: { authorization },
    userId: undefined,
  } as Request;

  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn(),
  } as unknown as Response;

  const next = vi.fn() as NextFunction;

  return { req, res, next };
}

describe("authenticate middleware", () => {
  beforeEach(() => {
    process.env.JWT_SECRET = "test-secret";
  });

  it("should call next and set userId when token is valid", () => {
    const token = jwt.sign({ sub: 42 }, "test-secret", { expiresIn: "1h" });
    const { req, res, next } = createMocks(`Bearer ${token}`);

    authenticate(req, res, next);

    expect(req.userId).toBe(42);
    expect(next).toHaveBeenCalledOnce();
    expect(res.status).not.toHaveBeenCalled();
  });

  it("should return 401 when token is not provided", () => {
    const { req, res, next } = createMocks();

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Token not provided" });
    expect(next).not.toHaveBeenCalled();
  });

  it("should return 401 when token is invalid", () => {
    const { req, res, next } = createMocks("Bearer invalid-token");

    authenticate(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid or expired token" });
    expect(next).not.toHaveBeenCalled();
  });
});
