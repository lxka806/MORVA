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

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

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
        <main className="font-sans antialiased min-h-screen bg-[#111111] flex items-center justify-center p-6">
            <div className="w-full max-w-md">
                {/* Brand */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-block">
                        <h1 className="font-serif text-3xl font-semibold tracking-[0.15em] text-[#F5F2EB]">
                            MORVA
                        </h1>
                    </Link>
                    <p className="text-sm text-[#A7A29A] mt-2">
                        Create your account and start your learning journey.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#202020] rounded-2xl border border-[#33302B] p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#33302B] bg-[#1A1A1A] text-xs font-semibold tracking-widest text-[#A7A29A] uppercase">
                            <Sparkles className="w-3.5 h-3.5 text-[#D6A85F]" />
                            GET STARTED
                        </div>
                        <h2 className="font-serif text-2xl font-semibold tracking-tight mt-4 text-[#F5F2EB]">
                            Create account
                        </h2>
                        <p className="text-sm text-[#A7A29A] mt-1">
                            Join MORVA and start learning today.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Full Name */}
                        <div>
                            <label htmlFor="name" className="block text-sm font-medium text-[#F5F2EB] mb-1.5">
                                Full name
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7A29A]">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    id="name"
                                    type="text"
                                    placeholder="John Doe"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#33302B] bg-[#1A1A1A] text-[#F5F2EB] focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30 transition-all outline-none placeholder:text-[#A7A29A]/60 text-sm"
                                    required
                                    autoFocus
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div>
                            <label htmlFor="username" className="block text-sm font-medium text-[#F5F2EB] mb-1.5">
                                Username
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7A29A]">
                                    <User className="w-5 h-5" />
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="john_doe"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#33302B] bg-[#1A1A1A] text-[#F5F2EB] focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30 transition-all outline-none placeholder:text-[#A7A29A]/60 text-sm"
                                    required
                                    autoFocus
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-[#F5F2EB] mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7A29A]">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <input
                                    id="email"
                                    type="email"
                                    placeholder="you@example.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#33302B] bg-[#1A1A1A] text-[#F5F2EB] focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30 transition-all outline-none placeholder:text-[#A7A29A]/60 text-sm"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-[#F5F2EB] mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7A29A]">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Min. 6 characters"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#33302B] bg-[#1A1A1A] text-[#F5F2EB] focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30 transition-all outline-none placeholder:text-[#A7A29A]/60 text-sm"
                                    required
                                    minLength={6}
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A7A29A] hover:text-[#D6A85F] transition"
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
                                <div className={`w-1.5 h-1.5 rounded-full transition ${password.length >= 6 ? 'bg-[#7DAD8A]' : 'bg-[#33302B]'}`} />
                                <span className={`text-xs ${password.length >= 6 ? 'text-[#7DAD8A]' : 'text-[#A7A29A]'}`}>
                                    {password.length >= 6 ? '✓ Strong password' : 'Min. 6 characters'}
                                </span>
                                {password.length > 0 && password.length < 6 && (
                                    <span className="text-xs text-[#D47777]">• {6 - password.length} more characters needed</span>
                                )}
                            </div>
                        </div>

                        {/* Confirm Password */}
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-[#F5F2EB] mb-1.5">
                                Confirm password
                            </label>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7A29A]">
                                    <Shield className="w-5 h-5" />
                                </div>
                                <input
                                    id="confirmPassword"
                                    type={showConfirmPassword ? "text" : "password"}
                                    placeholder="Confirm your password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className={`w-full pl-11 pr-12 py-3 rounded-xl border bg-[#1A1A1A] text-[#F5F2EB] focus:ring-2 transition-all outline-none placeholder:text-[#A7A29A]/60 text-sm ${
                                        confirmPassword && password === confirmPassword
                                            ? 'border-[#7DAD8A] focus:border-[#7DAD8A] focus:ring-[#7DAD8A]/20'
                                            : confirmPassword && password !== confirmPassword
                                            ? 'border-[#D47777] focus:border-[#D47777] focus:ring-[#D47777]/20'
                                            : 'border-[#33302B] focus:border-[#D6A85F] focus:ring-[#D6A85F]/30'
                                    }`}
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A7A29A] hover:text-[#D6A85F] transition"
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
                                <p className={`text-xs mt-1.5 ${password === confirmPassword ? 'text-[#7DAD8A]' : 'text-[#D47777]'}`}>
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
                            <div className="bg-[#D47777]/10 border border-[#D47777]/30 rounded-xl px-4 py-3 text-sm text-[#D47777] flex items-start gap-2">
                                <span className="text-[#D47777]/70 mt-0.5">✕</span>
                                <span>{error}</span>
                            </div>
                        )}

                        {/* Success */}
                        {success && (
                            <div className="bg-[#7DAD8A]/10 border border-[#7DAD8A]/30 rounded-xl px-4 py-3 text-sm text-[#7DAD8A] flex items-start gap-2">
                                <CheckCircle className="w-4 h-4 text-[#7DAD8A] mt-0.5 flex-shrink-0" />
                                <span>{success}</span>
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-[#D6A85F] text-[#111111] rounded-xl font-semibold hover:bg-[#B88B47] transition-all focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#202020] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-[#111111]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
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
                        <p className="text-sm text-[#A7A29A]">
                            Already have an account?{" "}
                            <Link to="/login" className="text-[#D6A85F] hover:text-[#B88B47] font-medium transition">
                                Sign in
                            </Link>
                        </p>
                    </div>

                    {/* Password requirements note */}
                    <div className="mt-4 pt-4 border-t border-[#33302B]">
                        <p className="text-xs text-[#A7A29A] text-center">
                            <Shield className="w-3 h-3 inline mr-1" />
                            Your password must be at least 6 characters long.
                        </p>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-[#A7A29A] mt-6">
                    By creating an account, you agree to MORVA's{" "}
                    <Link to="/terms" className="text-[#A7A29A] hover:text-[#D6A85F] transition">Terms</Link>
                    {" "}and{" "}
                    <Link to="/privacy" className="text-[#A7A29A] hover:text-[#D6A85F] transition">Privacy Policy</Link>.
                </p>
            </div>
        </main>
    );
}

export default Register;