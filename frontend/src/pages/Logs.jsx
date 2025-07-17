import { useEffect, useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { Clock, NotebookPen, ScrollText, UserRound } from "lucide-react";

export default function Logs() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [logFilter, setLogFilter] = useState("");
    const [reviewerEmail, setReviewerEmail] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const logsPerPage = 9;

    const fetchLogs = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (reviewerEmail) params.append("reviewer", reviewerEmail);

            const res = await axios.get(`/logs?${params.toString()}`);
            setLogs(res.data);
        } catch (err) {
            toast.error("Failed to fetch logs" + (err.response?.data?.message ? `: ${err.response.data.message}` : ""));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchLogs();
    }, []);

    useEffect(() => {
        setCurrentPage(1);
    }, [logFilter, reviewerEmail]);

    const filteredLogs = logs.filter(log =>
        log.action?.toLowerCase().includes(logFilter.toLowerCase()) ||
        log.actionBy?.name?.toLowerCase().includes(logFilter.toLowerCase()) ||
        log.actionBy?.email?.toLowerCase().includes(logFilter.toLowerCase())
    );

    const indexOfLastLog = currentPage * logsPerPage;
    const indexOfFirstLog = indexOfLastLog - logsPerPage;
    const currentLogs = filteredLogs.slice(indexOfFirstLog, indexOfLastLog);

    const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

    return (
        <div className="">
            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                <ScrollText size={28} strokeWidth={3} /> Activity Logs
            </h2>

            {/* Filter Section */}
            <div className="flex flex-col md:flex-row md:flex-wrap gap-4 mb-6 bg-white p-4 rounded-lg">
                <div className="w-full md:w-auto flex-1">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Search Logs</label>
                    <input
                        type="text"
                        className="border p-2 rounded text-sm w-full"
                        placeholder="By reviewer name or action"
                        value={logFilter}
                        onChange={(e) => setLogFilter(e.target.value)}
                    />
                </div>

                <div className="w-full md:w-auto flex-1">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Reviewer Email</label>
                    <input
                        type="email"
                        placeholder="Reviewer email"
                        value={reviewerEmail}
                        onChange={(e) => setReviewerEmail(e.target.value)}
                        className="border p-2 rounded text-sm w-full"
                    />
                </div>

                <div className="w-full md:w-auto mt-2 md:mt-6">
                    <button
                        onClick={fetchLogs}
                        className="bg-blue-600 text-white w-full md:w-auto px-4 py-2 rounded hover:bg-blue-700 text-sm"
                    >
                        Filter Logs
                    </button>
                </div>
            </div>

            {/* Logs Display */}
            {loading ? (
                <p className="text-gray-500">Loading logs...</p>
            ) : currentLogs.length === 0 ? (
                <p className="text-gray-500">No matching logs found.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentLogs.map((log) => (
                        <div
                            key={log._id}
                            className="bg-white rounded hover:shadow-lg p-4 border-l-4"
                            style={{
                                borderColor:
                                    log.action === "approve"
                                        ? "#10b981" // green
                                        : "#ef4444", // red
                            }}
                        >
                            <p className="text-sm flex items-center gap-2 text-gray-800">
                                <UserRound size={18} strokeWidth={2} />{" "}
                                <strong>{log.actionBy?.name || "Unknown User"}</strong> ({log.actionBy?.email})
                            </p>
                            <p className="text-sm flex items-center gap-2 text-gray-600 mt-1 capitalize">
                                <NotebookPen size={18} strokeWidth={2} /> Action: {log.action}
                            </p>
                            <p className="text-xs flex items-center gap-2 text-gray-400 mt-1">
                                <Clock size={18} strokeWidth={2} />{" "}
                                {new Date(log.timestamp).toLocaleString("en-IN", {
                                    dateStyle: "medium",
                                    timeStyle: "short",
                                })}
                            </p>
                        </div>
                    ))}
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex items-center mt-6 justify-center gap-2">
                    <button
                        onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                        disabled={currentPage === 1}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                    >
                        Prev
                    </button>

                    {[...Array(totalPages)].map((_, i) => (
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
                        onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                        disabled={currentPage === totalPages}
                        className="px-3 py-1 rounded bg-gray-200 hover:bg-gray-300 text-sm"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
}