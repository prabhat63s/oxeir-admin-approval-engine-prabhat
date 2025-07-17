import express from 'express';
import { loginUser } from '../controllers/authController.js';
import { loginValidator, validateRequest } from '../middlewares/validateMiddleware.js';

const router = express.Router();

// POST /api/auth/login
router.post('/login', loginValidator, validateRequest, loginUser);

export default router;
