import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, ArrowRight, Loader2 } from "lucide-react";

const API_URL = import.meta.env.VITE_API_URL;

function Lesson() {
    const { id } = useParams();
    const navigate = useNavigate();

    const [lesson, setLesson] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [currentStep, setCurrentStep] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState("");
    const [answerState, setAnswerState] = useState(null);
    const [isCompleting, setIsCompleting] = useState(false);
    const [completeState, setCompleteState] = useState(null);
    const [completionError, setCompletionError] = useState("");

    useEffect(() => {
        const controller = new AbortController();
        const fetchLesson = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`${API_URL}/api/learning/lessons/${id}`, {
                    credentials: "include",
                    signal: controller.signal
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data?.message || "Unable to load lesson");
                }

                setLesson(data.lesson);
                setCurrentStep(0);
                setSelectedAnswer("");
                setAnswerState(null);
            } catch (err) {
                if (err.name !== "AbortError") {
                    console.error(err);
                    setError("Unable to load this lesson.");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        if (id) {
            fetchLesson();
        }
        return () => controller.abort();
    }, [id]);

    const totalSteps = useMemo(() => {
        if (!lesson) return 0;
        return Math.max(1, (lesson.letters?.length || 0) + (lesson.exercises?.length || 0));
    }, [lesson]);

    const currentItem = useMemo(() => {
        if (!lesson) return null;

        const items = [];
        (lesson.letters || []).forEach((letter) => items.push({ type: "letter", payload: letter }));
        (lesson.exercises || []).forEach((exercise) => items.push({ type: "exercise", payload: exercise }));

        return items[currentStep] || null;
    }, [lesson, currentStep]);

    const progressPercent = Math.min(100, Math.round(((currentStep + 1) / totalSteps) * 100));
    const isExerciseStep = currentItem?.type === "exercise";

    const handleAnswerSubmit = () => {
        if (!currentItem || currentItem.type !== "exercise") return;

        const trimmedSelected = String(selectedAnswer ?? "").trim();
        const trimmedCorrect = String(currentItem.payload.correctAnswer ?? "").trim();

        if (!trimmedSelected) {
            setAnswerState({
                correct: false,
                message: "Please answer before continuing.",
            });
            return;
        }

        const correct = trimmedSelected === trimmedCorrect;

        setAnswerState({
            correct,
            message: correct
                ? "Correct ✓ You can continue."
                : `Incorrect — the correct answer is "${trimmedCorrect}". Try again.`,
        });
    };

    const handleNext = () => {
        if (!lesson) return;

        if (isExerciseStep && answerState?.correct !== true) {
            if (!selectedAnswer || !String(selectedAnswer).trim()) {
                setAnswerState({
                    correct: false,
                    message: "Please answer before continuing.",
                });
                return;
            }

            setAnswerState({
                correct: false,
                message: `Incorrect — the correct answer is "${String(currentItem.payload.correctAnswer ?? "").trim()}". Please try again.`,
            });
            return;
        }

        if (currentStep < totalSteps - 1) {
            setCurrentStep((prev) => prev + 1);
            setSelectedAnswer("");
            setAnswerState(null);
            return;
        }

        finishLesson();
    };

    const finishLesson = async () => {
        setIsCompleting(true);
        setCompletionError("");

        try {
            const response = await fetch(`${API_URL}/api/learning/lessons/${id}/complete`, {
                method: "POST",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                },
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data?.message || "Could not complete lesson");
            }

            setCompleteState(data);
        } catch (err) {
            console.error(err);
            setCompletionError(err.message || "Unable to save lesson completion. Please try again.");
        } finally {
            setIsCompleting(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#111111] flex items-center justify-center px-6">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#D6A85F] mx-auto" />
                    <p className="mt-4 text-sm text-[#A7A29A]">Loading lesson...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-[#111111] flex items-center justify-center px-6">
                <div className="bg-[#202020] border border-[#33302B] rounded-2xl p-8 max-w-md text-center">
                    <p className="text-lg font-semibold text-[#F5F2EB]">Unable to load this lesson.</p>
                    <p className="mt-2 text-sm text-[#A7A29A]">Please try again or return to the learning list.</p>
                    <Link
                        to="/learning"
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#D6A85F] text-[#111111] px-4 py-2.5 text-sm font-semibold transition hover:bg-[#B88B47] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#202020]"
                    >
                        Back to Learning
                    </Link>
                </div>
            </main>
        );
    }

    if (!lesson) {
        return null;
    }

    if (completeState) {
        return (
            <main className="min-h-screen bg-[#111111] px-6 py-16">
                <div className="max-w-xl mx-auto bg-[#202020] border border-[#33302B] rounded-2xl p-8 text-center">
                    <p className="mt-6 text-xs uppercase tracking-[0.2em] text-[#D6A85F] font-semibold">
                        Lesson Complete
                    </p>
                    <h1 className="mt-3 font-serif text-3xl font-semibold text-[#F5F2EB]">
                        Excellent work.
                    </h1>
                    <p className="mt-3 text-sm text-[#A7A29A]">{completeState.message || "Lesson completed successfully."}</p>

                    <button
                        onClick={() => navigate("/learning")}
                        className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#D6A85F] text-[#111111] px-5 py-3 text-sm font-semibold hover:bg-[#B88B47] transition focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#202020]"
                    >
                        Continue Learning
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#111111] px-6 py-10">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <button
                        onClick={() => navigate("/learning")}
                        className="inline-flex items-center gap-2 text-sm text-[#A7A29A] hover:text-[#D6A85F] transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to lessons
                    </button>

                    <div className="text-sm text-[#A7A29A]">
                        Lesson {currentStep + 1} of {totalSteps}
                    </div>
                </div>

                <div className="bg-[#202020] border border-[#33302B] rounded-2xl overflow-hidden">
                    <div className="border-b border-[#33302B] px-6 py-4">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs uppercase tracking-[0.2em] text-[#D6A85F] font-semibold">
                                MORVA Alphabet
                            </p>
                            <span className="text-xs text-[#A7A29A]">{progressPercent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-[#1A1A1A] overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#D6A85F] transition-all"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {currentItem?.type === "letter" && (
                            <div className="space-y-6">
                                <div className="bg-[#1A1A1A] border border-[#33302B] rounded-2xl p-8 text-center">
                                    <p className="text-sm uppercase tracking-[0.2em] text-[#A7A29A]">Letter</p>
                                    <div className="mt-5 font-serif text-6xl md:text-7xl font-semibold text-[#D6A85F]">
                                        {currentItem.payload.character || "?"}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-0">
                                    <div className="rounded-2xl border border-[#33302B] bg-[#1A1A1A] p-5">
                                        <p className="text-xs uppercase tracking-[0.2em] text-[#A7A29A]">Translation</p>
                                        <p className="mt-3 text-lg font-medium text-[#F5F2EB] cipher">
                                            {currentItem.payload.translation || "—"}
                                        </p>
                                    </div>
                                </div>

                                {(currentItem.payload.example || currentItem.payload.description) && (
                                    <div className="rounded-2xl border border-[#33302B] bg-[#1A1A1A] p-5">
                                        <p className="text-xs uppercase tracking-[0.2em] text-[#A7A29A]">Example</p>
                                        <p className="mt-3 text-lg text-[#F5F2EB] cipher">
                                            {currentItem.payload.example || currentItem.payload.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentItem?.type === "exercise" && (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-[#33302B] bg-[#1A1A1A] p-5">
                                    <p className="text-xs uppercase tracking-[0.2em] text-[#A7A29A]">Exercise</p>
                                    <h2 className="mt-3 text-2xl font-semibold text-[#F5F2EB]">
                                        {currentItem.payload.question}
                                    </h2>
                                </div>

                                {currentItem.payload.options?.length ? (
                                    <div className="space-y-3">
                                        {currentItem.payload.options.map((option) => (
                                            <button
                                                key={option}
                                                type="button"
                                                onClick={() => setSelectedAnswer(option)}
                                                className={`cipher w-full text-left rounded-xl border px-4 py-3 transition ${
                                                    selectedAnswer === option
                                                        ? "border-[#D6A85F] bg-[#D6A85F] text-[#111111] font-semibold"
                                                        : "border-[#33302B] bg-[#1A1A1A] text-[#F5F2EB] hover:border-[#D6A85F]/60 hover:bg-[#D6A85F]/5"
                                                }`}
                                            >
                                                {option}
                                            </button>
                                        ))}
                                    </div>
                                ) : (
                                    <div>
                                        <input
                                            value={selectedAnswer}
                                            onChange={(e) => setSelectedAnswer(e.target.value)}
                                            className="cipher w-full rounded-xl border border-[#33302B] bg-[#1A1A1A] text-[#F5F2EB] px-4 py-3 outline-none transition focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30 placeholder:text-[#A7A29A]/60"
                                        />
                                    </div>
                                )}

                                {answerState && (
                                    <div
                                        className={`rounded-xl border px-4 py-3 text-sm ${
                                            answerState.correct
                                                ? "border-[#7DAD8A]/30 bg-[#7DAD8A]/10 text-[#7DAD8A]"
                                                : "border-[#D47777]/30 bg-[#D47777]/10 text-[#D47777]"
                                        }`}
                                    >
                                        {answerState.message}
                                    </div>
                                )}

                                {(!answerState || !answerState.correct) && (
                                    <button
                                        type="button"
                                        onClick={handleAnswerSubmit}
                                        disabled={!selectedAnswer && !currentItem.payload.options?.length}
                                        className="inline-flex items-center justify-center rounded-xl bg-[#D6A85F] text-[#111111] px-5 py-3 text-sm font-semibold transition hover:bg-[#B88B47] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#202020] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        Check answer
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    {completionError && (
                        <p role="alert" className="border-t border-[#33302B] px-6 pt-4 text-sm text-[#D47777]">
                            {completionError}
                        </p>
                    )}
                    <div className="border-t border-[#33302B] p-6 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                            disabled={currentStep === 0}
                            className="inline-flex items-center gap-2 rounded-xl border border-[#33302B] bg-[#1A1A1A] px-4 py-2.5 text-sm font-medium text-[#F5F2EB] transition hover:border-[#D6A85F]/60 hover:text-[#D6A85F] focus:outline-none focus:ring-2 focus:ring-[#D6A85F]/40 disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-[#33302B] disabled:hover:text-[#F5F2EB]"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isCompleting || (isExerciseStep && answerState?.correct !== true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#D6A85F] text-[#111111] px-5 py-2.5 text-sm font-semibold transition hover:bg-[#B88B47] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#202020] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-[#D6A85F]"
                        >
                            {currentStep === totalSteps - 1 ? (isCompleting ? "Finishing..." : "Complete Lesson") : "Next"}
                            {!isCompleting && currentStep < totalSteps - 1 && <ArrowRight className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
            </div>
        </main>
    );
}

export default Lesson;