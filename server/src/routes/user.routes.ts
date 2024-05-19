import express from 'express';
import userController from '../controllers/user.controller';
import validate from '../middlewares/validate';

const router = express.Router();

// public routes
router.get('/getUsers', userController.getUsers);

router.use(validate.cookie);

// private routes (authenticated user only)
router.put('/update', userController.updateProfile);
router.delete('/delete', userController.deleteProfile);
router.get('/getUser', userController.getUser);

export default router;
