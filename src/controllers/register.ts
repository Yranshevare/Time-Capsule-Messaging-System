import { asyncHandler } from "../utils/asyncHandler.js"
import prisma from "../utils/prisma.js";
import bcrypt from "bcryptjs";


const register = asyncHandler(async (req, res) => {
    try {
        const { username, password } = req.body;
        if (!username || !password) {
            res.status(400).json({ error: "Username and password are required" });
            return;
        }
        const existingUser = await prisma.user.findUnique({ where: { username } });
        if (existingUser) {
            res.status(400).json({ error: "User already exists" });
            return;
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = await prisma.user.create({
            data: { username, password: hashedPassword }
        });
        res.status(201).json({ message: "User created successfully", userId: user.id });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
    }
})

export { register }