import { Server, Socket } from 'socket.io';
import { prisma } from '../config/prisma';

export const userSocketMap = new Map<string, string>();

export const initSocketManager = (io: Server): void => {
  io.on('connection', (socket: Socket) => {
    const userId = socket.handshake.query.userId as string;
    
    if (!userId) {
      console.warn(`[Socket] Connection rejected: Missing userId.`);
      return socket.disconnect(true);
    }

    userSocketMap.set(userId, socket.id);
    console.log(`[Socket] User Connected: ${userId} -> ${socket.id}`);

    socket.on('join_group', async (data: { groupId: string }) => {
      const { groupId } = data;
      if (!groupId) return;

      try {
        const isMember = await prisma.group.findFirst({
          where: {
            id: groupId,
            members: { some: { id: userId } }
          }
        });

        if (!isMember) {
          return socket.emit('error', { message: 'Unauthorized: You are not a member of this group' });
        }

        socket.join(groupId);
        console.log(`[Socket] Socket ${socket.id} safely authorized and joined room: ${groupId}`);
      } catch (error) {
        socket.emit('error', { message: 'Server error processing room admission' });
      }
    });

    socket.on('send_private_message', async (data: { receiverId: string; text: string }) => {
      const { receiverId, text } = data;
      if (!receiverId || !text) return;

      try {
        const message = await prisma.message.create({
          data: { text, senderId: userId, receiverId },
          include: { sender: true }
        });

        socket.emit('receive_private_message', message);
        const receiverSocketId = userSocketMap.get(receiverId);
        if (receiverSocketId) {
          io.to(receiverSocketId).emit('receive_private_message', message);
        }
      } catch (error) {
        socket.emit('error', { message: 'Database transaction error' });
      }
    });

    socket.on('send_group_message', async (data: { groupId: string; text: string }) => {
      const { groupId, text } = data;
      if (!groupId || !text || !text.trim()) return;

      try {
        const isMember = await prisma.group.findFirst({
          where: {
            id: groupId,
            members: { some: { id: userId } }
          }
        });

        if (!isMember) {
          return socket.emit('error', { message: 'Unauthorized: You are not a member of this group' });
        }

        const message = await prisma.message.create({
          data: { text, senderId: userId, groupId },
          include: { sender: true }
        });

        io.to(groupId).emit('receive_group_message', message);
      } catch (error) {
        console.error('[Socket Error] Group message write failure:', error);
        socket.emit('error', { message: 'Database transaction error for group message' });
      }
    });

    socket.on('disconnect', () => {
      userSocketMap.delete(userId);
      console.log(`[Socket] User Disconnected: ${userId}`);
    });
  });
};