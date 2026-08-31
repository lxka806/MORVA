import { Navigate, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import {
    User,
    Mail,
    LogOut,
    Sparkles,
    ChevronRight,
    Settings,
    Pencil,
    BookOpen,
    Brain,
    Trophy,
    Languages,
} from "lucide-react";

function Profile() {
    const { user, loading, logout } = useAuth();
    const navigate = useNavigate();

    if (loading) {
        return (
            <main className="min-h-screen bg-[#fafafa] flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="w-11 h-11 border-[3px] border-gray-200 border-t-blue-500 rounded-full animate-spin" />

                    <p className="text-sm text-gray-400 font-medium">
                        Loading profile...
                    </p>
                </div>
            </main>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    const firstLetter = user.name?.charAt(0).toUpperCase() || "U";

    return (
        <main className="min-h-screen bg-[#fafafa] text-[#111111]">

            {/* HEADER */}
            <section className="bg-[#111111] text-white">
                <div className="max-w-[1200px] mx-auto px-6 py-12">

                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-8">

                        <div className="flex items-center gap-5">

                            {/* Avatar */}
                            <div className="w-20 h-20 rounded-3xl bg-blue-500 flex items-center justify-center text-3xl font-bold shadow-xl shadow-blue-500/20">
                                {firstLetter}
                            </div>

                            <div>
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/10 text-xs text-blue-300 mb-2">
                                    <Sparkles className="w-3.5 h-3.5" />
                                    MORVA member
                                </div>

                                <h1 className="text-3xl font-bold tracking-tight">
                                    {user.name}
                                </h1>

                                <p className="text-sm text-gray-400 mt-1">
                                    {user.email}
                                </p>
                            </div>

                        </div>

                        <button
                            onClick={logout}
                            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-sm font-medium transition"
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
                        <section className="bg-white border border-gray-200 rounded-3xl p-6">

                            <div className="flex items-center justify-between mb-6">

                                <div>
                                    <p className="text-xs uppercase tracking-wider text-blue-500 font-semibold mb-1">
                                        Account
                                    </p>

                                    <h2 className="text-xl font-bold">
                                        Account information
                                    </h2>
                                </div>

                                <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                                    <User className="w-5 h-5 text-blue-500" />
                                </div>

                            </div>


                            {/* NAME */}
                            <div className="flex items-center gap-4 py-4 border-b border-gray-100">

                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                    <User className="w-5 h-5 text-gray-400" />
                                </div>

                                <div>
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                                        Full name
                                    </p>

                                    <p className="font-medium mt-1">
                                        {user.name}
                                    </p>
                                </div>

                            </div>


                            {/* EMAIL */}
                            <div className="flex items-center gap-4 py-4">

                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center">
                                    <Mail className="w-5 h-5 text-gray-400" />
                                </div>

                                <div className="min-w-0">
                                    <p className="text-xs text-gray-400 uppercase tracking-wider">
                                        Email address
                                    </p>

                                    <p className="font-medium mt-1 truncate">
                                        {user.email}
                                    </p>
                                </div>

                            </div>

                        </section>


                        {/* QUICK ACTIONS */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6">

                            <div className="mb-5">

                                <p className="text-xs uppercase tracking-wider text-gray-400 font-semibold mb-1">
                                    MORVA
                                </p>

                                <h2 className="text-xl font-bold">
                                    Quick actions
                                </h2>

                            </div>


                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                                {/* LEARNING */}
                                <button
                                    onClick={() => navigate("/learning")}
                                    className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 text-left transition"
                                >

                                    <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition">
                                        <BookOpen className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">
                                            Learning
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            Continue learning
                                        </p>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />

                                </button>


                                {/* QUIZ */}
                                <button
                                    onClick={() => navigate("/quiz")}
                                    className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 text-left transition"
                                >

                                    <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition">
                                        <Brain className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">
                                            Quiz
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            Test your knowledge
                                        </p>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />

                                </button>


                                {/* LEADERBOARD */}
                                <button
                                    onClick={() => navigate("/leaderboard")}
                                    className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 text-left transition"
                                >

                                    <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition">
                                        <Trophy className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">
                                            Leaderboard
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            See the leaderboard
                                        </p>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />

                                </button>


                                {/* TRANSLATE */}
                                <button
                                    onClick={() => navigate("/translate")}
                                    className="group flex items-center gap-4 p-4 rounded-2xl border border-gray-100 hover:border-blue-200 hover:bg-blue-50/40 text-left transition"
                                >

                                    <div className="w-11 h-11 rounded-xl bg-gray-50 group-hover:bg-blue-100 flex items-center justify-center transition">
                                        <Languages className="w-5 h-5 text-gray-500 group-hover:text-blue-500" />
                                    </div>

                                    <div className="flex-1">
                                        <p className="font-semibold text-sm">
                                            Translate
                                        </p>

                                        <p className="text-xs text-gray-400 mt-1">
                                            Translate text
                                        </p>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500" />

                                </button>

                            </div>

                        </section>

                    </div>


                    {/* RIGHT SIDE */}
                    <div className="space-y-6">

                        {/* PROFILE CARD */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6">

                            <div className="flex items-center justify-between mb-6">

                                <h2 className="font-bold">
                                    Profile
                                </h2>

                                <button
                                    className="p-2 rounded-lg hover:bg-gray-100 transition"
                                    title="Edit profile"
                                >
                                    <Pencil className="w-4 h-4 text-gray-400" />
                                </button>

                            </div>


                            <div className="text-center">

                                <div className="w-24 h-24 rounded-3xl bg-blue-500 flex items-center justify-center text-4xl font-bold text-white mx-auto shadow-xl shadow-blue-500/20">
                                    {firstLetter}
                                </div>

                                <h3 className="text-xl font-bold mt-4">
                                    {user.name}
                                </h3>

                                <p className="text-sm text-gray-400 mt-1 break-all">
                                    {user.email}
                                </p>

                            </div>


                            <div className="mt-6 pt-5 border-t border-gray-100">

                                <div className="flex items-center justify-center gap-2">

                                    <span className="w-2 h-2 rounded-full bg-green-500" />

                                    <span className="text-sm font-medium text-green-600">
                                        Account active
                                    </span>

                                </div>

                            </div>

                        </section>


                        {/* ACCOUNT SETTINGS */}
                        <section className="bg-white border border-gray-200 rounded-3xl p-6">

                            <div className="flex items-center gap-2 mb-4">

                                <Settings className="w-4 h-4 text-gray-400" />

                                <h2 className="font-bold text-sm">
                                    Account settings
                                </h2>

                            </div>


                            <div className="space-y-1">

                                <button className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition text-sm text-left">

                                    <div className="flex items-center gap-3">
                                        <Pencil className="w-4 h-4 text-gray-400" />
                                        <span>Edit profile</span>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-gray-300" />

                                </button>


                                <button className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-gray-50 transition text-sm text-left">

                                    <div className="flex items-center gap-3">
                                        <Settings className="w-4 h-4 text-gray-400" />
                                        <span>Settings</span>
                                    </div>

                                    <ChevronRight className="w-4 h-4 text-gray-300" />

                                </button>

                            </div>

                        </section>


                        {/* LOGOUT */}
                        <button
                            onClick={logout}
                            className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl border border-red-100 bg-red-50 text-red-600 hover:bg-red-100 transition font-medium text-sm"
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
