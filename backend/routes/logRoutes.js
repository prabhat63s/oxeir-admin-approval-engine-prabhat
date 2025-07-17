import express from 'express';
import { getLogs, getWeeklyActivity } from '../controllers/logController.js';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';

const router = express.Router();

// Only admin/superadmin can see logs
router.get('/', verifyToken, allowRoles('admin', 'superadmin'), getLogs);
router.get('/stats/activity', verifyToken, allowRoles('admin', 'superadmin'), getWeeklyActivity);

export default router;
