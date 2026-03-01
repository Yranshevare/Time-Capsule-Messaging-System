# Time Capsule Messaging System (FintechFlow)

A scheduled messaging system that allows users to send messages to be delivered at a precise time in the future. The project guarantees timely delivery using in-memory data structures and background workers, and it pushes live updates to the recipient via Server-Sent Events (SSE).

## 🚀 Features
- **User Authentication:** Secure registration and login using JWT and bcrypt.
- **Message Scheduling:** Send a message to any user with a specific future delivery timestamp.
- **Real-Time Inbox:** Receive scheduled messages in real-time without reloading the page via SSE.
- **Efficient Message Processing:** Uses a highly optimized background cron worker combined with a Priority Queue and Sorted Set to execute messages exactly when they are due, minimizing database load.

## 🛠️ Tech Stack
### Backend
- **Runtime:** Node.js
- **Framework:** Express.js
- **Language:** TypeScript
- **Database & ORM:** SQLite with Prisma ORM
- **Authentication:** JSON Web Tokens (JWT) stored in HttpOnly cookies
- **Background Jobs:** `cron` package for precise per-second checks
- **Real-Time:** Server-Sent Events (SSE, `text/event-stream`)

### Frontend
- **HTML5 & Vanilla JavaScript:** No heavy frontend frameworks to keep the bundle size minimal.
- **Styling:** Tailwind CSS (via CDN) for a modern, responsive user interface.

## 🏗️ Architecture & Approach

The major challenge in a "Time Capsule" or scheduled messaging system is ensuring messages are delivered accurately down to the second, especially at scale, without constantly overwhelming the database with polling queries.

This system solves the problem statement by leveraging efficient **In-Memory Data Structures** and a **Multi-layered Worker pattern**:

### 1. In-Memory Caching & Sorting
Instead of querying the SQL database every second, the application loads scheduled messages into in-memory data structures upon startup:
- **`timestamp` Sorted Set:** Holds the unique timestamps for when messages are scheduled to be sent.
- **`messages` Priority Queue:** Stores the actual message payloads, ordered by delivery time.

### 2. The Worker Ecosystem
- **`cronWorker`:** A cron job running every 1 second (`*/1 * * * * *`). It simply checks the first element in the `timestamp` Sorted Set. If the current time is greater than or equal to the scheduled time, it pops the timestamp and passes it to the `messageWorker`.
- **`messageWorker`:** Checks the `messages` Priority Queue. It extracts all messages that correspond to the triggered timestamp and pushes them into an execution `bucket`.
- **`bucketWorker`:** Iterates through the given execution `bucket`. For each message:
  1. It updates the database record to mark the message as `isSent = true`.
  2. It triggers a local Node event via `messageEmitter`.

### 3. Server-Sent Events (SSE) Delivery
When users open their Inbox, they establish a persistent HTTP connection to the backend (`/stream`).
When the `bucketWorker` emits a `newMessage` event, the SSE controller pushes the specific message directly to the targeted recipient in real-time, removing the need for frontend polling.

> Connection get colsed once user leave the inbox page making sure no extra load on the server

### 4. Resiliency & Startup Recovery (`restart.ts`)
If the server crashes or restarts, the `restart.ts` worker activates immediately. It fetches all pending messages (`isSent: false`) from the database, sorts them by target delivery time, and populates the in-memory `timestamp` Sorted Set and `messages` Priority Queue so the system picks up exactly where it left off.

## 📦 Running Locally

1. **Install Dependencies:**
   ```bash
   npm install
   ```

2. **Set Up the Database:**
   Ensure the `.env` file contains your database variables and JWT secrets, then generate the Prisma client.
   ```bash
   npx prisma generate
   npx prisma db push
   ```

3. **Start the Application:**
   Watch for TypeScript changes and start the server:
   ```bash
   # Terminal 1
   npm run watch

   # Terminal 2
   npm start
   ```

The application will run on `http://localhost:3000`.
