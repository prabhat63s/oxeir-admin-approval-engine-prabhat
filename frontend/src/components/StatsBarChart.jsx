// components/StatsBarChart.jsx
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    Tooltip,
    Legend,
    ResponsiveContainer,
    CartesianGrid,
} from "recharts";

const COLORS = {
    approved: "#10b981",
    pending: "#facc15",
    rejected: "#ef4444",
};

const StatsBarChart = ({ stats }) => {
    const data = Object.entries(stats).map(([type, val]) => ({
        type,
        Approved: val.approved,
        Pending: val.pending,
        Rejected: val.rejected,
    }));

    return (
        <div className="bg-white rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Overall Approval Stats</h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} barCategoryGap="20%" margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="type" />
                    <YAxis allowDecimals={false} />
                    <Tooltip />
                    <Legend />
                    <Bar dataKey="Approved" fill={COLORS.approved} />
                    <Bar dataKey="Pending" fill={COLORS.pending} />
                    <Bar dataKey="Rejected" fill={COLORS.rejected} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default StatsBarChart;
