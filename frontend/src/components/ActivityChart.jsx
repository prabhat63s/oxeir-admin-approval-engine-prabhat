import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

export default function ActivityChart({ data }) {
    // Fix wrong keys (approve → approved, reject → rejected)
    const normalizedData = data.map(day => ({
        ...day,
        approved: day.approved || day.approve || 0,
        rejected: day.rejected || day.reject || 0,
    }));

    return (
        <div className="bg-white p-6 rounded-xl">
            <h3 className="text-lg font-semibold mb-4">
                Weekly Activity (Approvals & Rejections)
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <LineChart data={normalizedData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Line
                        type="monotone"
                        dataKey="approved"
                        stroke="#10b981"
                        name="Approved"
                        strokeWidth={2}
                    />
                    <Line
                        type="monotone"
                        dataKey="rejected"
                        stroke="#ef4444"
                        name="Rejected"
                        strokeWidth={2}
                    />
                </LineChart>
            </ResponsiveContainer>
        </div>
    );
}
