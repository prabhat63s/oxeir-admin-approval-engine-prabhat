import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "../api/axios";
import toast from "react-hot-toast";

export default function SubmitForm() {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const [form, setForm] = useState({
        type: "",
        title: "",
        description: "",
    });

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (isEdit) {
            axios
                .get(`/user/my-submissions/${id}`)
                .then((res) => {
                    const { itemId, itemType } = res.data;
                    const { title, description } = itemId;
                    setForm({ title, description, type: itemType });
                })
                .catch((err) => {
                    toast.error(err.response?.data?.message || "Failed to load");
                    navigate("/my-submissions");
                });
        }
    }, [id]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            if (isEdit) {
                await axios.put(`/user/my-submissions/${id}`, form);
                toast.success("Submission updated!");
            } else {
                await axios.post(`/user/submit-item`, form);
                toast.success("Submitted for approval!");
            }
            navigate("/my-submissions");
        } catch (err) {
            toast.error(err.response?.data?.message || "Submit failed");
        }
    };

    return (
        <div className="">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-8 rounded-lg w-full"
            >
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                    {isEdit ? "Edit Submission" : "Submit for Approval"}
                </h2>

                {/* Type */}
                <label className="block mb-1 text-sm font-medium text-gray-600">Type</label>
                <select
                    name="type"
                    value={form.type}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 disabled:bg-gray-100"
                    disabled={isEdit}
                >
                    <option value="">-- Select Type --</option>
                    <option>Job</option>
                    <option>Course</option>
                    <option>Webinar</option>
                    <option>Project</option>
                </select>

                {/* Title */}
                <label className="block mb-1 text-sm font-medium text-gray-600">Title</label>
                <input
                    type="text"
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    className="w-full border rounded px-3 py-2 mb-5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
                    placeholder="Enter a clear and concise title"
                    required
                />

                {/* Description */}
                <label className="block mb-1 text-sm font-medium text-gray-600">Description</label>
                <textarea
                    name="description"
                    value={form.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full border rounded px-3 py-2 mb-6 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
                    placeholder="Provide a detailed description"
                    required
                />

                {/* Submit */}
                <button
                    type="submit"
                    className="w-fit bg-blue-600 text-white p-2 px-4 rounded font-semibold text-sm hover:bg-blue-700 transition"
                >
                    {isEdit ? "Save Changes" : "Submit"}
                </button>
            </form>
        </div>
    );
}
