import messages from "../utils/messages.js";
import bucket from "../utils/bucket.js";
import bucketWorker from "./bucketWorker.js";

let open = true
function messageWorker(timestamp: number) {
    while (messages.first() != undefined && messages.first()!.time <= timestamp) {
        // console.log(messages[0])
        bucket.push(messages.pop()!)
        if(open){
            open = false
            bucketWorker()
        }
    }
    open = true
}

export default messageWorker