import { Router } from "express";
import authController from "../controllers/auth.controller.js";
import { authenticate } from "../middlewares/auth.middleware.js";

const authRoutes = Router();

authRoutes.post("/register", authController.register);
authRoutes.post("/login", authController.login);
authRoutes.get("/me", authenticate, authController.me);
authRoutes.put("/profile", authenticate, authController.updateProfile);



export default authRoutes;
