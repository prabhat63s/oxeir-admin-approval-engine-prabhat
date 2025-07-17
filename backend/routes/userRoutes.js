import express from 'express';
import { verifyToken } from '../middlewares/authMiddleware.js';
import { deleteMySubmission, getMySubmissions, getMySubmissionsById, submitItem, updateItem } from '../controllers/submissionController.js';
import { flagContent } from '../controllers/userController.js';
import { getMyFlags } from '../controllers/flagController.js';

const router = express.Router();

router.post('/submit-item', verifyToken, submitItem);
router.get('/my-submissions', verifyToken, getMySubmissions);
router.get('/my-submissions/:id', verifyToken, getMySubmissionsById);
router.put('/my-submissions/:id', verifyToken, updateItem);
router.delete('/my-submissions/:id', verifyToken, deleteMySubmission);

router.post('/flag', verifyToken, flagContent);
router.get('/my-flags', verifyToken, getMyFlags);

export default router;
