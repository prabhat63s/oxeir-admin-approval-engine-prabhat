import mongoose from 'mongoose';

const logSchema = new mongoose.Schema({
    actionBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    itemType: {
        type: String,
        enum: ['Job', 'Course', 'Webinar', 'Project'],
        required: true
    },
    action: {
        type: String,
        enum: ['approve', 'reject'],
        required: true
    },
    comment: String,
    actedAt: {
        type: Date,
        default: Date.now
    }
});

const Log = mongoose.model('Log', logSchema);
export default Log;
