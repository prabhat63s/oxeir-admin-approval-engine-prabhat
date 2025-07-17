import { Outlet, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { LogOut, Menu, X, Flag, Home, Users, FileText, ScrollText, NotebookPen } from "lucide-react";
import { useState } from "react";
import ConfirmModal from "../components/ConfirmModal";

export default function CommonLayout() {
    const { auth, logout } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [showLogoutModal, setShowLogoutModal] = useState(false);


    const navLinks = [
        { label: "Dashboard", icon: <Home size={18} />, to: "/dashboard" },
        { label: "Approve", icon: <NotebookPen size={18} />, to: "/approve" },
        { label: "Users", icon: <Users size={18} />, to: "/users" },
        { label: "Flag Review", icon: <Flag size={18} />, to: "/flags" },
        { label: "Activity Logs", icon: <ScrollText size={18} />, to: "/logs" },
        { label: "My Submissions", icon: <Home size={18} />, to: "/my-submissions" },
        { label: "Submit", icon: <FileText size={18} />, to: "/submit" },
        { label: "My Reports", icon: <Flag size={18} />, to: "/my-flags" },
    ];

    // superadmin can access all
    const isSuperAdmin = auth.user?.role === "superadmin";
    // admin can access dashboard, flags, approve
    const isAdmin = auth.user?.role === "admin";
    // user can only access their own submissions and flags
    const isUser = auth.user?.role === "user";

    const visibleNavLinks = navLinks.filter((link) => {
        const isSuperAdminOnly = ["Dashboard", "Users", "Flag Review", "Activity Logs", "Approve"].includes(link.label);
        const isAdminOnly = ["Dashboard", "Flag Review", "Approve"].includes(link.label);
        const isUserOnly = ["My Submissions", "My Reports", "Submit"].includes(link.label);
        return (isSuperAdminOnly && isSuperAdmin) || (isAdminOnly && isAdmin) || (isUserOnly && isUser);
    });

    const toggleSidebar = () => setSidebarOpen(!sidebarOpen);

    return (
        <div className="flex h-screen">
            <ConfirmModal
                open={showLogoutModal}
                onClose={() => setShowLogoutModal(false)}
                onConfirm={() => {
                    logout();
                    setShowLogoutModal(false);
                }}
                title="Logout Confirmation"
                btnName="Logout"
                message="Are you sure you want to logout?"
            />

            {/* Sidebar */}
            <aside
                className={`fixed md:static top-0 left-0 h-screen w-60 bg-neutral-950 text-white p-4 space-y-4 z-40 transition-transform duration-300 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
                    } md:translate-x-0`}
            >
                <div className="flex items-center justify-between mb-6">
                    <h2 className="text-xl font-bold">{isAdmin ? "Admin Panel" : "User Panel"}</h2>
                    <button className="md:hidden" onClick={toggleSidebar}>
                        <X />
                    </button>
                </div>

                {visibleNavLinks.map((link) => (
                    <Link
                        key={link.label}
                        to={link.to}
                        className="flex items-center gap-2 px-3 py-2 rounded hover:bg-gray-700 transition"
                        onClick={() => setSidebarOpen(false)} // close on click mobile
                    >
                        {link.icon}
                        <span>{link.label}</span>
                    </Link>
                ))}
            </aside>

            {/* Main content area */}
            <div className="flex-1 flex flex-col h-screen">
                {/* Topbar */}
                <header className="bg-white shadow px-4 md:px-6 py-3 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {/* Toggle button (mobile only) */}
                        <button onClick={toggleSidebar} className="md:hidden text-gray-700">
                            <Menu />
                        </button>
                        <span className="text-gray-700 font-semibold text-lg">
                            Welcome, {auth.user?.name}
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <span className="text-sm text-gray-500 hidden sm:inline">{auth.user?.email}</span>
                        <button
                            onClick={() => setShowLogoutModal(true)}
                            className="flex items-center gap-1 text-red-600 hover:text-red-700 text-sm"
                        >
                            <LogOut size={16} /> Logout
                        </button>
                    </div>
                </header>

                {/* Page content */}
                <main className="flex-1 bg-gray-100 p-4 md:p-6 overflow-y-auto">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}
