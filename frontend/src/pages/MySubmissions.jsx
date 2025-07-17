import { useEffect, useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import FlagButton from "../components/FlagButton";
import ConfirmModal from "../components/ConfirmModal";
import {
    FilePenLine,
    Trash2,
    CalendarCheck,
    MessageSquareText,
} from "lucide-react";

const types = ["All", "Job", "Course", "Webinar", "Project"];

export default function MySubmissions() {
    const [submissions, setSubmissions] = useState([]);
    const [type, setType] = useState("All");
    const [toDeleteId, setToDeleteId] = useState(null);

    // Pagination states
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const loadSubmissions = async () => {
        try {
            const res = await axios.get(
                type === "All" ? "/user/my-submissions" : `/user/my-submissions?type=${type}`
            );
            setSubmissions(res.data);
            setCurrentPage(1); // Reset to page 1 on reload
        } catch (err) {
            toast.error("Failed to load submissions", err.response?.data?.message || "");
        } 
    };

    useEffect(() => {
        loadSubmissions();
    }, [type]);

    const handleDelete = async () => {
        try {
            await axios.delete(`/user/my-submissions/${toDeleteId}`);
            toast.success("Submission deleted");
            setToDeleteId(null);
            loadSubmissions();
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    };

    const totalPages = Math.ceil(submissions.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentSubmissions = submissions.slice(indexOfFirst, indexOfLast);

    return (
        <div className="min-h-screen">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold ">
                    My Submissions
                </h2>
                <select
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    className="border border-gray-300 rounded px-3 py-1 text-sm"
                >
                    {types.map((t) => (
                        <option key={t} value={t}>
                            {t}
                        </option>
                    ))}
                </select>
            </div>

            {currentSubmissions.length === 0 ? (
                <div className="text-center py-20 text-gray-500 text-sm">
                    No submissions found for <strong>{type}</strong>.
                </div>
            ) : (
                <>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {currentSubmissions.map((item) => (
                            <div
                                key={item._id}
                                className={`relative bg-white rounded-xl p-5 shadow-sm hover:shadow-md transition border-l-4`}
                                style={{
                                    borderColor:
                                        item.status === "pending"
                                            ? "#facc15"
                                            : item.status === "approved"
                                                ? "#10b981"
                                                : "#ef4444",
                                }}
                            >
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-sm px-2 py-1 bg-blue-100 text-blue-700 rounded-full capitalize font-medium">
                                        {item.itemType}
                                    </span>
                                    <span
                                        className={`text-xs px-2 py-1 rounded-full font-medium capitalize ${item.status === "approved"
                                                ? "bg-green-100 text-green-700"
                                                : item.status === "pending"
                                                    ? "bg-yellow-100 text-yellow-800"
                                                    : "bg-red-100 text-red-600"
                                            }`}
                                    >
                                        {item.status}
                                    </span>
                                </div>

                                <h3 className="text-base font-semibold capitalize text-gray-800 line-clamp-1">
                                    {item.itemId?.title || "Untitled Submission"}
                                </h3>

                                <p className="text-sm text-gray-500 mt-1 flex items-center gap-1">
                                    <CalendarCheck size={16} />
                                    Submitted on:{" "}
                                    {new Date(item.submittedAt).toLocaleDateString("en-IN", {
                                        day: "numeric",
                                        month: "short",
                                        year: "numeric",
                                    })}
                                </p>

                                {item.comment && (
                                    <p className="text-xs text-gray-500 mt-1 italic flex items-center gap-1">
                                        <MessageSquareText size={14} /> Admin comment: {item.comment}
                                    </p>
                                )}

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {item.status === "pending" && (
                                        <>
                                            <Link
                                                to={`/edit/${item._id}`}
                                                className="text-sm px-4 py-1.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition flex items-center gap-1"
                                            >
                                                <FilePenLine size={14} /> Edit
                                            </Link>
                                            <button
                                                onClick={() => setToDeleteId(item._id)}
                                                className="text-sm px-4 py-1.5 bg-red-500 text-white rounded hover:bg-red-600 transition flex items-center gap-1"
                                            >
                                                <Trash2 size={14} /> Delete
                                            </button>
                                        </>
                                    )}
                                    <FlagButton itemId={item.itemId} />
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Pagination Controls */}
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

            <ConfirmModal
                open={!!toDeleteId}
                onClose={() => setToDeleteId(null)}
                onConfirm={handleDelete}
                title="Are you sure?"
                btnName="Delete Submission"
                message="This action cannot be undone. Are you sure you want to delete this submission?"
            />
        </div>
    );
}
