import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { allowRoles } from '../middlewares/roleMiddleware.js';
import { getApprovalsByType, getApprovalStats, takeAction } from '../controllers/approvalController.js';

const router = express.Router();

router.get('/approvals/:type', verifyToken, allowRoles('admin', 'superadmin'), getApprovalsByType);
router.post('/approval/action', verifyToken, allowRoles('admin', 'superadmin'), takeAction);
router.get('/stats', verifyToken, allowRoles('admin', 'superadmin'), getApprovalStats);

export default router;
