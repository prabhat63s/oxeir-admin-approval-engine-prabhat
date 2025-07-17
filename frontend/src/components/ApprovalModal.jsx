import { useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";

export default function ApprovalModal({ item, onClose, onAction }) {
    const [comment, setComment] = useState("");

    const handleAction = async (action) => {
        try {
            await axios.post("/admin/approval/action", {
                itemId: item.itemId,
                itemType: item.itemType,
                action,
                comment
            });
            toast.success(`Item ${action}d successfully!`);
            onAction();
            onClose();
        } catch (err) {
            toast.error("Action failed: " + (err.response?.data?.message || err.message));
        }
    };

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-6 w-[90%] max-w-lg relative animate-fadeIn">
                {/* Close Button */}
                <button
                    className="absolute top-2 right-3 text-gray-400 hover:text-gray-600 text-xl"
                    onClick={onClose}
                >
                    &times;
                </button>

                <h2 className="text-xl font-bold text-gray-800 mb-3">
                    Review {item.itemType} Submission
                </h2>

                <div className="text-sm text-gray-700 mb-2">
                    <p><strong>Item ID:</strong> {item.itemId}</p>
                    <p><strong>Submitted:</strong> {new Date(item.submittedAt).toLocaleString()}</p>
                </div>

                <label className="block text-sm font-medium mt-4 mb-1 text-gray-700">
                    Comment for decision
                </label>
                <textarea
                    className="w-full border rounded p-2 text-sm focus:outline-none focus:ring focus:ring-blue-300"
                    rows={4}
                    placeholder="Enter comment for approve/reject"
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                />

                <div className="flex justify-end gap-3 mt-4">
                    <button
                        onClick={() => handleAction("reject")}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded text-sm transition"
                    >
                        Reject
                    </button>
                    <button
                        onClick={() => handleAction("approve")}
                        className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded text-sm transition"
                    >
                        Approve
                    </button>
                </div>
            </div>
        </div>
    );
}
