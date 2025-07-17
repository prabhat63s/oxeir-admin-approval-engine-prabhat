import { useState } from "react";
import toast from "react-hot-toast";
import axios from "../api/axios";

export default function FlagButton({ itemId }) {
    const [open, setOpen] = useState(false);
    const [reason, setReason] = useState("");
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async () => {
        if (!itemId) return toast.error("Invalid item to report");
        if (!reason.trim()) return toast.error("Please provide a reason");

        try {
            setSubmitting(true);
            await axios.post("/user/flag", { itemId, reason });
            toast.success("Content flagged for review");
            setOpen(false);
            setReason("");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to flag");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-xs text-red-600 underline hover:text-red-800"
            >
                Report
            </button>

            {open && (
                <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg shadow-xl w-[90%] max-w-md p-6">
                        <h2 className="text-lg font-semibold mb-3">🚩 Report Content</h2>
                        <textarea
                            placeholder="Why are you reporting this?"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            className="w-full border rounded p-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-red-300"
                            rows={4}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                onClick={() => setOpen(false)}
                                disabled={submitting}
                                className="text-gray-500 text-sm hover:underline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmit}
                                disabled={!reason.trim() || submitting}
                                className="bg-red-600 text-white px-4 py-1 text-sm rounded hover:bg-red-700 disabled:opacity-50"
                            >
                                {submitting ? "Submitting..." : "Submit Report"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
