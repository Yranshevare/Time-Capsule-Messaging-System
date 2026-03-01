import { asyncHandler } from "../utils/asyncHandler.js";
import messageEmitter from "../utils/messageEmitter.js";
import prisma from "../utils/prisma.js";

interface Message {
    sender: string;
    receiver: string;
    text: string;
}
const inbox = asyncHandler(async (req, res) => {
    const userId = req.user.username;

    console.log(`${userId} connected to SSE`);
    // Set SSE headers
    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.flushHeaders(); // important for some clients

    const data = await prisma.message.findMany({
        where: {
            receiver: userId,
            isSent: true
        }
    })
    // console.log(userId)

    data.forEach((msg) => {
        res.write(`data: ${JSON.stringify(msg)}\n\n`);
    })

    // Define listener for this user
    const listener = (msg: Message) => {
        if (msg.receiver === userId) {
            res.write(`data: ${JSON.stringify(msg)}\n\n`);
        }
    };

    messageEmitter.on("newMessage", listener);

    // Remove listener on client disconnect
    req.on("close", () => {
        console.log(`${userId} disconnected`);
        messageEmitter.off("newMessage", listener);
    });
})

export { inbox }