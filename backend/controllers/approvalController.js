import ApprovalQueue from '../models/ApprovalQueue.js';
import Log from '../models/Log.js';
import User from '../models/User.js';
import sendEmail from '../utils/sendEmail.js';

export const takeAction = async (req, res) => {
    const { itemId, itemType, action, comment } = req.body;

    if (!['approve', 'reject'].includes(action)) {
        return res.status(400).json({ message: 'Invalid action' });
    }

    try {
        const approval = await ApprovalQueue.findOne({ itemId, itemType });

        if (!approval) return res.status(404).json({ message: 'Item not found' });

        approval.status = action === 'approve' ? 'approved' : 'rejected';
        approval.reviewedAt = new Date();
        approval.reviewedBy = req.user.id;
        approval.comment = comment;
        await approval.save();

        // Send email to submitter
        const submitter = await User.findById(approval.submittedBy);

        const subject = action === 'approve'
            ? 'Your submission was approved!'
            : 'Your submission was rejected';

        const html = `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #eee; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: ${action === 'approve' ? '#2e7d32' : '#c62828'};">Submission ${approval.status.charAt(0).toUpperCase() + approval.status.slice(1)}</h2>
    <p>Dear <strong>${submitter.name}</strong>,</p>
    <p>Your <strong>${itemType.toLowerCase()}</strong> submission has been <strong>${approval.status}</strong> by the admin team.</p>
    
    <div style="background: #fff; padding: 15px; margin: 20px 0; border-left: 4px solid ${action === 'approve' ? '#4caf50' : '#f44336'};">
      <p style="margin: 0;"><strong>Review Comment:</strong></p>
      <p style="margin: 0; color: #555;">${comment || 'No additional comments provided.'}</p>
    </div>

    <p>If you have any questions, feel free to reach out to us.</p>

    <p style="margin-top: 30px;">Best regards,<br/><strong>Admin Approval Team</strong></p>
    <hr style="border-top: 1px dashed #ccc; margin-top: 30px;" />
    <p style="font-size: 12px; color: #999;">This is an automated message, please do not reply directly to this email.</p>
  </div>
`;


        await sendEmail({ to: submitter.email, subject, html });

        await Log.create({
            actionBy: req.user.id,
            itemId,
            itemType,
            action,
            comment
        });

        res.status(200).json({ message: `Item ${action}d and email sent successfully` });
    } catch (error) {
        res.status(500).json({ message: 'Action failed', error: error.message });
    }
};

export const getApprovalsByType = async (req, res) => {
    const { type } = req.params;
    const { status, email, startDate, endDate } = req.query;

    let query = { itemType: type };

    if (status) query.status = status;
    if (email) {
        const user = await User.findOne({ email });
        if (user) query.submittedBy = user._id;
        else return res.status(404).json({ message: "User not found" });
    }
    if (startDate || endDate) {
        query.submittedAt = {};
        if (startDate) query.submittedAt.$gte = new Date(startDate);
        if (endDate) query.submittedAt.$lte = new Date(endDate);
    }

    const items = await ApprovalQueue.find(query)
        .populate('submittedBy', 'name email')
        .populate('itemId', 'title description')
        .sort({ submittedAt: -1 });

    res.status(200).json(items);
};


export const getApprovalStats = async (req, res) => {
    try {
        const types = ['Job', 'Course', 'Webinar', 'Project'];
        const stats = {};

        for (let type of types) {
            const [approved, pending, rejected] = await Promise.all([
                ApprovalQueue.countDocuments({ itemType: type, status: 'approved' }),
                ApprovalQueue.countDocuments({ itemType: type, status: 'pending' }),
                ApprovalQueue.countDocuments({ itemType: type, status: 'rejected' }),
            ]);

            stats[type] = { approved, pending, rejected };
        }

        res.status(200).json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch stats', error: error.message });
    }
};
