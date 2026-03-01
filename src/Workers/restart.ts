import prisma from "../utils/prisma.js";
import messages from "../utils/messages.js";
import { timestamp } from "./cronWorker.js";
import "dotenv/config"

async function restart() {
    const data: { 
        id: string; 
        message: string; 
        time: string; 
        receiver: string; 
        isSent: boolean;
        sender: string;
     }[] = await prisma.message.findMany({ 
            where: { isSent: false }, 
            omit: { createdAt: true, updatedAt: true } 
        })

    data.sort((a, b) => Number(a.time) - Number(b.time))

    let time = Number(data[0]?.time)

    timestamp.add(time)

    data.forEach((item) => {
        messages.add({ id: item.id, message: item.message, sender: item.sender, time: Number(item.time), receiver: item.receiver })

        if (time < Number(item.time)) {
            timestamp.add(Number(item.time) + parseInt(process.env.TIMESTAMP_WINDOW!))
            time = Number(item.time) + parseInt(process.env.TIMESTAMP_WINDOW!)
        }
    })
}

export default restart
