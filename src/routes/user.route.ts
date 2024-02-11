import express from 'express';
import getMeController from '../controllers/user/getMe.controller';

const router = express.Router();

router.get('/me', getMeController);

export default router;
