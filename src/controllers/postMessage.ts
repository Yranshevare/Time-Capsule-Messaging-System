import { asyncHandler } from "../utils/asyncHandler.js";
import messages from "../utils/messages.js";
import prisma from "../utils/prisma.js";
import { timestamp } from "../Workers/cronWorker.js";

const postMessage = asyncHandler(async (req, res) => {
    const { message, time, receiver } = req.body;
    const data = await prisma.message.create({
        data: {
            message,
            time: `${time}`,
            receiver,
            // @ts-ignore
            sender: req.user?.username
        }
    })
    const numericTime = Number(time);
    messages.add({ id: `${data.id}`, message, time: numericTime, receiver, sender: data.sender });

    if (!isNaN(numericTime)) {
        timestamp.add(numericTime);
        console.log(timestamp)
    } else {
        console.log("Invalid time:", time);
    }
    res.status(200).json({ message, time: numericTime, receiver });
})

export { postMessage }