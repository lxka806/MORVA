import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setIsLoading(true);
        
        try {
            const response = await fetch(`${API_URL}/api/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password })
            });
            const data = await response.json();
            if (!response.ok) {
                setError(data.message);
                setIsLoading(false);
                return;
            }
            login(data.user);
            navigate("/profile");
        } catch {
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
                        Welcome back. Sign in to continue learning.
                    </p>
                </div>

                {/* Card */}
                <div className="bg-[#202020] rounded-2xl border border-[#33302B] p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#33302B] bg-[#1A1A1A] text-xs font-semibold tracking-widest text-[#A7A29A] uppercase">
                            <Sparkles className="w-3.5 h-3.5 text-[#D6A85F]" />
                            SIGN IN
                        </div>
                        <h2 className="font-serif text-2xl font-semibold tracking-tight mt-4 text-[#F5F2EB]">
                            Welcome back
                        </h2>
                        <p className="text-sm text-[#A7A29A] mt-1">
                            Enter your credentials to access your account.
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleSubmit} className="space-y-5">
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
                                    onChange={(event) => setEmail(event.target.value)}
                                    className="w-full pl-11 pr-4 py-3 rounded-xl border border-[#33302B] bg-[#1A1A1A] text-[#F5F2EB] focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30 transition-all outline-none placeholder:text-[#A7A29A]/60 text-sm"
                                    required
                                    autoFocus
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <div className="flex items-center justify-between mb-1.5">
                                <label htmlFor="password" className="block text-sm font-medium text-[#F5F2EB]">
                                    Password
                                </label>
                            </div>
                            <div className="relative">
                                <div className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A7A29A]">
                                    <Lock className="w-5 h-5" />
                                </div>
                                <input
                                    id="password"
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    value={password}
                                    onChange={(event) => setPassword(event.target.value)}
                                    className="w-full pl-11 pr-12 py-3 rounded-xl border border-[#33302B] bg-[#1A1A1A] text-[#F5F2EB] focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30 transition-all outline-none placeholder:text-[#A7A29A]/60 text-sm"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#A7A29A] hover:text-[#D6A85F] transition"
                                >
                                    {showPassword ? (
                                        <EyeOff className="w-5 h-5" />
                                    ) : (
                                        <Eye className="w-5 h-5" />
                                    )}
                                </button>
                            </div>
                        </div>

                        {/* Error */}
                        {error && (
                            <div className="bg-[#D47777]/10 border border-[#D47777]/30 rounded-xl px-4 py-3 text-sm text-[#D47777]">
                                {error}
                            </div>
                        )}

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3.5 bg-[#D6A85F] text-[#111111] rounded-xl font-semibold hover:bg-[#B88B47] transition-all focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#202020] flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isLoading ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-[#111111]" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight className="w-4 h-4" />
                                </>
                            )}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-[#A7A29A]">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-[#D6A85F] hover:text-[#B88B47] font-medium transition">
                                Create one
                            </Link>
                        </p>
                    </div>
                </div>

                {/* Footer note */}
                <p className="text-center text-xs text-[#A7A29A] mt-6">
                    By continuing, you agree to MORVA's Terms and Privacy Policy.
                </p>
            </div>
        </main>
    );
}

export default Login;