import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { BookOpen, CheckCircle2, Loader2, Sparkles } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function Learning() {
    const [lessons, setLessons] = useState([]);
    const [progress, setProgress] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const fetchData = async () => {
            try {
                const [lessonsResponse, progressResponse] = await Promise.all([
                    fetch(`${API_URL}/api/learning/lessons`, {
                        credentials: "include",
                        signal: controller.signal
                    }),
                    fetch(`${API_URL}/api/learning/progress`, {
                        credentials: "include",
                        signal: controller.signal
                    }),
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
                setProgress(progressData || null);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Unable to load lessons.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        fetchData();
        return () => controller.abort();
    }, []);

    const completedCount = useMemo(() => {
        if (!progress?.progress) return 0;
        return progress.progress.filter((item) => item.completed).length;
    }, [progress]);

    const totalCount = lessons.length || 0;
    const percent = totalCount ? Math.round((completedCount / totalCount) * 100) : 0;

    if (loading) {
        return (
            <main className="min-h-screen bg-[#111111] flex items-center justify-center px-6">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#D6A85F] mx-auto" />
                    <p className="mt-4 text-sm text-[#A7A29A] font-sans">Loading lessons...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-[#111111] flex items-center justify-center px-6">
                <div className="bg-[#202020] border border-[#33302B] rounded-2xl p-8 max-w-md text-center">
                    <p className="text-lg font-semibold text-[#F5F2EB]">Unable to load lessons.</p>
                    <p className="mt-2 text-sm text-[#A7A29A]">Please try again in a moment.</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#D6A85F] text-[#111111] px-4 py-2.5 text-sm font-semibold hover:bg-[#B88B47] transition focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#202020]"
                    >
                        Try Again
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#111111] text-[#F5F2EB] font-sans px-6 py-10">
            <div className="max-w-6xl mx-auto">
                <section className="mb-8 rounded-2xl bg-[#202020] border border-[#33302B] p-6 md:p-8">
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-5">
                        <div>
                            <p className="text-xs uppercase tracking-[0.2em] text-[#D6A85F] font-semibold">MORVA Alphabet</p>
                            <h1 className="font-serif mt-3 text-3xl md:text-5xl font-semibold tracking-tight text-[#F5F2EB]">
                                Learn the MORVA writing system.
                            </h1>
                        </div>
                    </div>

                    <div className="mt-8 rounded-xl border border-[#33302B] bg-[#1A1A1A] p-4">
                        <div className="flex items-center justify-between gap-3">
                            <p className="text-sm font-medium text-[#F5F2EB]">Progress</p>
                            <p className="text-sm text-[#A7A29A]">{completedCount} / {totalCount} lessons</p>
                        </div>
                        <div className="mt-3 h-2 w-full rounded-full bg-[#111111] border border-[#33302B] overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#D6A85F] transition-all"
                                style={{ width: `${percent}%` }}
                            />
                        </div>
                        <div className="mt-3 text-sm text-[#A7A29A]">{percent}% complete</div>
                    </div>
                </section>

                <section>
                    <div className="mb-5 flex items-center justify-between">
                        <h2 className="text-xl font-semibold text-[#F5F2EB]">Lessons</h2>
                        <div className="inline-flex items-center gap-2 text-sm text-[#A7A29A]">
                            <BookOpen className="w-4 h-4 text-[#D6A85F]" />
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
                                    className="group block rounded-2xl border border-[#33302B] bg-[#202020] p-5 hover:border-[#D6A85F]/50 transition-colors"
                                >
                                    <div className="flex items-center justify-between gap-3">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${
                                                completed
                                                    ? "bg-[#7DAD8A]/10 border border-[#7DAD8A]/30 text-[#7DAD8A]"
                                                    : "bg-[#D6A85F]/10 border border-[#D6A85F]/30 text-[#D6A85F]"
                                            }`}>
                                                {completed ? <CheckCircle2 className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
                                            </div>
                                            <div>
                                                <p className="text-xs uppercase tracking-[0.2em] text-[#A7A29A]">Lesson {lesson.order}</p>
                                                <h3 className="font-serif mt-1 text-lg font-semibold text-[#F5F2EB]">
                                                    {lesson.title}
                                                </h3>
                                            </div>
                                        </div>
                                    </div>

                                    <p className="mt-4 text-sm text-[#A7A29A] line-clamp-3 group-hover:line-clamp-none">
                                        {lesson.description || "Alphabet lesson"}
                                    </p>

                                    <div className="mt-5 flex items-center justify-between gap-3">
                                        <span className={`text-xs font-medium rounded-full px-2.5 py-1 border ${
                                            completed
                                                ? "bg-[#7DAD8A]/10 text-[#7DAD8A] border-[#7DAD8A]/30"
                                                : "bg-[#D6A85F]/10 text-[#D6A85F] border-[#D6A85F]/30"
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