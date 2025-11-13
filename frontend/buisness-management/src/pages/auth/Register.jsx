import { useEffect, useState } from 'react';
import { User, Mail, Lock, Eye, EyeOff, ArrowRight, Briefcase, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { validateEmail, validatePassword, validFullName } from '../../utils/helper';
import { registerStaff } from '../../Redux/slices/staff/staffSlice';
import { useDispatch, useSelector } from 'react-redux';

const Register = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, staff } = useSelector((state) => state.staff)

    useEffect(() => {
        if (staff) {
            navigate("/");
        }
    }, [staff, navigate])

    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [err, setErr] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();

        if (!validFullName(fullName)) {
            setErr("Name should contain only letters and spaces");
            return;
        }

        if (!validateEmail(email)) {
            setErr("please enter a valid email address");
            return;
        }

        if (!validatePassword(password)) {
            setError("Password must be at least 6 characters with letters and numbers");
            return;
        }
        try {
            const resultAction = await dispatch(registerStaff({ name: fullName, email, password })).unwrap();

            toast.success(`Welcome ${resultAction.name}! Registration successful.`, {
                duration: 2000,
            });
        } catch (err) {
            setErr(err);
        }
        setErr("")
    }

    return (
        <div className="h-screen bg-white to-purple-50 flex overflow-hidden">
            <div className="hidden lg:flex lg:w-1/2 bg-blue-600 p-8 flex-col justify-between relative overflow-hidden">
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse"></div>
                    <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2 animate-pulse" style={{ animationDelay: '1s' }}></div>
                    <div className="absolute top-1/2 left-1/2 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2 animate-pulse" style={{ animationDelay: '0.5s' }}></div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center gap-3 mb-12">
                        <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center shadow-lg">
                            <Briefcase className="text-blue-600" size={28} />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">M-BOP</h1>
                            <p className="text-blue-100 text-sm">Business Operations Platform</p>
                        </div>
                    </div>

                    <div className="mb-6 relative">
                        <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                            <div className="space-y-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-white/30 rounded-full"></div>
                                    <div className="space-y-2 flex-1">
                                        <div className="h-3 bg-white/30 rounded w-1/3"></div>
                                        <div className="h-2 bg-white/20 rounded w-1/4"></div>
                                    </div>
                                </div>

                                <div className="grid grid-cols-3 gap-3 mt-4">
                                    <div className="bg-white/20 rounded-lg p-3 space-y-2">
                                        <div className="w-8 h-8 bg-white/30 rounded"></div>
                                        <div className="h-2 bg-white/30 rounded"></div>
                                        <div className="h-3 bg-white/40 rounded w-2/3"></div>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-3 space-y-2">
                                        <div className="w-8 h-8 bg-white/30 rounded"></div>
                                        <div className="h-2 bg-white/30 rounded"></div>
                                        <div className="h-3 bg-white/40 rounded w-2/3"></div>
                                    </div>
                                    <div className="bg-white/20 rounded-lg p-3 space-y-2">
                                        <div className="w-8 h-8 bg-white/30 rounded"></div>
                                        <div className="h-2 bg-white/30 rounded"></div>
                                        <div className="h-3 bg-white/40 rounded w-2/3"></div>
                                    </div>
                                </div>

                                <div className="bg-white/20 rounded-lg p-4 mt-4">
                                    <div className="h-2 bg-white/30 rounded w-1/4 mb-3"></div>
                                    <div className="flex items-end gap-2 h-24">
                                        <div className="flex-1 bg-white/30 rounded-t" style={{ height: '60%' }}></div>
                                        <div className="flex-1 bg-white/30 rounded-t" style={{ height: '80%' }}></div>
                                        <div className="flex-1 bg-white/40 rounded-t" style={{ height: '100%' }}></div>
                                        <div className="flex-1 bg-white/30 rounded-t" style={{ height: '70%' }}></div>
                                        <div className="flex-1 bg-white/30 rounded-t" style={{ height: '90%' }}></div>
                                        <div className="flex-1 bg-white/35 rounded-t" style={{ height: '75%' }}></div>
                                    </div>
                                </div>
                            </div>

                            <div className="absolute -top-4 -right-4 bg-green-400 text-white px-3 py-2 rounded-full text-xs font-bold shadow-lg animate-bounce">
                                ✓ Verified
                            </div>
                            <div className="absolute -bottom-4 -left-4 bg-yellow-400 text-gray-900 px-3 py-2 rounded-full text-xs font-bold shadow-lg">
                                🔥 Popular
                            </div>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
                            Streamline Your Business Operations
                        </h2>
                        <p className="text-blue-100 text-base">
                            Join thousands of teams managing their projects, clients, and workflows efficiently with M-BOP.
                        </p>
                    </div>
                </div>

                <div className="relative z-10">
                    <div className="flex items-center justify-between">
                        <p className="text-blue-100 text-sm">
                            © 2024 M-BOP. All rights reserved.
                        </p>
                        <div className="flex gap-3">
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition cursor-pointer">
                                <span className="text-white text-xs font-bold">f</span>
                            </div>
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition cursor-pointer">
                                <span className="text-white text-xs font-bold">in</span>
                            </div>
                            <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition cursor-pointer">
                                <span className="text-white text-xs font-bold">𝕏</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Side - Register Form */}
            <div className="w-full lg:w-1/2 flex items-center justify-center p-6 overflow-y-auto">
                <div className="w-full max-w-md my-auto">
                    <div className="lg:hidden flex items-center gap-3 mb-6">
                        <div className="w-12 h-12 bg-purple-700 rounded-xl flex items-center justify-center">
                            <Briefcase className="text-white" size={28} />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold text-gray-900">M-BOP</h1>
                            <p className="text-gray-500 text-sm">Business Operations Platform</p>
                        </div>
                    </div>

                    <div className="mb-6">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Create Account</h2>
                        <p className="text-gray-600 text-sm">Get started with M-BOP today</p>
                    </div>

                    <form className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full Name <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="text"
                                    name="name"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                    placeholder="Enter your full name"
                                    className='w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition '
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email Address <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type="email"
                                    name="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="your.email@company.com"
                                    className='w-full pl-10 pr-4 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition '
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password <span className="text-red-500">*</span>
                            </label>
                            <div className="relative">
                                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder="Create a strong password"
                                    className='w-full pl-10 pr-10 py-2.5 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition'
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                        {err && (
                            <p className='text-red-500 text-sm font-medium'>
                                {err}
                            </p>
                        )}

                        {error && (
                            <p className='text-red-500 text-sm font-medium'>
                                {error}
                            </p>
                        )}
                        {/* Submit Button */}
                        <button
                            type='submit'
                            onClick={handleSignup}
                            className="w-full py-2.5 px-4 bg-purple-600 text-white font-semibold rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-4 focus:ring-blue-300 transition-all duration-200 shadow-lg shadow-blue-500/30 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? (
                                <>
                                    <Loader2 size={18} className="animate-spin" />
                                </>
                            ) : (
                                <>
                                    Create Account
                                    <ArrowRight size={20} />
                                </>
                            )}
                        </button>
                    </form>

                    <p className="text-center text-xs text-gray-600 mt-5">
                        Already have an account?{' '}
                        <Link className="text-blue-600 hover:text-blue-700 font-semibold" to='/login'>Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    );
}

export default Register;