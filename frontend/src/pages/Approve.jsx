import { useEffect, useState } from 'react';
import axios from '../api/axios';
import ApprovalCard from '../components/ApprovalCard';
import ApprovalModal from '../components/ApprovalModal';
import DownloadCSV from '../components/DownloadCSV';
import { NotebookPen } from 'lucide-react';
import toast from 'react-hot-toast';

const tabs = ["Job", "Course", "Webinar", "Project"];

export default function Approve() {
    const [active, setActive] = useState("Job");
    const [submissions, setSubmissions] = useState([]);
    const [selected, setSelected] = useState(null);
    const [status, setStatus] = useState('');
    const [emailFilter, setEmailFilter] = useState('');
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [escalatedOnly, setEscalatedOnly] = useState(false);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;

    const loadSubmissions = async () => {
        try {
            const params = new URLSearchParams();
            if (status) params.append('status', status);
            if (emailFilter) params.append('email', emailFilter);
            if (startDate) params.append("startDate", startDate);
            if (endDate) params.append("endDate", endDate);

            const res = await axios.get(`/admin/approvals/${active}?${params.toString()}`);
            setSubmissions(res.data);
            setCurrentPage(1); // Reset to first page on filter change
        } catch (err) {
            toast.error("Failed to load: " + (err.response?.data?.message || err.message));
        }
    };

    useEffect(() => {
        setStatus('');
        setEmailFilter('');
        setStartDate('');
        setEndDate('');
        setEscalatedOnly(false);
        loadSubmissions();
    }, [active]);

    const filteredData = escalatedOnly
        ? submissions.filter(item => item.escalated)
        : submissions;

    const totalPages = Math.ceil(filteredData.length / itemsPerPage);
    const indexOfLast = currentPage * itemsPerPage;
    const indexOfFirst = indexOfLast - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirst, indexOfLast);

    return (
        <div className="">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold flex items-center gap-2 text-gray-800"><NotebookPen size={28} strokeWidth={3} /> Approval</h1>
            </div>

            {/* Tab Navigation */}
            <div className="flex flex-wrap gap-3 mb-6">
                {tabs.map(tab => (
                    <button
                        key={tab}
                        onClick={() => setActive(tab)}
                        className={`px-4 py-2 text-sm rounded-full transition border ${active === tab
                            ? "bg-blue-600 text-white shadow"
                            : "bg-white text-gray-800 hover:bg-blue-50"
                            }`}
                    >
                        {tab}
                    </button>
                ))}
            </div>

            {/* Filters */}
            <div className="flex flex-col md:flex-row md:flex-wrap md:items-end gap-4 mb-6 bg-white p-4 rounded-lg">
                <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Status</label>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        className="border p-2 rounded text-sm w-full md:w-40"
                    >
                        <option value="">All</option>
                        <option value="pending">Pending</option>
                        <option value="approved">Approved</option>
                        <option value="rejected">Rejected</option>
                    </select>
                </div>

                <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Email</label>
                    <input
                        type="email"
                        placeholder="Submitter Email"
                        className="border p-2 rounded text-sm w-full md:w-56"
                        value={emailFilter}
                        onChange={(e) => setEmailFilter(e.target.value)}
                    />
                </div>

                <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium mb-1 text-gray-700">Start Date</label>
                    <input
                        type="date"
                        className="border p-2 rounded text-sm w-full"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                    />
                </div>

                <div className="w-full md:w-auto">
                    <label className="block text-sm font-medium mb-1 text-gray-700">End Date</label>
                    <input
                        type="date"
                        className="border p-2 rounded text-sm w-full"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                    />
                </div>

                <div className="flex items-center gap-2 md:mb-2 w-full md:w-auto">
                    <input
                        type="checkbox"
                        id="escalated"
                        className="accent-blue-600"
                        checked={escalatedOnly}
                        onChange={(e) => setEscalatedOnly(e.target.checked)}
                    />
                    <label htmlFor="escalated" className="text-sm text-gray-700">Escalated Only</label>
                </div>

                <div className="w-full md:w-auto">
                    <button
                        onClick={loadSubmissions}
                        className="bg-blue-600 text-white w-full md:w-auto px-4 py-2.5 rounded hover:bg-blue-700 text-sm"
                    >
                        Apply Filters
                    </button>
                </div>

                {submissions.length > 0 && (
                    <div className="w-full md:w-auto">
                        <DownloadCSV
                            data={filteredData}
                            filename={`${active.toLowerCase()}-${Date.now()}.csv`}
                            label={`${active} CSV`}
                        />
                    </div>
                )}
            </div>


            {/* Content Display */}
            {currentItems.length === 0 ? (
                <p className="text-gray-500 text-center py-6">No {active.toLowerCase()} data available.</p>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {currentItems.map(item => (
                        <ApprovalCard key={item._id} item={item} onOpen={setSelected} />
                    ))}
                </div>
            )}

            {/* Pagination Controls */}
            {totalPages > 1 && (
                <div className="flex justify-center gap-2 mt-6">
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

            {/* Modal */}
            {selected && (
                <ApprovalModal
                    item={selected}
                    onClose={() => setSelected(null)}
                    onAction={loadSubmissions}
                />
            )}
        </div>
    );
}
