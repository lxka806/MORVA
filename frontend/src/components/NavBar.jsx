import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";

import {
    Home,
    BookOpen,
    Trophy,
    ClipboardList,
    Book,
    LogIn,
    UserPlus,
    User,
    Globe
} from "lucide-react";



function NavBar() {
    const { user, loading } = useAuth();

    return (

        <header className="sticky top-0 z-50 bg-white border-b border-[#D9D4C7]">

            <nav className="max-w-[1400px] mx-auto px-6 py-4">

                <ul className="flex items-center justify-between">

                    {/* Logo */}
                    <div>
                        <Link to="/">
                            <h1 className="text-2xl font-bold tracking-[3px] text-[#111111]">
                                MORVA
                            </h1>
                        </Link>
                    </div>


                    {/* Main Navigation */}
                    <div className="flex items-center gap-2">

                        <Link
                            to="/"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#77736A] hover:bg-[#F5F1E8] hover:text-[#111111] transition"
                        >
                            <Home size={18} />
                            <span>Home</span>
                        </Link>


                        <Link
                            to="/learning"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#77736A] hover:bg-[#F5F1E8] hover:text-[#111111] transition"
                        >
                            <BookOpen size={18} />
                            <span>Learning</span>
                        </Link>


                        <Link
                            to="/liderBoard"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#77736A] hover:bg-[#F5F1E8] hover:text-[#111111] transition"
                        >
                            <Trophy size={18} />
                            <span>Leaderboard</span>
                        </Link>


                        <Link
                            to="/quiz"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#77736A] hover:bg-[#F5F1E8] hover:text-[#111111] transition"
                        >
                            <ClipboardList size={18} />
                            <span>Quiz</span>
                        </Link>

                        <Link
                            to="/translate"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#77736A] hover:bg-[#F5F1E8] hover:text-[#111111] transition"
                        >
                            <Globe size={18} />
                            <span>Translate</span>
                        </Link>

                        <Link
                            to="/words"
                            className="flex items-center gap-2 px-3 py-2 rounded-lg text-[#77736A] hover:bg-[#F5F1E8] hover:text-[#111111] transition"
                        >
                            <Book size={18} />
                            <span>Dictionary</span>
                        </Link>

                    </div>


                    {/* Authentication */}
                    <div className="flex items-center gap-2">
                        {!loading && user ? (
                            <Link
                                to="/profile"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#F5F1E8] text-[#111111] hover:bg-[#C8A96A] transition"
                            >
                                <User size={19} />
                                <span>Profile</span>
                            </Link>
                        ) : !loading ? (
                            <>
                                <Link to="/login" className="flex items-center gap-2 px-4 py-2 rounded-lg text-[#111111] hover:bg-[#F5F1E8] transition">
                                    <LogIn size={18} />
                                    <span>Login</span>
                                </Link>
                                <Link to="/register" className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#111111] text-white hover:bg-[#C8A96A] hover:text-[#111111] transition">
                                    <UserPlus size={18} />
                                    <span>Register</span>
                                </Link>
                            </>
                        ) : null}

                    </div>

                </ul>

            </nav>

        </header>
    );
}

export default NavBar;