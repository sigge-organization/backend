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
}
export default new AuthController();
