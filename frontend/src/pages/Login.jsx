import { useEffect, useState } from 'react';
import axios from '../api/axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Mail, Lock, Loader2, EyeOff, Eye } from 'lucide-react';

export default function Login() {
    const { auth, login } = useAuth();
    const navigate = useNavigate();

    const [form, setForm] = useState({
        email: 'superadmin@example.com',
        password: 'superadmin123'
    });
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    // Redirect if already logged in
    useEffect(() => {
        if (auth?.token) {
            const role = auth.user?.role;
            if (role === 'admin' || role === 'superadmin') {
                navigate('/dashboard');
            } else {
                navigate('/my-submissions');
            }
        }
    }, [auth, navigate]);


    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const res = await axios.post('/auth/login', form);
            login(res.data);
            toast.success('Login successful!');
            const role = res.data.user.role;
            if (role === 'admin' || role === 'superadmin') {
                navigate('/dashboard');
            } else {
                navigate('/my-submissions');
            }
        } catch (err) {
            toast.error(err.response?.data?.message || 'Login failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-200 via-blue-100 to-white px-4">
            <form
                onSubmit={handleSubmit}
                className="w-full max-w-md bg-white rounded-2xl px-8 py-10 animate-fade-in backdrop-blur-md"
            >
                <h2 className="text-3xl font-extrabold text-center text-gray-800 mb-6">
                    Welcome Back 👋
                </h2>
                <p className="text-center text-sm text-gray-500 mb-8">
                    Please login to continue to your dashboard
                </p>

                {/* Email Field */}
                <div className="relative mb-6">
                    <Mail className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type="email"
                        name="email"
                        placeholder="Enter your email"
                        value={form.email}
                        onChange={handleChange}
                        required
                        className="pl-10 pr-4 py-3 w-full text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                </div>

                {/* Password Field */}
                <div className="relative mb-8">
                    <Lock className="absolute left-3 top-3.5 text-gray-400" size={20} />
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Enter your password"
                        value={form.password}
                        onChange={handleChange}
                        required
                        className="pl-10 pr-4 py-3 w-full text-sm border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                        title={showPassword ? "Hide Password" : "Show Password"}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex justify-center items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 rounded-lg transition"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : 'Login'}
                </button>
            </form>
        </div>
    );
}
