import bucket from "../utils/bucket.js";
import messageEmitter from "../utils/messageEmitter.js";
import prisma from "../utils/prisma.js";

async function bucketWorker() {
    while (bucket.length > 0 && bucket[0] != undefined) {
        console.log("job",bucket[0])
        await prisma.message.update({
            where: {
                id: bucket[0].id
            },
            data: {
                isSent: true
            }
        })
        messageEmitter.emit("newMessage", bucket[0]);
        bucket.shift()
    }   
}

export default bucketWorker
    
