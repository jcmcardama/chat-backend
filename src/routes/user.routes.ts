import { Router } from 'express';
import { 
    createUser,
    getUsers,
    getUser,
    deleteUser,
    updateUser,
    getUserPrivateChatList,
    getUserGroups
} from '../controllers/user.controller'; 

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/:id', getUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

router.get('/:id/groups', getUserGroups);
router.get('/:id/private-chats', getUserPrivateChatList);

export default router;