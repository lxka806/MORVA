import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import {
    Home,
    BookOpen,
    Trophy,
    Book,
    LogIn,
    UserPlus,
    User,
    Globe,
    Menu,
    X
} from "lucide-react";

function NavBar() {
    const { user, loading } = useAuth();
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

    const toggleMobileMenu = () => {
        setIsMobileMenuOpen(!isMobileMenuOpen);
    };

    const closeMobileMenu = () => {
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { to: "/", icon: <Home size={18} />, label: "Home" },
        { to: "/learning", icon: <BookOpen size={18} />, label: "Learning" },
        { to: "/liderBoard", icon: <Trophy size={18} />, label: "Leaderboard" },
        { to: "/translate", icon: <Globe size={18} />, label: "Translate" },
        { to: "/words", icon: <Book size={18} />, label: "Dictionary" },
    ];

    return (
        <header className="sticky top-0 z-50 bg-[#111111]/95 backdrop-blur-md border-b border-[#33302B]">
            <nav className="max-w-[1400px] mx-auto px-4 sm:px-6 py-3 sm:py-4">
                <div className="flex items-center justify-between">
                    {/* Logo - Left */}
                    <div className="flex-shrink-0">
                        <Link to="/" onClick={closeMobileMenu} className="group inline-block">
                            <h1 className="font-serif text-xl sm:text-2xl font-semibold tracking-[3px] text-[#F5F2EB] group-hover:text-[#D6A85F] transition-colors">
                                MORVA
                            </h1>
                        </Link>
                    </div>

                    {/* Desktop Navigation - Center */}
                    <div className="hidden md:flex items-center gap-1 lg:gap-2">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                className="flex items-center gap-2 px-2 lg:px-3 py-2 rounded-lg text-[#A7A29A] hover:bg-[#202020] hover:text-[#F5F2EB] transition text-sm lg:text-base whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-[#D6A85F]/40"
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        ))}
                    </div>

                    {/* Desktop Auth - Right */}
                    <div className="hidden md:flex items-center gap-2">
                        {!loading && user ? (
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg bg-[#202020] border border-[#33302B] text-[#F5F2EB] hover:border-[#D6A85F]/60 hover:text-[#D6A85F] transition text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#D6A85F]/40"
                            >
                                <User size={18} />
                                <span>Profile</span>
                            </Link>
                        ) : !loading ? (
                            <>
                                <Link
                                    to="/login"
                                    className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg text-[#F5F2EB] hover:bg-[#202020] hover:text-[#D6A85F] transition text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#D6A85F]/40"
                                >
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </Link>
                                <Link
                                    to="/register"
                                    className="flex items-center gap-2 px-3 lg:px-4 py-2 rounded-lg bg-[#D6A85F] text-[#111111] font-semibold hover:bg-[#B88B47] transition text-sm lg:text-base focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#111111]"
                                >
                                    <UserPlus size={18} />
                                    <span>Register</span>
                                </Link>
                            </>
                        ) : null}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="md:hidden p-2 rounded-lg text-[#F5F2EB] hover:bg-[#202020] hover:text-[#D6A85F] transition focus:outline-none focus:ring-2 focus:ring-[#D6A85F]/40"
                        aria-label="Toggle menu"
                    >
                        {isMobileMenuOpen ? (
                            <X size={24} />
                        ) : (
                            <Menu size={24} />
                        )}
                    </button>
                </div>

                {/* Mobile Navigation - Slide Down */}
                <div
                    className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
                        isMobileMenuOpen ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
                    }`}
                >
                    <div className="pt-4 pb-3 border-t border-[#33302B] mt-3 space-y-1">
                        {navLinks.map((link) => (
                            <Link
                                key={link.to}
                                to={link.to}
                                onClick={closeMobileMenu}
                                className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#A7A29A] hover:bg-[#202020] hover:text-[#F5F2EB] transition text-sm"
                            >
                                {link.icon}
                                <span>{link.label}</span>
                            </Link>
                        ))}

                        {/* Mobile Auth Links */}
                        <div className="pt-3 mt-2 border-t border-[#33302B]">
                            {!loading && user ? (
                                <Link
                                    to="/profile"
                                    onClick={closeMobileMenu}
                                    className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#202020] border border-[#33302B] text-[#F5F2EB] hover:border-[#D6A85F]/60 hover:text-[#D6A85F] transition text-sm"
                                >
                                    <User size={18} />
                                    <span>Profile</span>
                                </Link>
                            ) : !loading ? (
                                <div className="space-y-2">
                                    <Link
                                        to="/login"
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 px-3 py-3 rounded-lg text-[#F5F2EB] hover:bg-[#202020] hover:text-[#D6A85F] transition text-sm"
                                    >
                                        <LogIn size={18} />
                                        <span>Login</span>
                                    </Link>
                                    <Link
                                        to="/register"
                                        onClick={closeMobileMenu}
                                        className="flex items-center gap-3 px-3 py-3 rounded-lg bg-[#D6A85F] text-[#111111] font-semibold hover:bg-[#B88B47] transition text-sm"
                                    >
                                        <UserPlus size={18} />
                                        <span>Register</span>
                                    </Link>
                                </div>
                            ) : null}
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    );
}

export default NavBar;