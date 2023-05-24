import express from 'express';
import authController from '../../controllers/authControllers.js';
import verifyUserToken from '../../midlewares/verify_user_token.js';

const router = express.Router();

router.post('/login', authController.login);

router.get(
  '/user_information',
  verifyUserToken,
  authController.user_information
);

router.post('/signup', authController.createNewUser);

router.put('/update_user', verifyUserToken, authController.updateUser);

router.post('/forgot_password', authController.forgotPassword);

router.put('/new_password', authController.newPassword);

export default router;
