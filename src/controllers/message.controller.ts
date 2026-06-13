import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { Prisma } from '../../prisma/generated/client/client';
import { GroupParams, GetPrivateChatParams, SendGroupChatBody, SendPrivateChatBody, GetGroupChatParams } from '../types/types';
import { userSocketMap } from '../sockets/socketManager';

export const getPrivateChat = async (
  req: Request<GetPrivateChatParams>,
  res: Response
): Promise<Response> => {
  const { userId1, userId2 } = req.params;

  if (!userId1 || !userId2) return res.status(400).json({ error: 'User ids required' });

  try {
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId1, receiverId: userId2 },
          { senderId: userId2, receiverId: userId1 }
        ]
      },
      orderBy: { createdAt: 'asc' },
      include: {
        sender: true,
        receiver: true
      }
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};

export const getGroupChat = async (
  req: Request<GetGroupChatParams>, 
  res: Response
): Promise<Response> => {
  const { groupId, userId } = req.params;

  if (!groupId || !userId) return res.status(400).json({ error: 'Group Id and User Id required' });
  
  try {
    const isMember = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: { id: userId }
        }
      }
    });

    if (!isMember) {
      return res.status(403).json({ 
        error: 'Forbidden: You must be a member of this group to view its chat history' 
      });
    }

    const messages = await prisma.message.findMany({
      where: { groupId },
      orderBy: { createdAt: 'asc' },
      include: { sender: true }
    });

    return res.status(200).json(messages);
  } catch (error) {
    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};

export const sendPrivateChat = async (
  req: Request<{}, {}, SendPrivateChatBody>,
  res: Response
): Promise<Response> => {
  const { senderId, receiverId, text } = req.body;

  if (!senderId || !receiverId) return res.status(400).json({ error: 'User ids required' });
  if (!text) return res.status(400).json({ error: 'Message required' });

  try {
    const message = await prisma.message.create({
      data: { text, senderId, receiverId },
      include: { sender: true }
    });

    const io = req.app.get('io'); 
    const receiverSocketId = userSocketMap.get(receiverId);
    
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('receive_private_message', message);
    }

    return res.status(201).json(message);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {      
      if (error.code === 'P2003') {
        return res.status(404).json({ 
          error: 'Not Found: Sender or Receiver profile does not exist' 
        });
      }
    }

    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};

export const sendGroupChat = async (
  req: Request<{}, {}, SendGroupChatBody>,
  res: Response
): Promise<Response> => {
  const { senderId, groupId, text } = req.body;

  if (!senderId || !groupId) return res.status(400).json({ error: 'Ids required' });
  if (!text) return res.status(400).json({ error: 'Message required' });

  try {
    const isMember = await prisma.group.findFirst({
      where: {
        id: groupId,
        members: {
          some: { id: senderId }
        }
      }
    });

    if (!isMember) {
      return res.status(403).json({ 
        error: 'Forbidden: You must be a member of this group to send messages' 
      });
    };

    const message = await prisma.message.create({
      data: { text, senderId, groupId },
      include: { sender: true }
    });

    const io = req.app.get('io'); 
    io.to(groupId).emit('receive_group_message', message);

    return res.status(201).json(message);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {      
      if (error.code === 'P2003') {
        return res.status(404).json({ 
          error: 'Not Found: Sender or Group profile does not exist' 
        });
      }
    }

    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};