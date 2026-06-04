import type { Request, Response } from "express";
import authService from "../services/auth.service.js";

type RegisterBody = {
  username?: string;
  email?: string;
  password?: string;
  course?: string;
};

type LoginBody = {
  email?: string;
  password?: string;
};

type HttpError = Error & { statusCode?: number };

class AuthController {
  async register(req: Request<unknown, unknown, RegisterBody>, res: Response) {
    try {
      const { username, email, password, course } = req.body;

      if (!username || !email || !password) {
        return res
          .status(400)
          .json({ error: "Username, email and password are required" });
      }

      const user = await authService.register({
        username,
        email,
        password,
        course,
      });

      return res.status(201).json(user);
    } catch (error) {
      const typedError = error as HttpError;

      if (typedError.statusCode) {
        return res
          .status(typedError.statusCode)
          .json({ error: typedError.message });
      }

      console.error(typedError);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async login(req: Request<unknown, unknown, LoginBody>, res: Response) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ error: "Email and password are required" });
      }

      const result = await authService.login({ email, password });

      return res.status(200).json(result);
    } catch (error) {
      const typedError = error as HttpError;

      if (typedError.statusCode) {
        return res
          .status(typedError.statusCode)
          .json({ error: typedError.message });
      }

      console.error(typedError);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async me(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const user = await authService.getProfile(req.userId);

      return res.status(200).json(user);
    } catch (error) {
      const typedError = error as HttpError;

      if (typedError.statusCode) {
        return res
          .status(typedError.statusCode)
          .json({ error: typedError.message });
      }

      console.error(typedError);
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async updateProfile(req: Request, res: Response) {
  try {
    if (!req.userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { username, email, course } = req.body;
    const updatedUser = await authService.updateProfile(req.userId, {
      username,
      email,
      course,
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    const typedError = error as HttpError;
    if (typedError.statusCode) {
      return res.status(typedError.statusCode).json({ error: typedError.message });
    }
    return res.status(500).json({ error: "Internal server error" });
  }
}


  async verifyPassword(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { currentPassword } = req.body;
      if (!currentPassword) {
        return res.status(400).json({ error: "Senha atual é obrigatória" });
      }

      const result = await authService.verifyPassword(req.userId, currentPassword);
      return res.status(200).json(result);
    } catch (error) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      if (!req.userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const { currentPassword, newPassword } = req.body;
      
      if (!currentPassword || !newPassword) {
        return res.status(400).json({ error: "Senha atual e nova senha são obrigatórias" });
      }

      const result = await authService.changePassword(req.userId, currentPassword, newPassword);

      return res.status(200).json(result);
    } catch (error) {
      const typedError = error as HttpError;
      if (typedError.statusCode) {
        return res.status(typedError.statusCode).json({ error: typedError.message });
      }
      return res.status(500).json({ error: "Internal server error" });
    }
  }

}

export default new AuthController();
