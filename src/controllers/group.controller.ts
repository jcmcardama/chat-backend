import { Request, Response } from 'express';
import { prisma } from '../config/prisma';
import { AddGroupMemberBody, CreateGroupBody, GroupParams } from '../types/types';
import { Prisma } from '../../prisma/generated/client/client';

export const createGroup = async (
  req: Request<{}, {}, CreateGroupBody>, 
  res: Response
): Promise<Response> => {
  const { name, memberIds } = req.body;
  if (!name || !Array.isArray(memberIds)) {
    return res.status(400).json({ error: 'Invalid group format payloads' });
  }

  try {
    const group = await prisma.group.create({
      data: {
        name,
        members: {
          connect: memberIds.map(id => ({ id }))
        }
      },
      include: { members: true }
    });
    return res.status(201).json(group);
  } catch (error) {
    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};

export const getGroup = async (
  req: Request<GroupParams>,
  res: Response
): Promise<Response> => {
  const { groupId } = req.params;

  if (!groupId) return res.status(400).json({ error: 'Group id required' });

  try {
    const group = await prisma.group.findUnique({
      where: { id: groupId }
    });

    return res.status(200).json(group);
  } catch (error) {
    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteGroup = async (
  req: Request<GroupParams>,
  res: Response
): Promise<Response> => {
  const { groupId } = req.params;

  if (!groupId) return res.status(400).json({ error: 'Group id required' });

  try {
    const deletedGroup = await prisma.group.delete({
      where: { id: groupId },
    });

    return res.status(200).json({
      message: 'Group deleted successfully',
      group: deletedGroup
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Not Found: Group does not exist or has already been deleted' 
        });
      }
    }

    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getGroupMembers = async (
  req: Request<GroupParams>, 
  res: Response
): Promise<Response> => {
  const { groupId } = req.params;

  if (!groupId) return res.status(400).json({ error: 'Group id required' });

  try {
    const members = await prisma.group
      .findUnique({ where: { id: groupId } })
      .members({
        select: {
          id: true,
          username: true,
          createdAt: true
        },
        orderBy: { createdAt: 'desc' }
      });

    if (!members) {
      return res.status(404).json({ error: 'Group not found' });
    }

    return res.status(200).json(members);
  } catch (error) {
    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};

export const addGroupMember = async (
  req: Request<GroupParams, {}, AddGroupMemberBody>,
  res: Response
): Promise<Response> => {
  const { groupId } = req.params;
  const { memberIds } = req.body;

  if (!groupId) return res.status(400).json({ error: 'Group id required' });
  if (!Array.isArray(memberIds)) return res.status(400).json({ error: 'Invalid payload: memberIds must be an array of strings' });

  try {
    const updatedGroup = await prisma.group.update({
      where: { id: groupId },
      data: {
        members: {
          connect: memberIds.map(id => ({ id }))
        }
      },
      include: {
        members: {
          select: { id: true, username: true }
        }
      }
    });

    return res.status(200).json(updatedGroup);
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {      
      if (error.code === 'P2025') {
        return res.status(404).json({ 
          error: 'Not Found: Target group does not exist, or one of the provided member IDs is invalid' 
        });
      }
    }

    console.error('[Database Error]:', error);
    return res.status(500).json({ error: 'Internal server error processing modification' });
  }
};