import authService from "../services/auth.service.js";
class AuthController {
    async register(req, res) {
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
        }
        catch (error) {
            const typedError = error;
            if (typedError.statusCode) {
                return res
                    .status(typedError.statusCode)
                    .json({ error: typedError.message });
            }
            console.error(typedError);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res
                    .status(400)
                    .json({ error: "Email and password are required" });
            }
            const result = await authService.login({ email, password });
            return res.status(200).json(result);
        }
        catch (error) {
            const typedError = error;
            if (typedError.statusCode) {
                return res
                    .status(typedError.statusCode)
                    .json({ error: typedError.message });
            }
            console.error(typedError);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
    async me(req, res) {
        try {
            if (!req.userId) {
                return res.status(401).json({ error: "Unauthorized" });
            }
            const user = await authService.getProfile(req.userId);
            return res.status(200).json(user);
        }
        catch (error) {
            const typedError = error;
            if (typedError.statusCode) {
                return res
                    .status(typedError.statusCode)
                    .json({ error: typedError.message });
            }
            console.error(typedError);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
}
export default new AuthController();
