import Flag from "../models/Flag.js";
import Item from "../models/Item.js";

export const getAllFlags = async (req, res) => {
    const { status } = req.query;

    try {
        const query = status ? { status } : {};
        const flags = await Flag.find(query)
            .populate("itemId", "title type description")
            .populate("flaggedBy", "name email")
            .populate("reviewedBy", "name email")
            .sort({ createdAt: -1 });

        res.status(200).json(flags);
    } catch (err) {
        res.status(500).json({ message: "Error fetching flags", error: err.message });
    }
};

export const reviewFlag = async (req, res) => {
    const { id } = req.params;
    const { status, actionTaken } = req.body;

    if (!["reviewed", "ignored"].includes(status)) {
        return res.status(400).json({ message: "Invalid status" });
    }

    try {
        const updated = await Flag.findByIdAndUpdate(
            id,
            {
                status,
                actionTaken,
                reviewedAt: new Date(),
                reviewedBy: req.user.id
            },
            { new: true }
        );

        res.status(200).json({ message: "Flag reviewed", updated });
    } catch (err) {
        res.status(500).json({ message: "Review failed", error: err.message });
    }
};

export const getMyFlags = async (req, res) => {
    try {
        const flags = await Flag.find({ flaggedBy: req.user.id })
            .populate("itemId", "title type description")
            .sort({ createdAt: -1 });

        res.status(200).json(flags);
    } catch (err) {
        res.status(500).json({ message: "Failed to fetch your flags", error: err.message });
    }
};