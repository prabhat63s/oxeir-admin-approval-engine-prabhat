import mongoose from 'mongoose';

const flagSchema = new mongoose.Schema({
    itemId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Item",
        required: true
    },
    reason: { type: String, required: true },
    flaggedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    status: {
        type: String,
        enum: ["pending", "reviewed", "ignored"],
        default: "pending"
    },
    actionTaken: String,
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    reviewedAt: Date,
    createdAt: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model("Flag", flagSchema);
