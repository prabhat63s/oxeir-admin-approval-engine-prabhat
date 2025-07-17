import mongoose from 'mongoose';

const approvalQueueSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    itemType: {
        type: String,
        enum: ['Job', 'Course', 'Webinar', 'Project'],
        required: true
    },
    title: {
        type: String,
    },
    description: {
        type: String,
    },
    submittedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'approved', 'rejected'],
        default: 'pending'
    },
    submittedAt: {
        type: Date,
        default: Date.now
    },
    reviewedAt: Date,
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    comment: String,
    escalated: { type: Boolean, default: false }

}, { timestamps: true });

const ApprovalQueue = mongoose.model('ApprovalQueue', approvalQueueSchema);
export default ApprovalQueue;
