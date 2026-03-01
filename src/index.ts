import express from "express";
import { cronWorker } from "./Workers/cronWorker.js";
import restart from "./Workers/restart.js";
import { login } from "./controllers/login.js";
import cookieParser from "cookie-parser";
import { register } from "./controllers/register.js";
import { fileURLToPath } from 'url';
import path from "path";
import verifyJwt from "./middleware/auth.middelware.js";
import { postMessage } from "./controllers/postMessage.js";
import { getSendMessages } from "./controllers/getSendMessages.js";
import { inbox } from "./controllers/inbox.js";
import "dotenv/config"


await restart()

cronWorker.start()

const app = express();
app.use(express.json());
app.use(cookieParser())

// app.use(express.static("/public"));
const __filename = fileURLToPath(import.meta.url);  // current file path from c: (eg, C:\Users\Yadnesh\OneDrive\Desktop\codes\express-backend\basics\ServerSentEvent\src\index.js)
const __dirname = path.dirname(__filename);         // current directory path from c: (eg, C:\Users\Yadnesh\OneDrive\Desktop\codes\express-backend\basics\ServerSentEvent\src)

app.use(express.static(path.join(__dirname, "..", "public")));

// server frontend files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'public', 'login', 'index.html'));  // ./public/index.html from current directory
});

app.post("/register", register);

app.post("/login", login);

app.post("/message", verifyJwt, postMessage)

app.get("/message", verifyJwt, getSendMessages)

app.get("/stream", verifyJwt, inbox);

app.listen(3000, () => {
    console.log("Server is running on port 3000");
});