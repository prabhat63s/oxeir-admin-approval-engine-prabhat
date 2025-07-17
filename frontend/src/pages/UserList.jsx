import { useEffect, useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { Link } from "react-router-dom";
import ConfirmModal from "../components/ConfirmModal";
import { Users } from "lucide-react";

const roles = ["all", "user", "admin", "superadmin"];

export default function UserList() {
    const [users, setUsers] = useState([]);
    const [role, setRole] = useState("all");
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState(null);

    // Pagination
    const [currentPage, setCurrentPage] = useState(1);
    const usersPerPage = 8;

    const fetchUsers = async () => {
        try {
            const res = await axios.get(
                role === "all" ? "/superadmin/users" : `/superadmin/users?role=${role}`
            );
            setUsers(res.data);
            setCurrentPage(1); // reset to page 1 on new filter
        } catch (err) {
            toast.error("Failed to fetch users");
        }
    };

    useEffect(() => {
        fetchUsers();
    }, [role]);

    const openDeleteModal = (userId) => {
        setSelectedUserId(userId);
        setShowModal(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`/superadmin/users/${selectedUserId}`);
            toast.success("User deleted");
            setShowModal(false);
            setSelectedUserId(null);
            fetchUsers();
        } catch (err) {
            toast.error(err.response?.data?.message || "Delete failed");
        }
    };

    // Pagination logic
    const indexOfLast = currentPage * usersPerPage;
    const indexOfFirst = indexOfLast - usersPerPage;
    const currentUsers = users.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(users.length / usersPerPage);

    return (
        <div className="min-h-screen">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold flex items-center gap-2"><Users size={28} strokeWidth={3} /> User Management</h2>
                <div className="mb-4 flex items-center gap-4">
                    <label className="mr-2 font-medium">Filter by Role:</label>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="border p-2 rounded"
                    >
                        {roles.map((r) => (
                            <option key={r} value={r}>
                                {r.charAt(0).toUpperCase() + r.slice(1)}
                            </option>
                        ))}
                    </select>
                    <Link to="/create-user" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                        + Create User
                    </Link>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full bg-white shadow-md rounded overflow-hidden">
                    <thead className="bg-gray-100">
                        <tr className="bg-gray-200 text-sm uppercase">
                            <th className="text-left border border-gray-300 px-4 py-2">#</th>
                            <th className="text-left border border-gray-300 px-4 py-2">Name</th>
                            <th className="text-left border border-gray-300 px-4 py-2">Email</th>
                            <th className="text-left border border-gray-300 px-4 py-2">Role</th>
                            <th className="border border-gray-300 px-4 py-2 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {currentUsers.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="text-center py-4 text-gray-500">
                                    No users found.
                                </td>
                            </tr>
                        ) : (
                            currentUsers.map((user, index) => (
                                <tr key={user._id} className="border-t">
                                    <td className="px-4 border py-2">{indexOfFirst + index + 1}</td>
                                    <td className="px-4 border py-2">{user.name}</td>
                                    <td className="px-4 border py-2">{user.email}</td>
                                    <td className="px-4 border py-2 capitalize">{user.role}</td>
                                    <td className="px-4 border py-2 text-right">
                                        <button
                                            onClick={() => openDeleteModal(user._id)}
                                            className="bg-red-500 text-white px-3 py-1 rounded text-sm hover:bg-red-600"
                                        >
                                            Delete
                                        </button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {users.length > usersPerPage && (
                <div className="flex justify-center mt-6 gap-2">
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

            {/* Confirm Modal */}
            <ConfirmModal
                open={showModal}
                onClose={() => setShowModal(false)}
                onConfirm={confirmDelete}
                title="Confirm Delete"
                btnName="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
            />
        </div>
    );
}
