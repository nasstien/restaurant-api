import { Router } from 'express';
import { signUp, logIn, logOut, forgotPassword, resetPassword } from '@controllers/auth';
import { protect } from '@middleware/auth';

const router = Router();

router.post('/signup', signUp);
router.post('/login', logIn);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password/:token', resetPassword);
router.post('/logout', protect, logOut);

export default router;
