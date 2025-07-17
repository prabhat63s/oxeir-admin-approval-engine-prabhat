import ApprovalQueue from '../models/ApprovalQueue.js';
import Item from '../models/Item.js';

export const submitItem = async (req, res) => {
    const { type, title, description, company, location } = req.body;

    try {
        const item = await Item.create({
            type,
            title,
            description,
            createdBy: req.user.id
        });

        // Send to approval queue
        await ApprovalQueue.create({
            itemType: type,
            itemId: item._id,
            submittedBy: req.user.id,
            status: "pending",
            submittedAt: new Date()
        });

        res.status(201).json({ message: `${type} submitted`, item });
    } catch (err) {
        res.status(500).json({ message: "Failed to submit", error: err.message });
    }
};

export const getMySubmissions = async (req, res) => {
    const { type } = req.query;

    try {
        const query = { submittedBy: req.user.id };
        if (type) query.itemType = type;

        const submissions = await ApprovalQueue.find(query)
            .sort({ submittedAt: -1 }).populate("itemId");

        res.status(200).json(submissions);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submissions', error: error.message });
    }
};

export const getMySubmissionsById = async (req, res) => {
    const { id } = req.params;
    try {
        const submission = await ApprovalQueue.findOne({
            _id: id,
            submittedBy: req.user.id
        }).populate("itemId");

        if (!submission)
            return res.status(404).json({ message: "Submission not found" });

        res.status(200).json(submission);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching submission', error: error.message });
    }
};

export const updateItem = async (req, res) => {
    const { id } = req.params;
    const { title, description } = req.body;

    try {
        const submission = await ApprovalQueue.findOne({
            _id: id,
            submittedBy: req.user.id
        });

        if (!submission) {
            return res.status(404).json({ message: "Submission not found" });
        }

        // Update the linked item
        await Item.findByIdAndUpdate(submission.itemId, {
            title,
            description
        });

        res.status(200).json({ message: "Submission updated" });
    } catch (error) {
        res.status(500).json({ message: "Update failed", error: error.message });
    }
};

export const deleteMySubmission = async (req, res) => {
    try {
        const { id } = req.params;
        const item = await ApprovalQueue.findById(id);

        if (!item) return res.status(404).json({ message: "Submission not found" });

        if (item.submittedBy.toString() !== req.user.id)
            return res.status(403).json({ message: "Unauthorized" });

        if (item.status !== "pending")
            return res.status(400).json({ message: "Only pending items can be deleted" });

        await ApprovalQueue.findByIdAndDelete(id);
        res.status(200).json({ message: "Submission deleted successfully" });
    } catch (err) {
        res.status(500).json({ message: "Server error", error: err.message });
    }
};