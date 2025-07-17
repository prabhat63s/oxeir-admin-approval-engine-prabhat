import { useState } from "react";
import axios from "../api/axios";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function CreateUser() {
    const navigate = useNavigate();
    const [form, setForm] = useState({
        name: "",
        email: "",
        password: "",
        role: "user"
    });

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/superadmin/create-user", form);
            toast.success("User created successfully");
            navigate("/users");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to create user");
        }
    };

    return (
        <div className="">
            <h2 className="text-2xl font-semibold mb-6">Create New User</h2>
            <form
                onSubmit={handleSubmit}
                className="bg-white w-full p-6 rounded-lg"
            >

                <div className="mb-4">
                    <label className="block text-sm mb-1">Name</label>
                    <input
                        name="name"
                        value={form.name}
                        onChange={handleChange}
                        className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        required
                        placeholder="Enter full name"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={form.email}
                        onChange={handleChange}
                        className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        required
                        placeholder="user@example.com"
                    />
                </div>

                <div className="mb-4">
                    <label className="block text-sm mb-1">Password</label>
                    <input
                        name="password"
                        type="password"
                        value={form.password}
                        onChange={handleChange}
                        className="w-full border p-2 rounded focus:outline-none focus:ring focus:ring-blue-200"
                        required
                        placeholder="At least 6 characters"
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-sm mb-1">Role</label>
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className="w-full border p-2 rounded focus:outline-none"
                    >
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                </div>

                <button
                    type="submit"
                    className="w-fit bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition"
                >
                    Create User
                </button>
            </form>
        </div>
    );
}
