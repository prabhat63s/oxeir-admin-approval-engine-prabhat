import dotenv from 'dotenv';
import mongoose from 'mongoose';
import ApprovalQueue from '../models/ApprovalQueue.js';

dotenv.config();
await mongoose.connect(process.env.MONGO_URI);

const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

const result = await ApprovalQueue.updateMany(
    {
        status: "pending",
        submittedAt: { $lte: sevenDaysAgo },
        escalated: { $ne: true }
    },
    {
        $set: { escalated: true }
    }
);

console.log(`⏫ Escalated ${result.modifiedCount} submissions`);
process.exit();
