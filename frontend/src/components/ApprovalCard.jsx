import {
    FilePenLine,
    Trash2,
    CalendarCheck,
    MessageSquareText,
} from "lucide-react";

export default function ApprovalCard({ item, onOpen }) {
    const { itemType, submittedAt, status, comment, escalated } = item;

    const statusStyles = {
        pending: "bg-yellow-100 text-yellow-700",
        approved: "bg-green-100 text-green-700",
        rejected: "bg-red-100 text-red-600"
    };

    return (
        <div className="bg-white rounded-lg hover:shadow-md transition p-5 flex flex-col border-l-4"
            style={{
                borderColor:
                    status === "pending"
                        ? "#facc15"
                        : status === "approved"
                            ? "#10b981"
                            : "#ef4444"
            }}
        >
            <div className="flex justify-between items-center w-full">
                <div className="flex items-center gap-2">
                    <span className="text-sm font-semibold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                        {itemType}
                    </span>
                    <span className={`text-xs font-medium px-2 py-1 rounded-full ${statusStyles[status]}`}>
                        {status}
                    </span>
                </div>
                <button
                    onClick={() => onOpen(item)}
                    className="text-sm bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                    View Details
                </button>
            </div>
            <p className="flex items-center gap-1 text-gray-800 font-medium text-xs mt-2">
                <CalendarCheck size={16} /> Submitted: {new Date(submittedAt).toLocaleDateString()}
            </p>

            <p className="flex items-center gap-1 text-xs text-gray-500 mt-1">
                <MessageSquareText size={16} /> Admin Comment: <span className="italic">{comment}</span>
            </p>

            {escalated && (
                <span className="inline-block bg-yellow-100 text-yellow-800 px-2 py-0.5 text-xs rounded mt-2">
                    Escalated
                </span>
            )}
        </div>
    );
}
