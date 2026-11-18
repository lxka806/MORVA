import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
    User,
    Mail,
    LogOut,
    Sparkles,
    ChevronRight,
    BookOpen,
    Brain,
    Languages,
    Trophy
} from "lucide-react";

function Profile() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <main className="min-h-screen bg-[#111111] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-11 h-11 border-2 border-[#33302B] border-t-[#D6A85F] rounded-full animate-spin" />

                    <p className="text-sm text-[#A7A29A] font-medium">
                        Loading profile...
                    </p>
                </div>
            </main>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const username = user?.username || user?.userName || "user";
    const firstLetter = user.name?.charAt(0).toUpperCase() || "U";

    return (
        <main className="min-h-screen bg-[#111111] text-[#F5F2EB] font-sans">

            {/* HEADER */}
            <section className="bg-[#1A1A1A] border-b border-[#33302B]">
                <div className="max-w-[1200px] mx-auto px-6 py-12">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">

                        <div className="flex items-center gap-5">

                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-2xl bg-[#D6A85F] flex items-center justify-center text-3xl font-bold text-[#111111] shadow-[0_8px_24px_rgba(214,168,95,0.15)]">
                                {firstLetter}
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#D6A85F]/10 border border-[#D6A85F]/30 text-xs text-[#D6A85F] mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    MORVA member
                                </div>

                                <h1 className="font-serif text-3xl font-semibold tracking-tight text-[#F5F2EB]">
                                    {user.name}
                                </h1>
                                <p className="text-sm text-[#D6A85F]/80 mt-1">
                                    @{username}
                                </p>

                                <p className="text-sm text-[#A7A29A] mt-1">
                                    {user.email}
                                </p>
                            </div>

                        </div>

                        <button
                            onClick={logout}
                            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#202020] hover:bg-[#262626] border border-[#33302B] hover:border-[#D6A85F]/40 text-sm font-medium text-[#F5F2EB] transition focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                        >
                            <LogOut className="w-4 h-4" />
                            Log out
                        </button>

                    </div>

                </div>
            </section>


            {/* CONTENT */}
            <div className="max-w-[1200px] mx-auto px-6 py-8">

                <div className="grid grid-cols-1 lg:grid-cols-[1.5fr_1fr] gap-6">

                    {/* LEFT SIDE */}
                    <div className="space-y-6">

                        {/* ACCOUNT INFORMATION */}
                        <section className="bg-[#202020] border border-[#33302B] rounded-2xl p-6">

                            <div className="flex items-center justify-between mb-6">

                                <div>
                                    <p className="text-xs uppercase tracking-widest text-[#D6A85F] font-semibold mb-1">
                                        Account
                                    </p>

                                    <h2 className="text-xl font-semibold text-[#F5F2EB]">
                                        Account information
                                    </h2>
                                </div>

                                <div className="w-10 h-10 rounded-xl bg-[#D6A85F]/10 border border-[#D6A85F]/20 flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#D6A85F]" />
                                </div>

                            </div>


                            {/* NAME */}
                            <div className="flex items-center gap-4 py-4 border-b border-[#33302B]">

                                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#33302B] flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#A7A29A]" />
                                </div>

                                <div>
                                    <p className="text-xs text-[#A7A29A] uppercase tracking-widest">
                                        Full name
                                    </p>

                                    <p className="font-medium mt-1 text-[#F5F2EB]">
                                        {user.name}
                                    </p>
                                </div>

                            </div>


                            {/* USERNAME */}
                            <div className="flex items-center gap-4 py-4 border-b border-[#33302B]">

                                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#33302B] flex items-center justify-center">
                                    <User className="w-5 h-5 text-[#A7A29A]" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-[#A7A29A] uppercase tracking-widest">
                                        Username
                                    </p>

                                    <p className="font-medium mt-1 truncate text-[#F5F2EB]">
                                        @{username}
                                    </p>
                                </div>

                            </div>

                            {/* EMAIL */}
                            <div className="flex items-center gap-4 py-4">

                                <div className="w-10 h-10 rounded-xl bg-[#1A1A1A] border border-[#33302B] flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-[#A7A29A]" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-[#A7A29A] uppercase tracking-widest">
                                        Email address
                                    </p>

                                    <p className="font-medium mt-1 truncate text-[#F5F2EB]">
                                        {user.email}
                                    </p>
                                </div>

                            </div>

                        </section>


                        {/* QUICK ACTIONS */}
                        <section className="bg-[#202020] border border-[#33302B] rounded-2xl p-6">

                            <div className="mb-5">

                                <p className="text-xs uppercase tracking-widest text-[#A7A29A] font-semibold mb-1">
                                    MORVA
                                </p>

                                <h2 className="text-xl font-semibold text-[#F5F2EB]">
                                    Quick actions
                                </h2>

                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                {/* LEARNING */}
                                <button
                                    onClick={() => navigate("/learning")}
                                    className="group flex items-center gap-4 p-4 rounded-xl border border-[#33302B] hover:border-[#D6A85F]/50 hover:bg-[#D6A85F]/5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6A85F]/40"
                                >

                                    <div className="w-11 h-11 rounded-lg bg-[#1A1A1A] border border-[#33302B] group-hover:border-[#D6A85F]/40 group-hover:bg-[#D6A85F]/10 flex items-center justify-center transition">
                                        <BookOpen className="w-5 h-5 text-[#A7A29A] group-hover:text-[#D6A85F] transition" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-[#F5F2EB]">
                                            Learning
                                        </p>

                                        <p className="text-xs text-[#A7A29A] mt-1">
                                            Continue learning
                                        </p>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-[#33302B] group-hover:text-[#D6A85F] transition" />

                                </button>


                                {/* QUIZ */}
                                <button
                                    onClick={() => navigate("/quiz")}
                                    className="group flex items-center gap-4 p-4 rounded-xl border border-[#33302B] hover:border-[#D6A85F]/50 hover:bg-[#D6A85F]/5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6A85F]/40"
                                >

                                    <div className="w-11 h-11 rounded-lg bg-[#1A1A1A] border border-[#33302B] group-hover:border-[#D6A85F]/40 group-hover:bg-[#D6A85F]/10 flex items-center justify-center transition">
                                        <Brain className="w-5 h-5 text-[#A7A29A] group-hover:text-[#D6A85F] transition" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-[#F5F2EB]">
                                            Quiz
                                        </p>

                                        <p className="text-xs text-[#A7A29A] mt-1">
                                            Test your knowledge
                                        </p>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-[#33302B] group-hover:text-[#D6A85F] transition" />

                                </button>


                                {/* LEADERBOARD */}
                                <button
                                    onClick={() => navigate("/leaderboard")}
                                    className="group flex items-center gap-4 p-4 rounded-xl border border-[#33302B] hover:border-[#D6A85F]/50 hover:bg-[#D6A85F]/5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6A85F]/40"
                                >

                                    <div className="w-11 h-11 rounded-lg bg-[#1A1A1A] border border-[#33302B] group-hover:border-[#D6A85F]/40 group-hover:bg-[#D6A85F]/10 flex items-center justify-center transition">
                                        <Trophy className="w-5 h-5 text-[#A7A29A] group-hover:text-[#D6A85F] transition" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-[#F5F2EB]">
                                            Leaderboard
                                        </p>

                                        <p className="text-xs text-[#A7A29A] mt-1">
                                            See the leaderboard
                                        </p>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-[#33302B] group-hover:text-[#D6A85F] transition" />

                                </button>


                                {/* TRANSLATE */}
                                <button
                                    onClick={() => navigate("/translate")}
                                    className="group flex items-center gap-4 p-4 rounded-xl border border-[#33302B] hover:border-[#D6A85F]/50 hover:bg-[#D6A85F]/5 text-left transition focus:outline-none focus:ring-2 focus:ring-[#D6A85F]/40"
                                >

                                    <div className="w-11 h-11 rounded-lg bg-[#1A1A1A] border border-[#33302B] group-hover:border-[#D6A85F]/40 group-hover:bg-[#D6A85F]/10 flex items-center justify-center transition">
                                        <Languages className="w-5 h-5 text-[#A7A29A] group-hover:text-[#D6A85F] transition" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold text-sm text-[#F5F2EB]">
                                            Translate
                                        </p>

                                        <p className="text-xs text-[#A7A29A] mt-1">
                                            Translate text
                                        </p>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-[#33302B] group-hover:text-[#D6A85F] transition" />

                                </button>

                            </div>

                        </section>

                    </div>


                    {/* RIGHT SIDE */}
                    <div className="space-y-6">

                        {/* PROFILE CARD */}
                        <section className="bg-[#202020] border border-[#33302B] rounded-2xl p-6">

                            <div className="flex items-center justify-between mb-6">

                                <h2 className="font-semibold text-[#F5F2EB]">
                                    Profile
                                </h2>

                            </div>


                            <div className="text-center">

                                <div className="w-24 h-24 rounded-2xl bg-[#D6A85F] flex items-center justify-center text-4xl font-bold text-[#111111] mx-auto shadow-[0_8px_24px_rgba(214,168,95,0.2)]">
                                    {firstLetter}
                                </div>

                                <h3 className="font-serif text-xl font-semibold mt-4 text-[#F5F2EB]">
                                    {user.name}
                                </h3>

                                <p className="text-sm text-[#A7A29A] mt-1 break-all">
                                    {user.email}
                                </p>

                            </div>


                            <div className="mt-6 pt-5 border-t border-[#33302B] space-y-4">

                                <div className="flex items-center justify-center gap-2">

                                    <span className="w-2 h-2 rounded-full bg-[#7DAD8A] shadow-[0_0_8px_rgba(125,173,138,0.5)]" />

                                    <span className="text-sm font-medium text-[#7DAD8A]">
                                        Account active
                                    </span>

                                </div>


                            </div>

                        </section>


                        {/* LOGOUT */}
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-xl border border-[#D47777]/30 bg-[#D47777]/10 text-[#D47777] hover:bg-[#D47777]/15 hover:border-[#D47777]/50 transition font-medium text-sm focus:outline-none focus:ring-2 focus:ring-[#D47777]/40"
                        >
                            <LogOut className="w-4 h-4" />
                            Log out
                        </button>

                    </div>

                </div>

                <div className="h-8" />

            </div>
        </main>
    );
}

export default Profile;