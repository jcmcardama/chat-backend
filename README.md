# Real-Time Chat Backend API

A robust, scalable, and secure backend server for a modern real-time chat application. Built with Node.js, Express, TypeScript, and Prisma, this API handles seamless instant messaging, dynamic group management, and low-latency real-time event broadcasting using WebSockets.

## 🚀 Project Overview

This backend serves as the core engine for a real-time messaging platform. It features:

- **Real-Time WebSockets** - Instant message delivery and event broadcasting using Socket.io
- **Private Messaging** - Secure 1-on-1 direct messaging channels with complete chat histories
- **Group Channels** - Create groups, manage membership rosters, and broadcast messages to isolated rooms
- **Strict Authorization Guards** - Built-in security layers preventing unauthorized users from accessing or eavesdropping on group channels
- **RESTful Architecture** - Clean, predictable, and resource-oriented HTTP endpoints
- **Relational Data Management** - Highly optimized, indexed database queries utilizing Prisma ORM

---

## 🛠️ Tech Stack

- Node.js + Express
- TypeScript for end-to-end type safety
- Prisma ORM for database modeling and migrations
- PostgreSQL as the primary relational database
- Socket.io for real-time bidirectional event-based communication
- CORS & dotenv for secure environment configuration

Note: exact package versions are in `package.json`.

## 📁 Project Structure

Top-level `src/` layout:

```text
src/
├── app.ts                  # Express application configuration & middleware
├── server.ts               # HTTP & Socket server entry point
├── config/                 # Database instances (Prisma client)
│   └── prisma.ts
├── controllers/            # Core business logic handlers
│   ├── group.controller.ts
│   ├── message.controller.ts
│   └── user.controller.ts
├── routes/                 # RESTful API route definitions
│   ├── group.routes.ts
│   ├── message.routes.ts
│   └── user.routes.ts
├── sockets/                # Real-time WebSocket event managers
│   └── socketManager.ts
└── types/                  # TypeScript interfaces and DTOs
    └── types.ts
```

Edit database schemas and models in the root `prisma/schema.prisma` file.

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18 or higher)
- PostgreSQL installed and running locally (or a cloud DB like Supabase/Neon)
- npm or yarn

### Installation & Running

1. **Clone the repository**
```bash
   git clone [https://github.com/jcmcardama/chat-backend.git](https://github.com/jcmcardama/chat-backend.git)
   cd chat-backend
   ```

2. **Install dependencies**
```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory and add your local configurations (see `.env.example` if available):
```env
   PORT=3000
   DATABASE_URL="postgresql://USERNAME:PASSWORD@localhost:5432/chat_db?schema=public"
   ```

4. **Initialize the Database**
   Run Prisma migrations to generate the tables and the TypeScript client:
```bash
   npx prisma generate
   npx prisma migrate dev --name init
   ```

5. **Start the development server**
```bash
   npm run dev
   ```
   The API will be available at `http://localhost:3000`

---

## 📝 Available Scripts

- `npm run dev` - Start development server with hot-reloading (via nodemon or ts-node-dev)
- `npm run build` - Compile the TypeScript source code into a production-ready JavaScript bundle
- `npm start` - Run the compiled production build
- `npx prisma studio` - Open a local visual database browser to inspect records

---

## ✨ Key Features

✅ **Modern Backend Stack** - Built with the latest Node.js and Express best practices  
✅ **End-to-End Type Safety** - Shared TypeScript interfaces extending from HTTP requests to database queries  
✅ **BOLA Security Checked** - Strict group membership verification on both HTTP and WebSocket layers  
✅ **Performance Optimized** - Native database filtering (`findUnique`, `some`, `connect`) avoiding memory bottlenecks  
✅ **Clean Code Architecture** - Domain-driven separation of concerns (Routes -> Controllers -> DB)  
✅ **Live Socket Rooms** - Scalable group broadcasting using Socket.io native rooms (`io.to(groupId)`)  

---

## 📧 Get In Touch

I'm always interested in hearing about new opportunities and collaborations.

- [**Email**](mailto:jcmcardama@gmail.com)
- [**LinkedIn**](https://www.linkedin.com/in/jan-carlo-cardama/)
- [**GitHub**](https://github.com/jcmcardama)
- [**Portfolio**](https://jcmcardama-portfolio.vercel.app/)

---

**Made with ❤️ by Jan Carlo M. Cardama**