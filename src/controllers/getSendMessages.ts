import { asyncHandler } from "../utils/asyncHandler.js";
import prisma from "../utils/prisma.js";

const getSendMessages = asyncHandler(async (req, res) => {
    const data: any = await prisma.message.findMany({ where: { sender: req.user?.username } })

    res.status(200).json(data);
})

export { getSendMessages }