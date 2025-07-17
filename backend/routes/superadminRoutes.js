import express from 'express';
import { createUser, deleteUser, getAllUsers } from '../controllers/userController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';
import { getAllFlags, reviewFlag } from '../controllers/flagController.js';

const router = express.Router();

// Only superadmin can access
router.post('/create-user', verifyToken, allowRoles('superadmin'), createUser);
router.get('/users', verifyToken, allowRoles('superadmin'), getAllUsers);
router.delete('/users/:id', verifyToken, allowRoles('superadmin'), deleteUser);


router.get('/flags', verifyToken, allowRoles('superadmin', 'admin'), getAllFlags);
router.put('/flags/:id/review', verifyToken, allowRoles('superadmin', 'admin'), reviewFlag);

export default router;
