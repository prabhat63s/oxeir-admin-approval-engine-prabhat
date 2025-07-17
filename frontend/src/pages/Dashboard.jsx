import { useEffect, useState } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import ActivityChart from '../components/ActivityChart';
import { useAuth } from '../context/AuthContext';
import StatsBarChart from '../components/StatsBarChart';

export default function Dashboard() {
    const { auth } = useAuth();
    const [stats, setStats] = useState(null);
    const [activityStats, setActivityStats] = useState([]);

    const loadStats = async () => {
        try {
            const res = await axios.get('/admin/stats');
            setStats(res.data);
        } catch (err) {
            console.error("Stats error:", err.response?.data?.message || err.message);
        }
    };

    const loadActivityStats = async () => {
        try {
            const res = await axios.get('/logs/stats/activity');
            setActivityStats(res.data);
        } catch (err) {
            toast.error("Failed to load activity stats: " + (err.response?.data?.message || err.message));
        }
    };

    useEffect(() => {
        loadStats();
        loadActivityStats();
    }, []);

    return (
        <div className="space-y-4">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
            </div>

            {/* Stats Cards */}
            {stats && (<StatsBarChart stats={stats} />)}

            {/* Activity Chart */}
            {activityStats.length > 0 && (auth.user.role === 'admin' || auth.user.role === 'superadmin') && (
                <div className="mb-6">
                    <ActivityChart data={activityStats} />
                </div>
            )}
        </div>
    );
}
