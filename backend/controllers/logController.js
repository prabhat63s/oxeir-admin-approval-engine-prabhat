import Log from '../models/Log.js';
import User from '../models/User.js';

export const getLogs = async (req, res) => {
    try {
        const { reviewer } = req.query;

        const query = {};
        if (reviewer) {
            const admin = await User.findOne({ email: reviewer });
            if (admin) query.actionBy = admin._id;
            else return res.status(404).json({ message: "Reviewer not found" });
        }

        const logs = await Log.find(query)
            .populate("actionBy", "name email")
            .sort({ actedAt: -1 });

        res.status(200).json(logs);
    } catch (err) {
        res.status(500).json({ message: "Error fetching logs", error: err.message });
    }
};


export const getWeeklyActivity = async (req, res) => {
    try {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6); // last 7 days including today

        const logs = await Log.aggregate([
            {
                $match: {
                    actedAt: { $gte: sevenDaysAgo }
                }
            },
            {
                $group: {
                    _id: {
                        date: { $dateToString: { format: "%Y-%m-%d", date: "$actedAt" } },
                        action: "$action"
                    },
                    count: { $sum: 1 }
                }
            }
        ]);

        // Shape data into a flat per-day record
        const result = {};
        logs.forEach(log => {
            const { date, action } = log._id;
            if (!result[date]) result[date] = { date, approved: 0, rejected: 0 };
            result[date][action] = log.count;
        });

        // Fill missing days
        const output = [];
        for (let i = 6; i >= 0; i--) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            const dateStr = d.toISOString().slice(0, 10);
            output.push(result[dateStr] || { date: dateStr, approved: 0, rejected: 0 });
        }

        res.status(200).json(output);
    } catch (err) {
        res.status(500).json({ message: "Error generating activity stats", error: err.message });
    }
};
