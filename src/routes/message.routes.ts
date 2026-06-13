import { Router } from 'express';
import { getGroupChat, getPrivateChat, sendGroupChat, sendPrivateChat } from '../controllers/message.controller';

const router = Router();

router.get('/private/:userId1/:userId2', getPrivateChat);
router.get('/group/:groupId/:userId', getGroupChat);

router.post('/private', sendPrivateChat);
router.post('/group', sendGroupChat);

export default router;