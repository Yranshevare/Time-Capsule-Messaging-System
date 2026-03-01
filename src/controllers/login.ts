import jwt from "jsonwebtoken"
import { asyncHandler } from "../utils/asyncHandler.js"
import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";


const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

const login = asyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: "Username and password are required" });
            return;
        }
        const user = await prisma.user.findUnique({ where: { username } });
        if (!user) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            res.status(401).json({ error: "Invalid credentials" });
            return;
        }
        const token = jwt.sign({ userId: user.id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });
        res.cookie("token", token, {
            httpOnly: true,
            secure: true,
            sameSite: "strict",
            maxAge: 3600000
        })
        res.status(200).json({ message: "Login successful"});
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

export { login }