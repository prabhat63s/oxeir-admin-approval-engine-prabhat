import { useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

export default function ApprovalModal({ item, onClose, onAction }) {
    const [comment, setComment] = useState("");

    const handleAction = async (action) => {
        if (action === "approve" && comment.trim().length < 5) {
            toast.error("Please provide a comment with at least 5 characters for approval.");
            return;
        }
        if (action === "reject" && comment.trim().length < 5) {
            toast.error("Please provide a comment with at least 5 characters for rejection.");
            return;
        }
        try {
            await axios.post("/admin/approval/action", {
                itemId: item.itemId,
                itemType: item.itemType,
                action,
                comment,
            });
            toast.success(`Item ${action}d successfully!`);
            onAction();
            onClose();
        } catch (err) {
            toast.error("Action failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto relative animate-fadeIn">

                {/* Close Button */}
                <button
                    className="absolute top-3 right-4 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={onClose}
                    title="Close"
                >
                    &times;
                </button>

                <h2 className="text-2xl font-semibold text-gray-800 mb-4 border-b pb-2">
                    Review {item.itemType} Submission
                </h2>

                {/* Item Info Card */}
                <div className="bg-gray-50 border rounded-lg p-4 mb-4">
                    <div className="text-sm text-gray-700 space-y-2">
                        <p><span className="font-semibold">Item ID:</span> {item.itemId._id}</p>
                        <p><span className="font-semibold">Title:</span> {item.itemId.title}</p>
                        <p><span className="font-semibold">Description:</span> {item.itemId.description}</p>
                        <p><span className="font-semibold">Submitted:</span> {new Date(item.submittedAt).toLocaleString()}</p>
                        <p><span className="font-semibold">Submitted By:</span> {item.submittedBy?.name} ({item.submittedBy?.email})</p>
                    </div>
                </div>

                {/* Comment Box */}
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Comment for decision <span className="text-gray-400">(optional)</span>
                </label>
                <textarea
                    className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
                    rows={4}
                    placeholder="Why are you approving or rejecting this item?"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 mt-6">
                    <button
                        onClick={() => handleAction("reject")}
                        className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-medium shadow"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => handleAction("approve")}
                        className="bg-green-600 hover:bg-green-700 text-white px-5 py-2 rounded-md text-sm font-medium shadow"
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
}
