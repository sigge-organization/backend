import { Request, Response } from "express";
import { ForgotPasswordService } from "../../services/users/ForgotPasswordService";
import { ResetPasswordService } from "../../services/users/ResetPasswordService";

export class PasswordRecoveryController {
  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;
    const forgotPasswordService = new ForgotPasswordService();

    try {
      const result = await forgotPasswordService.execute({ email });
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }

  async resetPassword(req: Request, res: Response) {
    const { email, code, password, confirmPassword } = req.body;
    const resetPasswordService = new ResetPasswordService();

    try {
      const result = await resetPasswordService.execute({
        email,
        code,
        password,
        confirmPassword,
      });
      return res.json(result);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }
  }
}