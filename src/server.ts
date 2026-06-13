import { createServer } from 'http';
import { Server } from 'socket.io';
import { app } from './app';
import { initSocketManager } from './sockets/socketManager';
import 'dotenv/config';

const PORT = process.env.PORT || 3000;
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  }
});

initSocketManager(io);
app.set('io', io);

httpServer.listen(PORT, () => {
  console.log(`Project Chat Backend listening on port ${PORT}`);
});