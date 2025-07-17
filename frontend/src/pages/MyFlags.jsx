import { useEffect, useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import {
    FileText,
    MessageSquare,
    Clock,
    ShieldCheck,
} from "lucide-react"

export default function MyFlags() {
    const [flags, setFlags] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const loadFlags = async () => {
        try {
            const res = await axios.get("/user/my-flags");
            setFlags(res.data);
            setCurrentPage(1); // Reset page on fetch
        } catch (err) {
            toast.error("Failed to load your reports" + (err.response?.data?.message ? `: ${err.response.data.message}` : ""));
        }
    };

    useEffect(() => {
        loadFlags();
    }, []);

    // Pagination calculations
    const totalPages = Math.ceil(flags.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentFlags = flags.slice(indexOfFirst, indexOfLast);

    return (
        <div className="">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">My Flagged Reports</h2>

            {flags.length === 0 ? (
                <div className="text-center text-gray-500">You haven’t flagged any content yet.</div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentFlags.map((flag) => {
                            const statusColor =
                                flag.status === "pending"
                                    ? "border-yellow-400"
                                    : flag.status === "reviewed"
                                        ? "border-green-500"
                                        : "border-gray-400";

                            const statusBadge =
                                flag.status === "pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : flag.status === "reviewed"
                                        ? "bg-green-100 text-green-800"
                                        : "bg-gray-100 text-gray-600";

                            return (
                                <div
                                    key={flag._id}
                                    className={`border-l-4 ${statusColor} bg-white rounded-lg shadow-sm hover:shadow-md transition p-5`}
                                >
                                    <div className="flex justify-between items-center mb-2">
                                        <span className="text-sm font-semibold bg-blue-100 text-blue-700 px-2 py-0.5 rounded-full">
                                            {flag.itemId?.type || "Unknown"}
                                        </span>
                                        <span
                                            className={`text-xs font-medium px-2 py-1 rounded-full ${statusBadge}`}
                                        >
                                            {flag.status}
                                        </span>
                                    </div>

                                    <p className="font-semibold text-gray-800 text-base line-clamp-1 flex items-center gap-1">
                                        <FileText size={16} /> {flag.itemId?.title || "Untitled"}
                                    </p>

                                    <p className="text-sm text-gray-600 mt-2 flex items-center gap-1">
                                        <MessageSquare size={16} />
                                        <span className="font-medium">Reason:</span> {flag.reason}
                                    </p>

                                    <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                        <Clock size={16} />
                                        <span className="font-medium">Reported:</span>{" "}
                                        {new Date(flag.createdAt).toLocaleDateString("en-IN", {
                                            day: "numeric",
                                            month: "short",
                                            year: "numeric",
                                        })}
                                    </p>

                                    {flag.actionTaken && (
                                        <p className="text-sm text-gray-700 mt-2 flex items-center gap-1">
                                            <ShieldCheck size={16} />
                                            <span className="font-medium">Admin Action:</span> {flag.actionTaken}
                                        </p>
                                    )}
                                </div>
                            );
                        })}
                    </div>

                    {/* Pagination controls */}
                    {totalPages > 1 && (
                        <div className="flex justify-center gap-2 mt-8">
                            <button
                                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Prev
                            </button>
                            {[...Array(totalPages)].map((_, i) => (
                                <button
                                    key={i}
                                    onClick={() => setCurrentPage(i + 1)}
                                    className={`px-3 py-1 text-sm rounded ${currentPage === i + 1
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
                                className="px-3 py-1 bg-gray-200 text-sm rounded hover:bg-gray-300 disabled:opacity-50"
                            >
                                Next
                            </button>
                        </div>
                    )}
                </>
            )}
        </div>
    );
}
