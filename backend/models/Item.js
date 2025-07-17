import mongoose from 'mongoose';

const itemSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ["Job", "Course", "Webinar", "Project"],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: String,
    company: String,      // optional: used only in jobs
    location: String,     // optional: used only in jobs
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const Item = mongoose.model("Item", itemSchema);
export default Item;
