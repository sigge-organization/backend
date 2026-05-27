import express from "express";
import authRoutes from "./routes/auth.routes.js";
const app = express();
const port = 3333;
app.use(express.json());
app.use("/api/auth", authRoutes);
app.listen(port, () => {
    console.log(`Server running on PORT ${port}`);
});
