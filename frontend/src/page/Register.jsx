import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { User, Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, CheckCircle, Shield } from "lucide-react";

const URL = import.meta.env.VITE_API_URL;

function Register() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [name, setName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        // Validate password match
        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        // Validate password length
        if (password.length < 6) {
            setError("Password must be at least 6 characters");
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch(`${URL}/api/auth/register`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    name,
                    username,
                    email,
                    password
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                setIsLoading(false);
                return;
            }

            setSuccess("Account Created");
            login(data.user);
            navigate("/profile");

        } catch (e) {
            console.log(e);
            setError("Something went wrong");
            setIsLoading(false);
        }
    };

    return (
        <main className="font-['Inter'] antialiased min-h-screen bg-[#fafafa] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <h1 className="text-3xl font-bold tracking-[0.15em] text-[#111111]">MORVA</h1>
                    </Link>
                    <p className="text-sm text-gray-400 mt-2">Create your account and start your learning journey.</p>
                </div>

                {/* Card */}
                <div className="bg-white rounded-3xl border border-gray-200 shadow-sm p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50/80 text-xs font-semibold tracking-widest text-gray-600 uppercase">
                            <Sparkles className="w-3.5 h-3.5 text-blue-500" />
                            GET STARTED
                        </div>
                        <h2 className="text-2xl font-bold tracking-tight mt-4">Create account</h2>
                        <p className="text-sm text-gray-500 mt-1">Join MORVA and start learning today.</p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Full name
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-400 text-sm"
                                    required
                                    autoFocus
                                    disabled={isLoading}
                                />
                            </div>
                        </div>
                        

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="john_doe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-400 text-sm"
                                    required
                                    autoFocus
                                    disabled={isLoading}
                                />
                            </div>
                        </div>


                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-400 text-sm"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-gray-200 bg-gray-50/50 focus:bg-white focus:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all outline-none placeholder:text-gray-400 text-sm"
                                    required
                                    minLength={6}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    disabled={isLoading}
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            <div className="flex items-center gap-2 mt-1.5">
                                <div className={`w-1.5 h-1.5 rounded-full ${password.length >= 6 ? 'bg-green-500' : 'bg-gray-300'}`} />
                                <span className={`text-xs ${password.length >= 6 ? 'text-green-600' : 'text-gray-400'}`}>
                                    {password.length >= 6 ? '✓ Strong password' : 'Min. 6 characters'}
                                </span>
                                {password.length > 0 && password.length < 6 && (
                                    <span className="text-xs text-red-500">• {6 - password.length} more characters needed</span>
                                )}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                                Confirm password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-gray-50/50 focus:bg-white focus:ring-4 transition-all outline-none placeholder:text-gray-400 text-sm ${
                                        confirmPassword && password === confirmPassword
                                            ? 'border-green-400 focus:border-green-400 focus:ring-green-500/10'
                                            : confirmPassword && password !== confirmPassword
                                            ? 'border-red-400 focus:border-red-400 focus:ring-red-500/10'
                                            : 'border-gray-200 focus:border-blue-400 focus:ring-blue-500/10'
                                    }`}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
                                    disabled={isLoading}
                                >
                                    {showConfirmPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                            {confirmPassword && (
                                <p className={`text-xs mt-1.5 ${password === confirmPassword ? 'text-green-600' : 'text-red-500'}`}>
                                    {password === confirmPassword ? (
                                        '✓ Passwords match'
                                    ) : (
                                        '✗ Passwords do not match'
                                    )}
                                </p>
                            )}
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-600 flex items-start gap-2">
                                <span className="text-red-400 mt-0.5">✕</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="bg-green-50 border border-green-200 rounded-xl px-4 py-3 text-sm text-green-600 flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-[#111111] text-white rounded-xl font-medium hover:bg-[#2a2a2a] transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-gray-500">
                            Already have an account?{" "}
                            <Link to="/login" className="text-blue-500 hover:text-blue-600 font-medium transition">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Password requirements note */}
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-xs text-gray-400 text-center">
                            <Shield className="w-3 h-3 inline mr-1" />
                            Your password must be at least 6 characters long.
                        </p>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-gray-400 mt-6">
                    By creating an account, you agree to MORVA's{" "}
                    <Link to="/terms" className="text-gray-400 hover:text-gray-600 transition">Terms</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-gray-400 hover:text-gray-600 transition">Privacy Policy</Link>.
                </p>
            </div>
        </main>
    );
}

export default Register;