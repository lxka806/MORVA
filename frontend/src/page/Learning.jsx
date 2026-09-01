import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Loader2, Sparkles, Trophy } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function Learning() {
    const [lessons, setLessons] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [userXP, setUserXP] = useState(0); // Add this state

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            setError("");

            try {
                const [lessonsResponse, progressResponse] = await Promise.all([
                    fetch(`${API_URL}/api/learning/lessons`, { credentials: "include" }),
                    fetch(`${API_URL}/api/learning/progress`, { credentials: "include" }),
                ]);

                const lessonsData = await lessonsResponse.json();
                const progressData = await progressResponse.json();

                if (!lessonsResponse.ok) {
                    throw new Error(lessonsData?.message || "Unable to load lessons");
                }

                if (!progressResponse.ok) {
                    console.warn("Progress unavailable:", progressData?.message || "Not available");
                }

                setLessons(Array.isArray(lessonsData?.lessons) ? lessonsData.lessons : []);
                
                // Fix: Access XP from the root of progressData
                setProgress(progressData || null);
                setUserXP(progressData?.xp || 0); // XP is at root level

            } catch (err) {
                console.error(err);
                setError("Unable to load lessons.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const completedCount = useMemo(() => {
        if (!progress?.progress) return 0;
        return progress.progress.filter((item) => item.completed).length;
    }, [progress]);

    const totalCount = lessons.length || 0;
    const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

    if (loading) {
        return (
            <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#111111] mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading lessons...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-md text-center shadow-sm">
                    <p className="text-lg font-semibold text-[#111111]">Unable to load lessons.</p>
                    <p className="mt-2 text-sm text-gray-500">Please try again in a moment.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#111111] text-white px-4 py-2.5 text-sm font-medium"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#fafafa] text-[#111111] px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <section className="mb-8 rounded-3xl bg-white border border-gray-200 shadow-sm p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-semibold">MORVA Alphabet</p>
                            <h1 className="mt-3 text-3xl md:text-5xl font-bold tracking-tight">Learn the MORVA writing system.</h1>
                        </div>
                    </div>

                    <div className="mt-8 rounded-2xl border border-gray-200 bg-gray-50 p-4">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-gray-600">Progress</p>
                            <p className="text-sm text-gray-500">{completedCount} / {totalCount} lessons</p>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-gray-200 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#111111] transition-all"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        <div className="mt-3 text-sm text-gray-500">{percent}% complete</div>
                    </div>
                </section>

                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-bold text-[#111111]">Lessons</h2>
                        <div className="inline-flex items-center gap-2 text-sm text-gray-500">
                            <BookOpen className="w-4 h-4" />
                            {lessons.length} total
                        </div>
                    </div>

                    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                        {lessons.map((lesson) => {
                            const lessonProgress = progress?.progress?.find((item) => item.lesson === lesson.title);
                            const completed = Boolean(lessonProgress?.completed);

                            return (
                                <Link
                                    key={lesson._id}
                                    to={`/learning/lesson/${lesson._id}`}
                                    className="group block rounded-3xl border border-gray-200 bg-white p-5 shadow-sm hover:shadow-md transition"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-2xl bg-[#f5f1e8] flex items-center justify-center text-[#111111]">
                                                {completed ? <CheckCircle2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Lesson {lesson.order}</p>
                                                <h3 className=" mt-1 text-lg font-semibold">{lesson.title}</h3>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-gray-500 line-clamp-3 group-hover:line-clamp-none">
                                        {lesson.description || "Alphabet lesson"}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <span className={`text-xs font-medium rounded-full px-2.5 py-1 ${
                                            completed
                                                ? "bg-green-50 text-green-700 border border-green-200"
                                                : "bg-blue-50 text-blue-700 border border-blue-200"
                                        }`}>
                                            {completed ? "Completed" : "Start"}
                                        </span>
                                    </div>
                                </Link>
                            );
                        })}
                    </div>
                </section>
            </div>
        </main>
    );
}

export default Learning;