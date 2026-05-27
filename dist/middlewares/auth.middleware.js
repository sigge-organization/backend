import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt.js";
export function authenticate(req, res, next) {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) {
        res.status(401).json({ error: "Token not provided" });
        return;
    }
    const token = authHeader.slice("Bearer ".length);
    try {
        const payload = jwt.verify(token, getJwtSecret());
        const userId = Number(typeof payload === "object" && payload !== null && "sub" in payload
            ? payload.sub
            : undefined);
        if (!Number.isInteger(userId) || userId <= 0) {
            res.status(401).json({ error: "Invalid token" });
            return;
        }
        req.userId = userId;
        next();
    }
    catch {
        res.status(401).json({ error: "Invalid or expired token" });
    }
}
