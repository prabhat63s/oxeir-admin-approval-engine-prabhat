import { useEffect, useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import {
    EyeIcon,
    CheckCircleIcon,
    XCircleIcon,
    AlertTriangleIcon,
    MessageCircle,
    Tag,
    Clock,
    NotebookPen,
    UserRound,
    Flag
} from "lucide-react";

const statuses = ["all", "pending", "reviewed", "ignored"];

export default function FlagList() {
    const [flags, setFlags] = useState([]);
    const [status, setStatus] = useState("all");
    const [selectedFlag, setSelectedFlag] = useState(null);
    const [actionText, setActionText] = useState("");
    const [actionStatus, setActionStatus] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const flagsPerPage = 3;

    const fetchFlags = async () => {
        try {
            const res = await axios.get(
                status === "all" ? "/superadmin/flags" : `/superadmin/flags?status=${status}`
            );
            setFlags(res.data);
            setCurrentPage(1); // Reset page on filter change
        } catch (err) {
            toast.error("Failed to load flags" + (err.response?.data?.message ? `: ${err.response.data.message}` : ""));
        }
    };

    useEffect(() => {
        fetchFlags();
    }, [status]);

    const handleReviewSubmit = async () => {
        try {
            await axios.put(`/superadmin/flags/${selectedFlag._id}/review`, {
                status: actionStatus,
                actionTaken: actionText,
            });
            toast.success("Reviewed successfully");
            setSelectedFlag(null);
            setActionText("");
            fetchFlags();
        } catch (err) {
            toast.error("Review failed" + (err.response?.data?.message ? `: ${err.response.data.message}` : ""));
        }
    };

    const indexOfLast = currentPage * flagsPerPage;
    const indexOfFirst = indexOfLast - flagsPerPage;
    const currentFlags = flags.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(flags.length / flagsPerPage);

    return (
        <div>
            {/* Header */}
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                    <Flag size={28} strokeWidth={3} /> Content Flags
                </h2>
                <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value)}
                    className="border p-2 mb-6 rounded"
                >
                    {statuses.map((s) => (
                        <option key={s} value={s}>
                            {s.charAt(0).toUpperCase() + s.slice(1)}
                        </option>
                    ))}
                </select>
            </div>

            {/* List */}
            {flags.length === 0 ? (
                <p className="text-gray-500">No flags found.</p>
            ) : (
                <>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentFlags.map((flag) => (
                            <div
                                key={flag._id}
                                className={`bg-white p-5 rounded-xl shadow transition-all duration-200 border-l-[6px] hover:shadow-md ${flag.status === "pending"
                                    ? "border-yellow-400"
                                    : flag.status === "reviewed"
                                        ? "border-green-500"
                                        : "border-gray-400"
                                    }`}
                            >
                                {/* Header */}
                                <div className="mb-3 space-y-1">
                                    <div className="flex items-center gap-2 text-lg font-semibold text-gray-800 capitalize">
                                        <AlertTriangleIcon size={20} className="text-yellow-500" />
                                        {flag.itemId?.type || "Unknown"}: {flag.itemId?.title || "Untitled"}
                                    </div>
                                    <div className="text-sm text-gray-500 flex items-center gap-1">
                                        <UserRound size={16} className="text-gray-400" />
                                        By: <span className="text-blue-600 font-medium">{flag.flaggedBy?.name}</span> ({flag.flaggedBy?.email})
                                    </div>
                                </div>

                                {/* Details */}
                                <div className="text-sm text-gray-700 space-y-2">
                                    <p className="flex items-start gap-2">
                                        <MessageCircle size={16} className="mt-0.5 text-gray-400" />
                                        <span>
                                            <span className="text-gray-500 font-medium">Reason:</span> {flag.reason}
                                        </span>
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Clock size={16} className="text-gray-400" />
                                        Reported: {new Date(flag.createdAt).toLocaleString()}
                                    </p>
                                    <p className="flex items-center gap-2">
                                        <Tag size={16} className="text-gray-400" />
                                        Status:
                                        <span
                                            className={`ml-1 inline-block px-2 py-0.5 rounded-full text-xs font-semibold capitalize ${flag.status === "pending"
                                                ? "bg-yellow-100 text-yellow-700"
                                                : flag.status === "reviewed"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-gray-100 text-gray-600"
                                                }`}
                                        >
                                            {flag.status}
                                        </span>
                                    </p>

                                    {flag.status !== "pending" && (
                                        <>
                                            <p className="flex items-start gap-2">
                                                <NotebookPen size={16} className="mt-0.5 text-gray-400" />
                                                <span>
                                                    <span className="text-gray-500 font-medium">Action:</span> {flag.actionTaken}
                                                </span>
                                            </p>
                                            <p className="flex items-center gap-2">
                                                <UserRound size={16} className="text-gray-400" />
                                                Reviewed by: <span className="text-green-600">{flag.reviewedBy?.name}</span>
                                            </p>
                                        </>
                                    )}
                                </div>

                                {/* Actions */}
                                {flag.status === "pending" && (
                                    <div className="flex gap-3 mt-5">
                                        <button
                                            onClick={() => {
                                                setSelectedFlag(flag);
                                                setActionStatus("reviewed");
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1 text-sm bg-green-600 text-white px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                                        >
                                            <CheckCircleIcon size={16} /> Review
                                        </button>
                                        <button
                                            onClick={() => {
                                                setSelectedFlag(flag);
                                                setActionStatus("ignored");
                                            }}
                                            className="flex-1 flex items-center justify-center gap-1 text-sm bg-yellow-500 text-white px-3 py-1.5 rounded-lg hover:bg-yellow-600 transition"
                                        >
                                            <XCircleIcon size={16} /> Ignore
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>


                    {/* Pagination */}
                    {totalPages > 1 && (
                        <div className="flex justify-center items-center mt-6 gap-2">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Prev
                            </button>
                            {Array.from({ length: totalPages }, (_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 rounded text-sm ${currentPage === i + 1
                                        ? "bg-blue-600 text-white"
                                        : "bg-gray-100 hover:bg-gray-200"
                                        }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                            <button
                                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}

            {/* Modal */}
            {selectedFlag && (
                <div className="fixed inset-0 bg-black/40 z-50 flex items-center justify-center px-4">
                    <div className="bg-white w-full max-w-md p-6 rounded-lg shadow-lg animate-fadeIn">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4 flex items-center gap-2">
                            <EyeIcon className="text-blue-500" size={20} /> Take Action on Report
                        </h3>

                        <div className="text-sm mb-3 text-gray-700">
                            <p><span className="font-medium text-gray-800">Item:</span> {selectedFlag.itemId?.type || "Unknown"} - {selectedFlag.itemId?.title || "Untitled"}</p>
                            <p><span className="font-medium text-gray-800">Reported by:</span> {selectedFlag.flaggedBy?.name} ({selectedFlag.flaggedBy?.email})</p>
                        </div>

                        <label className="text-sm text-gray-600 block mb-1">Action Taken:</label>
                        <textarea
                            className="w-full border rounded p-2 mb-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                            placeholder="Describe the action taken to resolve this..."
                            value={actionText}
                            onChange={(e) => setActionText(e.target.value)}
                        />

                        <div className="flex justify-end gap-3">
                            <button
                                onClick={() => {
                                    setSelectedFlag(null);
                                    setActionText("");
                                }}
                                className="px-4 py-1 text-sm rounded text-gray-600 hover:text-gray-800 hover:underline"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReviewSubmit}
                                className="px-4 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
