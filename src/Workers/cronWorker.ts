import { CronJob } from "cron";
import messageWorker from "./messageWorker.js";
import SortedSet from "../lib/sortedSet.js";

// const timestamp: number[] = []
const timestamp = new SortedSet<number>((a, b) => a - b)

const cronWorker = new CronJob("*/1 * * * * *", () => {
    if (Number.isNaN(timestamp.first())) {
        timestamp.delete(NaN)
    }
    if (timestamp.first() !== undefined && timestamp.first()! <= Date.now()) {
        console.log("job completed", timestamp);
        messageWorker(timestamp.pop()!)
        // timestamp.delete(timestamp.first()!)
    }
})

export { cronWorker, timestamp }