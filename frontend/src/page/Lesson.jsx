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

    useEffect(() => {
        const fetchLesson = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await fetch(`${API_URL}/api/learning/lessons/${id}`, {
                    credentials: "include",
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
                console.error(err);
                setError("Unable to load this lesson.");
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchLesson();
        }
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
            setCompleteState({
                message: "Lesson completed",
            });
        } finally {
            setIsCompleting(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
                <div className="text-center">
                    <Loader2 className="w-10 h-10 animate-spin text-[#111111] mx-auto" />
                    <p className="mt-4 text-sm text-gray-500">Loading lesson...</p>
                </div>
            </main>
        );
    }

    if (error) {
        return (
            <main className="min-h-screen bg-[#fafafa] flex items-center justify-center px-6">
                <div className="bg-white border border-gray-200 rounded-3xl p-8 max-w-md text-center shadow-sm">
                    <p className="text-lg font-semibold text-[#111111]">Unable to load this lesson.</p>
                    <p className="mt-2 text-sm text-gray-500">Please try again or return to the learning list.</p>
                    <Link
                        to="/learning"
                        className="mt-6 inline-flex items-center justify-center rounded-xl bg-[#111111] text-white px-4 py-2.5 text-sm font-medium"
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
            <main className="min-h-screen bg-[#fafafa] px-6 py-16">
                <div className="max-w-xl mx-auto bg-white border border-gray-200 rounded-3xl shadow-sm p-8 text-center">
<p className="mt-6 text-xs uppercase tracking-[0.2em] text-blue-500 font-semibold">
                        Lesson Complete
                    </p>
                    <h1 className="mt-3 text-3xl font-bold text-[#111111]">Excellent work.</h1>
                    <p className="mt-3 text-sm text-gray-500">{completeState.message || "Lesson completed successfully."}</p>

                    <button
                        onClick={() => navigate("/learning")}
                        className="mt-7 inline-flex items-center justify-center rounded-xl bg-[#111111] text-white px-5 py-3 text-sm font-medium hover:bg-[#2b2b2b] transition"
                    >
                        Continue Learning
                    </button>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#fafafa] px-6 py-10">
            <div className="max-w-5xl mx-auto">
                <div className="mb-6 flex items-center justify-between gap-3">
                    <button
                        onClick={() => navigate("/learning")}
                        className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-[#111111] transition"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Back to lessons
                    </button>

                    <div className="text-sm text-gray-500">
                        Lesson {currentStep + 1} of {totalSteps}
                    </div>
                </div>

                <div className="bg-white border border-gray-200 rounded-3xl shadow-sm overflow-hidden">
                    <div className="border-b border-gray-200 px-6 py-4">
                        <div className="mb-3 flex items-center justify-between">
                            <p className="text-xs uppercase tracking-[0.2em] text-blue-500 font-semibold">
                                MORVA Alphabet
                            </p>
                            <span className="text-xs text-gray-500">{progressPercent}%</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100 overflow-hidden">
                            <div
                                className="h-full rounded-full bg-[#111111] transition-all"
                                style={{ width: `${progressPercent}%` }}
                            />
                        </div>
                    </div>

                    <div className="p-6 md:p-8">
                        {currentItem?.type === "letter" && (
                            <div className="space-y-6">
                                <div className="bg-[#F5F1E8] border border-[#E7DFD0] rounded-3xl p-8 text-center">
                                    <p className="text-sm uppercase tracking-[0.2em] text-gray-500">Letter</p>
                                    <div className="mt-5 text-6xl md:text-7xl font-bold text-[#111111]">
                                        {currentItem.payload.character || "?"}
                                    </div>
                                </div>

                                <div className="grid gap-4 md:grid-cols-0">
                                    <div className="rounded-2xl border border-gray-200 p-5">
                                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Translation</p>
                                        <p className="mt-3 text-lg font-medium text-[#111111] cipher">
                                            {currentItem.payload.translation || "—"}
                                        </p>
                                    </div>
                                </div>

                                {(currentItem.payload.example || currentItem.payload.description) && (
                                    <div className="rounded-2xl border border-gray-200 p-5">
                                        <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Example</p>
                                        <p className="mt-3 text-lg text-[#111111] cipher">
                                            {currentItem.payload.example || currentItem.payload.description}
                                        </p>
                                    </div>
                                )}
                            </div>
                        )}

                        {currentItem?.type === "exercise" && (
                            <div className="space-y-6">
                                <div className="rounded-2xl border border-gray-200 p-5 bg-gray-50">
                                    <p className="text-xs uppercase tracking-[0.2em] text-gray-400">Exercise</p>
                                    <h2 className="mt-3 text-2xl font-semibold text-[#111111]">
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
                                                className={`cipher w-full text-left rounded-2xl border px-4 py-3 transition ${
                                                    selectedAnswer === option
                                                        ? "border-[#111111] bg-[#111111] text-white"
                                                        : "border-gray-200 bg-white text-[#111111] hover:border-gray-300"
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
                                            className="cipher w-full rounded-2xl border border-gray-200 bg-white px-4 py-3 outline-none focus:border-[#111111]"
                                        />
                                    </div>
                                )}

                                {answerState && (
                                    <div
                                        className={`rounded-2xl border px-4 py-3 text-sm ${
                                            answerState.correct
                                                ? "border-green-200 bg-green-50 text-green-700"
                                                : "border-red-200 bg-red-50 text-red-700"
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
                                        className="inline-flex items-center justify-center rounded-xl bg-[#111111] text-white px-5 py-3 text-sm font-medium disabled:opacity-50"
                                    >
                                        Check answer
                                    </button>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-200 p-6 flex items-center justify-between gap-3">
                        <button
                            type="button"
                            onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                            disabled={currentStep === 0}
                            className="inline-flex items-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-medium text-[#111111] disabled:opacity-40"
                        >
                            <ArrowLeft className="w-4 h-4" />
                            Previous
                        </button>

                        <button
                            type="button"
                            onClick={handleNext}
                            disabled={isCompleting || (isExerciseStep && answerState?.correct !== true)}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#111111] text-white px-5 py-2.5 text-sm font-medium disabled:opacity-50"
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
