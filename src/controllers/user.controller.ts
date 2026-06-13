import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { Prisma } from '../../prisma/generated/client/client';
import { UserParams, UpdateUserBody } from '../types/types';

export const createUser = async (req: Request, res: Response): Promise<Response> => {
  const { username } = req.body;

  if (!username) return res.status(400).json({ error: 'Username required' });

  try {
    const user = await prisma.user.create({ data: { username } });

    return res.status(201).json(user);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2002') {
        return res.status(409).json({ error: 'Conflict: Username already exists' });
      }
    }

    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error occurred' });
  }
};

export const getUsers = async (req: Request, res: Response): Promise<Response> => {
  try {
    const users = await prisma.user.findMany({
      orderBy: { createdAt: 'desc' }
    });

    return res.status(200).json(users);
  } catch (error) {
    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};
  
export const getUser = async (
  req: Request<UserParams>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'User ID required' });

  try {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return res.status(200).json(user);
  } catch (error) {
    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};

export const updateUser = async (
  req: Request<UserParams, {}, UpdateUserBody>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;
  const { username } = req.body;

  if (!id) return res.status(400).json({ error: 'User ID required' });
  if (!username) return res.status(400).json({ error: 'New username value required' });

  try {
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { username }
    });

    return res.status(200).json(updatedUser);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {      
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Not Found: User does not exist' 
        });
      }

      if (error.code === 'P2002') {
        return res.status(409).json({ 
          error: 'Conflict: Username is already taken by another profile' 
        });
      }
    }

    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};

export const deleteUser = async (
  req: Request<UserParams>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'User ID required' });

  try {
    const deletedUser = await prisma.user.delete({
      where: { id },
    });

    return res.status(200).json({
      message: 'User deleted successfully',
      user: deletedUser
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Not Found: User does not exist or has already been deleted' 
        });
      }
    }

    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getUserGroups = async (
  req: Request<UserParams>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'User ID required' });

  try {
    const groups = await prisma.group.findMany({
      where: {
        members: { some: { id } }
      },
      select: { id: true, name: true }
    });

    return res.status(200).json(groups);
  } catch (error) {
    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};

export const getUserPrivateChatList = async (
  req: Request<UserParams>,
  res: Response
): Promise<Response> => {
  const { id } = req.params;

  if (!id) return res.status(400).json({ error: 'User id required' });

  try {
    const chatPartners = await prisma.user.findMany({
      where: {
        id: { not: id },
        OR: [
          { sentMessages: { some: { receiverId: id, groupId: null } } },
          { receivedMessages: { some: { senderId: id, groupId: null } } }
        ]
      },
      select: { id: true, username: true }
    });

    return res.status(200).json(chatPartners);
  } catch (error) {
    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};