import express from 'express';
import authController from '../controllers/auth.controller';

const router = express.Router();

router.post('/signup', authController.signup);
router.post('/new-verification', authController.newVerification);
router.post('/signin', authController.signin);

export default router;
