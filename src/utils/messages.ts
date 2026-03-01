import priorityQueue from "../lib/PriorityQueue.js"

// const messages: {id: string, message: string, time: number, receiver: string }[] = []
const messages = new priorityQueue<{ id: string, message: string, sender: string, time: number, receiver: string }>((a, b) => a.time - b.time)

export default messages
