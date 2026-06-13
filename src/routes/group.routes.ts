import { Router } from 'express';
import {
    addGroupMember,
    createGroup,
    deleteGroup,
    getGroup,
    getGroupMembers
} from '../controllers/group.controller';

const router = Router();

router.post('/', createGroup);
router.get('/:groupId', getGroup);
router.delete('/:groupId', deleteGroup);

router.get('/:groupId/members', getGroupMembers);
router.post('/:groupId/members', addGroupMember);

export default router;