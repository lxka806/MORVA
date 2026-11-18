import { useEffect, useState } from 'react';
import { Link } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { 
    ArrowRight, 
    CheckCircle, 
    Award, 
    Star,
    Zap,
    ChevronRight,
    BookOpen,
    Target,
    BarChart3
} from 'lucide-react';

const API_URL = import.meta.env.VITE_API_URL;
const activityDate = new Date();
const activityDaysInMonth = new Date(
    activityDate.getFullYear(),
    activityDate.getMonth() + 1,
    0
).getDate();
const activityCalendar = [
    ...Array(new Date(activityDate.getFullYear(), activityDate.getMonth(), 1).getDay()).fill(null),
    ...Array.from({ length: activityDaysInMonth }, (_, index) => index + 1)
];
const activityLevels = [
    "medium", "light", "empty", "strong", "light", "medium", "empty",
    "strong", "medium", "light", "empty", "medium", "strong", "light",
    "empty", "medium", "light", "strong", "empty", "medium", "light",
    "strong", "empty", "medium", "light", "strong", "empty", "light",
    "medium", "strong", "light"
];
const activityColors = {
    empty: "bg-[#202020]",
    light: "bg-[#D6A85F]/20",
    medium: "bg-[#D6A85F]/60",
    strong: "bg-[#D6A85F]"
};

const Home = () => {
    const { user } = useAuth();
    const [reviewStar, setReviewStar] = useState(5);
    const [hoveredStar, setHoveredStar] = useState(0);
    const [isVisible, setIsVisible] = useState({
        hero: true,
        metrics: false,
        features: false,
        steps: false,
        motivation: false,
        cta: false
    });

    const [reviews, setReviews] = useState([]);
    const [reviewText, setReviewText] = useState("");
    const [reviewsLoading, setReviewsLoading] = useState(true);
    const [reviewsLoadingMore, setReviewsLoadingMore] = useState(false);
    const [reviewsHasMore, setReviewsHasMore] = useState(false);
    const [reviewsPage, setReviewsPage] = useState(1);
    const [reviewSubmitting, setReviewSubmitting] = useState(false);
    const [reviewError, setReviewError] = useState("");

    useEffect(() => {
        const controller = new AbortController()
        const loadReviews = async () => {
            try {
                const response = await fetch(`${API_URL}/api/reviews?page=1&limit=50`, {
                    signal: controller.signal
                });
                const data = await response.json();
                if (!response.ok) {
                    throw new Error(data.message || "Unable to load reviews");
                }
                if (!Array.isArray(data)) {
                    throw new Error("Unexpected reviews response");
                }
                setReviews(data);
                setReviewsHasMore(response.headers.get("X-Has-More") === "true");
            } catch (error) {
                if (error.name !== "AbortError") {
                    setReviewError(error.message || "Unable to load reviews");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setReviewsLoading(false);
                }
            }
        };

        loadReviews();
        return () => controller.abort();
    }, []);

    const loadMoreReviews = async () => {
        setReviewsLoadingMore(true);
        setReviewError("");

        try {
            const nextPage = reviewsPage + 1;
            const response = await fetch(`${API_URL}/api/reviews?page=${nextPage}&limit=50`);
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Unable to load more reviews");
            }
            if (!Array.isArray(data)) {
                throw new Error("Unexpected reviews response");
            }

            setReviews((currentReviews) => {
                const existingIds = new Set(currentReviews.map((review) => review._id));
                return [...currentReviews, ...data.filter((review) => !existingIds.has(review._id))];
            });
            setReviewsPage(nextPage);
            setReviewsHasMore(response.headers.get("X-Has-More") === "true");
        } catch (error) {
            setReviewError(error.message || "Unable to load more reviews");
        } finally {
            setReviewsLoadingMore(false);
        }
    };

    const submitReview = async (event) => {
        event.preventDefault();
        setReviewError("");
        setReviewSubmitting(true);

        try {
            const response = await fetch(`${API_URL}/api/reviews`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ star: reviewStar, text: reviewText })
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Unable to submit review");
            }

            setReviews((currentReviews) => [
                data.review,
                ...currentReviews.filter((review) => review._id !== data.review._id)
            ]);
            setReviewText("");
        } catch (error) {
            setReviewError(error.message || "Unable to submit review");
        } finally {
            setReviewSubmitting(false);
        }
    };

    const removeReview = async (reviewId) => {
        setReviewError("");

        try {
            const response = await fetch(`${API_URL}/api/reviews/${reviewId}`, {
                method: "DELETE",
                credentials: "include"
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || "Unable to delete review");
            }
            setReviews((currentReviews) => currentReviews.filter((review) => review._id !== reviewId));
        } catch (error) {
            setReviewError(error.message || "Unable to delete review");
        }
    };

    useEffect(() => {
        const observer = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
            if (entry.isIntersecting) {
                const id = entry.target.id;
                setIsVisible(prev => ({ ...prev, [id]: true }));
            }
            });
        },
        { threshold: 0.15, rootMargin: '0px 0px -50px 0px' }
        );

        document.querySelectorAll("[data-home-section]").forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const [counts, setCounts] = useState({ sessions: 0, words: 0, satisfaction: 0 });
    useEffect(() => {
        if (isVisible.metrics) {
        const duration = 2000;
        const steps = 60;
        const interval = duration / steps;
        let currentStep = 0;
        
        const targetSessions = 10000;
        const targetWords = 50000;
        const targetSatisfaction = 95;
        
        const timer = setInterval(() => {
            currentStep++;
            const progress = currentStep / steps;
            setCounts({
            sessions: Math.round(targetSessions * progress * 0.1) * 10,
            words: Math.round(targetWords * progress * 0.1) * 10,
            satisfaction: Math.min(Math.round(targetSatisfaction * progress), targetSatisfaction)
            });
            if (currentStep >= steps) {
            setCounts({ sessions: targetSessions, words: targetWords, satisfaction: targetSatisfaction });
            clearInterval(timer);
            }
        }, interval);
        
        return () => clearInterval(timer);
        }
    }, [isVisible.metrics]);

    return (
        <main className="font-sans antialiased bg-[#111111] text-[#F5F2EB]">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
            <div className="container max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left content */}
                <div className="space-y-6 animate-fadeInUp">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#33302B] bg-[#1A1A1A] text-xs font-semibold tracking-widest text-[#A7A29A] uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#D6A85F]"></span>
                    LEARN. PRACTICE. IMPROVE.
                </div>

                <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-semibold leading-[1.05] tracking-tight text-[#F5F2EB]">
                    Learn smarter.
                    <br />
                    Speak with <span className="text-[#D6A85F]">confidence.</span>
                </h1>

                <p className="text-lg sm:text-xl text-[#A7A29A] max-w-lg leading-relaxed">
                    Build your vocabulary, practice with interactive quizzes, track your progress, 
                    and turn consistent learning into real progress.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                    <Link to="/translate">
                        <button className="group px-8 py-3.5 bg-[#D6A85F] text-[#111111] rounded-full font-semibold hover:bg-[#B88B47] transition-all flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#111111]">
                            translate now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                    <Link to="/about">
                        <button className="px-8 py-3.5 border border-[#33302B] rounded-full font-medium text-[#F5F2EB] hover:bg-[#1A1A1A] hover:border-[#D6A85F]/50 transition-all focus:outline-none focus:ring-2 focus:ring-[#D6A85F]/40">
                            Explore MORVA
                        </button>
                    </Link>
                </div>

                <div className="flex items-center gap-3 pt-4">
                    <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-[#202020] border-2 border-[#111111] flex items-center justify-center text-xs font-semibold text-[#A7A29A]">
                        {String.fromCharCode(64 + i)}
                        </div>
                    ))}
                    </div>
                    <span className="text-sm text-[#A7A29A]">Built for curious learners.</span>
                </div>
                </div>

                {/* Right - Dashboard preview */}
                <div className="relative lg:pl-4">
                <div className="relative">
                    {/* Main dashboard card */}
                    <div className="bg-[#1A1A1A] rounded-3xl border border-[#33302B] p-6 md:p-8">
                    {/* Dashboard header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                        <p className="text-sm text-[#A7A29A] font-medium">Good morning, Luka</p>
                        <p className="text-lg font-semibold text-[#F5F2EB]">Keep your streak alive.</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm bg-[#D6A85F]/10 text-[#D6A85F] border border-[#D6A85F]/30 px-3 py-1 rounded-full font-medium">
                        <Zap className="w-3.5 h-3.5" />
                        12 days
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-[#202020] rounded-2xl p-4 border border-[#33302B]">
                        <p className="text-xs text-[#A7A29A] font-medium uppercase tracking-wider">Weekly goal</p>
                        <p className="text-2xl font-bold text-[#F5F2EB]">78%</p>
                        <div className="w-full h-1.5 bg-[#111111] rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-[#D6A85F] rounded-full w-[78%] transition-all duration-1000"></div>
                        </div>
                        </div>
                        <div className="bg-[#202020] rounded-2xl p-4 border border-[#33302B]">
                        <p className="text-xs text-[#A7A29A] font-medium uppercase tracking-wider">Vocabulary</p>
                        <p className="text-2xl font-bold text-[#F5F2EB]">1,284</p>
                        <p className="text-xs text-[#7DAD8A] mt-1">+24 this week</p>
                        </div>
                        <div className="bg-[#202020] rounded-2xl p-4 border border-[#33302B]">
                        <p className="text-xs text-[#A7A29A] font-medium uppercase tracking-wider">Quiz accuracy</p>
                        <p className="text-2xl font-bold text-[#F5F2EB]">89%</p>
                        </div>
                        <div className="bg-[#202020] rounded-2xl p-4 border border-[#33302B] flex items-center justify-between">
                        <div>
                            <p className="text-xs text-[#A7A29A] font-medium uppercase tracking-wider">Progress</p>
                            <p className="text-2xl font-bold text-[#F5F2EB]">78%</p>
                        </div>
                        <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="#33302B" strokeWidth="4" />
                            <circle cx="24" cy="24" r="20" fill="none" stroke="#D6A85F" strokeWidth="4"
                                strokeDasharray={`${2 * Math.PI * 20 * 0.78} ${2 * Math.PI * 20}`} 
                                strokeLinecap="round" />
                            </svg>
                        </div>
                        </div>
                    </div>

                    {/* Activity chart */}
                    <div className="mb-6">
                        <p className="text-xs text-[#A7A29A] font-medium uppercase tracking-wider mb-2">Weekly activity</p>
                        <div className="flex items-end gap-2 h-16">
                        {[65, 80, 45, 90, 70, 55, 40].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div 
                                className="w-full max-w-[28px] rounded-md bg-[#D6A85F]/40 hover:bg-[#D6A85F] transition-all duration-300"
                                style={{ height: `${height}%` }}
                            />
                            <span className="text-[10px] text-[#A7A29A] font-medium">
                                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                            </span>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Continue learning card */}
                    <div className="bg-[#202020] rounded-2xl p-4 border border-[#33302B] flex items-center justify-between">
                        <div>
                        <p className="font-semibold text-[#F5F2EB]">MORVA — Intermediate</p>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="w-24 h-1.5 bg-[#111111] rounded-full overflow-hidden">
                            <div className="h-full bg-[#D6A85F] rounded-full w-[64%]"></div>
                            </div>
                            <span className="text-xs font-medium text-[#A7A29A]">64%</span>
                        </div>
                        </div>
                        <button className="text-[#D6A85F] font-medium text-sm hover:text-[#B88B47] flex items-center gap-1 transition-colors">
                        Continue
                        <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    </div>

                    {/* Floating cards */}
                    <div className="absolute -bottom-4 -left-6 md:-bottom-6 md:-left-8 bg-[#202020] rounded-2xl border border-[#33302B] px-4 py-3 animate-float-delayed">
                    <p className="text-xs text-[#7DAD8A]">✓ Quiz completed</p>
                    <p className="font-semibold text-sm text-[#F5F2EB]">89% score</p>
                    </div>
                    <div className="absolute top-1/2 -left-10 md:-left-12 -translate-y-1/2 bg-[#202020] rounded-2xl border border-[#33302B] px-3 py-2 hidden md:block animate-float-slow">
                    <p className="text-xs text-[#D6A85F]">🔥 7 day streak</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* ===== TRUST / SOCIAL PROOF ===== */}
        <section 
            id="metrics"
            data-home-section
            className="border-t border-[#33302B] bg-[#1A1A1A] py-16"
        >
            <div className="container max-w-[1280px] mx-auto px-6">
            <p className="text-center text-sm font-semibold tracking-widest text-[#A7A29A] uppercase mb-12">
                Everything you need to make progress.
            </p>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 ${isVisible.metrics ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight text-[#D6A85F]">{counts.sessions.toLocaleString()}+</p>
                <p className="text-sm text-[#A7A29A] mt-1">Learning sessions</p>
                </div>
                <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight text-[#D6A85F]">{counts.words.toLocaleString()}+</p>
                <p className="text-sm text-[#A7A29A] mt-1">Words practiced</p>
                </div>
                <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight text-[#D6A85F]">{counts.satisfaction}%</p>
                <p className="text-sm text-[#A7A29A] mt-1">Learner satisfaction</p>
                </div>
                <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight text-[#D6A85F]">24/7</p>
                <p className="text-sm text-[#A7A29A] mt-1">Access</p>
                </div>
            </div>
            </div>
        </section>

        {/* ===== FEATURES — BENTO GRID ===== */}
        <section id="features" data-home-section className="py-20">
            <div className="container max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#F5F2EB]">Everything you need to learn better.</h2>
                <p className="text-[#A7A29A] text-lg mt-3 max-w-2xl mx-auto">One simple platform for building consistent learning habits.</p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-700 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Feature 1 - Learning (large) */}
                <div className="md:col-span-2 bg-[#202020] rounded-2xl border border-[#33302B] p-7 hover:border-[#D6A85F]/50 transition-all duration-300 group">
                <div className="flex items-start gap-2 mb-4">
                    <BookOpen className="w-6 h-6 text-[#D6A85F]" />
                    <span className="text-xs font-semibold text-[#A7A29A] bg-[#1A1A1A] border border-[#33302B] px-3 py-1 rounded-full">01</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#F5F2EB]">Learn at your pace.</h3>
                <p className="text-[#A7A29A] mt-1">Explore structured lessons and build your knowledge step by step.</p>
                <div className="mt-5 bg-[#1A1A1A] rounded-2xl p-5 border border-[#33302B]">
                    <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-sm font-medium text-[#F5F2EB]">MORVA · Unit 3</p>
                        <p className="text-xs text-[#A7A29A]">Lesson 4 of 12</p>
                    </div>
                    <span className="text-xs font-medium text-[#D6A85F]">64%</span>
                    </div>
                    <div className="w-full h-2 bg-[#111111] rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-[#D6A85F] rounded-full w-[64%]"></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                    <span className="text-[#A7A29A]">Completed: 8 lessons</span>
                    <button className="text-[#D6A85F] font-medium flex items-center gap-1 hover:text-[#B88B47] transition-colors">
                        Continue <ChevronRight className="w-4 h-4" />
                    </button>
                    </div>
                </div>
                </div>

                {/* Feature 2 - Vocabulary */}
                <div className="bg-[#202020] rounded-2xl border border-[#33302B] p-7 hover:border-[#D6A85F]/50 transition-all duration-300 group">
                <div className="flex items-start gap-2 mb-4">
                    <BookOpen className="w-6 h-6 text-[#D6A85F]" />
                    <span className="text-xs font-semibold text-[#A7A29A] bg-[#1A1A1A] border border-[#33302B] px-3 py-1 rounded-full">02</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#F5F2EB]">Build your vocabulary.</h3>
                <p className="text-[#A7A29A] mt-1">Save important words and practice them whenever you need.</p>
                <div className="mt-5 bg-[#1A1A1A] rounded-2xl p-5 border border-[#33302B]">
                    <div className="flex justify-between items-center">
                    <div>
                        <p className="text-1xl font-bold text-[#F5F2EB] cipher">to learn</p>
                        <p className="text-sm text-[#A7A29A] mt-1">to learn</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-medium text-[#7DAD8A] bg-[#7DAD8A]/10 border border-[#7DAD8A]/30 px-3 py-1 rounded-full">Mastered</span>
                        <p className="text-xs text-[#A7A29A] mt-1">Difficulty: ★★☆</p>
                    </div>
                    </div>
                </div>
                </div>

                {/* Feature 3 - Quizzes */}
                <div className="bg-[#202020] rounded-2xl border border-[#33302B] p-7 hover:border-[#D6A85F]/50 transition-all duration-300 group">
                <div className="flex items-start gap-2 mb-4">
                    <Target className="w-6 h-6 text-[#D6A85F]" />
                    <span className="text-xs font-semibold text-[#A7A29A] bg-[#1A1A1A] border border-[#33302B] px-3 py-1 rounded-full">03</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#F5F2EB]">Test yourself.</h3>
                <p className="text-[#A7A29A] mt-1">Turn what you've learned into real progress with interactive quizzes.</p>
                <div className="mt-5 bg-[#1A1A1A] rounded-2xl p-5 border border-[#33302B]">
                    <p className="text-sm font-medium mb-3 text-[#F5F2EB]">What does <span className='cipher'>"To learn"</span> mean?</p>
                    <div className="space-y-2">
                    {['To teach', 'To learn', 'To speak', 'To read'].map((answer, i) => (
                        <div key={i} className={`px-4 py-2 rounded-xl text-sm border transition-colors ${i === 1 ? 'border-[#7DAD8A] bg-[#7DAD8A]/10 text-[#7DAD8A]' : 'border-[#33302B] text-[#F5F2EB] hover:bg-[#202020]'}`}>
                        {String.fromCharCode(65 + i)}. {answer} {i === 1 && <CheckCircle className="inline w-4 h-4 ml-2 text-[#7DAD8A]" />}
                        </div>
                    ))}
                    </div>
                    <p className="text-xs text-[#A7A29A] mt-3">Question 7 / 10</p>
                </div>
                </div>

                {/* Feature 4 - Progress */}
                <div className="bg-[#202020] rounded-2xl border border-[#33302B] p-7 hover:border-[#D6A85F]/50 transition-all duration-300 group">
                <div className="flex items-start gap-2 mb-4">
                    <BarChart3 className="w-6 h-6 text-[#D6A85F]" />
                    <span className="text-xs font-semibold text-[#A7A29A] bg-[#1A1A1A] border border-[#33302B] px-3 py-1 rounded-full">04</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#F5F2EB]">See your progress.</h3>
                <p className="text-[#A7A29A] mt-1">Understand your learning habits with clear statistics and insights.</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="bg-[#1A1A1A] rounded-xl p-3 text-center border border-[#33302B]">
                    <p className="text-xl font-bold text-[#D6A85F]">12</p>
                    <p className="text-[10px] text-[#A7A29A] uppercase tracking-wider">Day streak</p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-xl p-3 text-center border border-[#33302B]">
                    <p className="text-xl font-bold text-[#D6A85F]">89%</p>
                    <p className="text-[10px] text-[#A7A29A] uppercase tracking-wider">Accuracy</p>
                    </div>
                    <div className="bg-[#1A1A1A] rounded-xl p-3 text-center border border-[#33302B] col-span-2">
                    <p className="text-xl font-bold text-[#D6A85F]">1,284</p>
                    <p className="text-[10px] text-[#A7A29A] uppercase tracking-wider">Words learned</p>
                    </div>
                </div>
                </div>

                {/* Feature 5 - Leaderboard */}
                <div className="md:col-span-1 bg-[#202020] rounded-2xl border border-[#33302B] p-7 hover:border-[#D6A85F]/50 transition-all duration-300 group">
                <div className="flex items-start gap-2 mb-4">
                    <Award className="w-6 h-6 text-[#D6A85F]" />
                    <span className="text-xs font-semibold text-[#A7A29A] bg-[#1A1A1A] border border-[#33302B] px-3 py-1 rounded-full">05</span>
                </div>
                <h3 className="text-2xl font-semibold text-[#F5F2EB]">Compete & improve.</h3>
                <p className="text-[#A7A29A] mt-1">Challenge yourself and see how your progress compares.</p>
                <div className="mt-5 space-y-2">
                    {[
                    { name: 'Alex', xp: 2840, highlight: false },
                    { name: 'Mia', xp: 2540, highlight: false },
                    { name: 'Luka', xp: 2320, highlight: true },
                    { name: 'Noah', xp: 2100, highlight: false },
                    ].map((user, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${user.highlight ? 'bg-[#D6A85F]/10 border-[#D6A85F]/40' : 'border-[#33302B] hover:bg-[#1A1A1A]'}`}>
                        <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-[#A7A29A] w-5">{i + 1}</span>
                        <span className={`font-medium ${user.highlight ? 'text-[#D6A85F]' : 'text-[#F5F2EB]'}`}>{user.name}</span>
                        </div>
                        <span className={`text-sm font-medium ${user.highlight ? 'text-[#D6A85F]' : 'text-[#A7A29A]'}`}>{user.xp.toLocaleString()} XP</span>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* ===== HOW MORVA WORKS ===== */}
        <section id="steps" data-home-section className="py-20 bg-[#1A1A1A] border-t border-[#33302B]">
            <div className="container max-w-[1280px] mx-auto px-6">
            <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-center mb-16 text-[#F5F2EB]">Your progress starts with three simple steps.</h2>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 ${isVisible.steps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {[
                { number: '01', title: 'Create your account', desc: 'Set up your personal MORVA learning space in seconds.' },
                { number: '02', title: 'Start learning', desc: 'Practice vocabulary, complete lessons, and challenge yourself with quizzes.' },
                { number: '03', title: 'Track your progress', desc: 'Watch your skills improve and build a consistent learning habit.' }
                ].map((step, i) => (
                <div key={i} className="bg-[#202020] rounded-2xl border border-[#33302B] p-8 hover:border-[#D6A85F]/50 transition-all duration-300">
                    <p className="font-serif text-6xl font-semibold text-[#D6A85F]/30 mb-4">{step.number}</p>
                    <h3 className="text-xl font-semibold text-[#F5F2EB]">{step.title}</h3>
                    <p className="text-[#A7A29A] mt-2">{step.desc}</p>
                </div>
                ))}
            </div>
            </div>
        </section>
        {/* ===== MOTIVATION SECTION ===== */}
        <section id="motivation" data-home-section className="py-20 bg-[#111111]">
            <div className="container max-w-[1280px] mx-auto px-6">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-700 ${isVisible.motivation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight leading-[1.1] text-[#F5F2EB]">
                    Consistency beats intensity.
                </h2>
                <p className="text-[#A7A29A] text-lg mt-4 max-w-md">
                    Learn a little every day. MORVA helps you turn small sessions into real progress.
                </p>
                </div>

                <div className="bg-[#1A1A1A] rounded-2xl border border-[#33302B] p-8">
                <div className="flex justify-between items-start mb-6">
                    <p className="font-semibold text-lg text-[#F5F2EB]">
                        {activityDate.toLocaleDateString("en-US", { month: "long", year: "numeric" })}
                    </p>
                    <p className="text-sm font-medium text-[#D6A85F] bg-[#D6A85F]/10 border border-[#D6A85F]/30 px-4 py-1.5 rounded-full">Sample activity</p>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                    {activityCalendar.map((day, index) => {
                    const level = day && day <= activityDate.getDate()
                        ? activityLevels[day - 1]
                        : "empty";
                    return (
                        <div 
                        key={day ?? `blank-${index}`}
                        className={`aspect-square rounded-md ${activityColors[level]} transition-all duration-200 hover:scale-110`}
                        title={day ? `Day ${day}` : undefined}
                        aria-hidden={!day}
                        />
                    );
                    })}
                </div>
                <div className="flex flex-wrap items-center gap-4 mt-4 text-xs text-[#A7A29A]">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#202020] border border-[#33302B]"></span> None</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#D6A85F]/20"></span> Light</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#D6A85F]/60"></span> Medium</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-[#D6A85F]"></span> Strong</span>
                </div>
                </div>
            </div>
            </div>
        </section>


        <section id="reviews" className="py-20 bg-[#1A1A1A] border-t border-[#33302B]">
            <div className="container max-w-[1280px] mx-auto px-6">
            <div className="text-center max-w-2xl mx-auto">
                <p className="text-sm font-semibold tracking-widest text-[#D6A85F] uppercase">Learner feedback</p>
                <h2 className="font-serif text-4xl md:text-5xl font-semibold tracking-tight text-[#F5F2EB] mt-3">Reviews from the community.</h2>
                <p className="text-[#A7A29A] mt-4">Share what your MORVA learning journey has been like.</p>
            </div>

            {reviewError && (
                <p role="alert" className="mt-6 text-center text-sm text-red-400">{reviewError}</p>
            )}

            {user ? (
                <form onSubmit={submitReview} className="max-w-2xl mx-auto mt-10 rounded-2xl border border-[#33302B] bg-[#202020] p-6 md:p-8">
                    <fieldset className="mb-6">
                        <legend className="block text-sm font-medium text-[#F5F2EB] mb-3">Your rating</legend>
                        <div className="flex items-center gap-2">
                        {[1, 2, 3, 4, 5].map((rating) => (
                            <button
                                key={rating}
                                type="button"
                                onClick={() => setReviewStar(rating)}
                                onMouseEnter={() => setHoveredStar(rating)}
                                onMouseLeave={() => setHoveredStar(0)}
                                aria-label={`${rating} ${rating === 1 ? "star" : "stars"}`}
                                aria-pressed={reviewStar === rating}
                                className="transition-transform duration-200 hover:scale-125 focus:outline-none focus:ring-2 focus:ring-[#D6A85F] rounded"
                            >
                                <Star className={`h-8 w-8 transition-colors duration-200 ${
                                    rating <= (hoveredStar || reviewStar)
                                        ? "fill-[#D6A85F] text-[#D6A85F]"
                                        : "text-[#55514A]"
                                }`} />
                            </button>
                        ))}
                        <span className="ml-2 text-sm text-[#A7A29A]">{reviewStar}/5</span>
                        </div>
                    </fieldset>
                    <label htmlFor="review-text" className="block text-sm font-medium text-[#F5F2EB] mb-2">Your review</label>
                    <textarea
                        id="review-text"
                        value={reviewText}
                        onChange={(event) => setReviewText(event.target.value)}
                        maxLength={1000}
                        required
                        rows={4}
                        placeholder="What do you enjoy about learning with MORVA?"
                        className="w-full resize-y rounded-xl border border-[#33302B] bg-[#111111] p-4 text-[#F5F2EB] placeholder:text-[#77736D] focus:outline-none focus:ring-2 focus:ring-[#D6A85F]"
                    />
                    <div className="mt-4 flex items-center justify-between gap-4">
                        <span className="text-xs text-[#A7A29A]">{reviewText.length}/1000</span>
                        <button
                            type="submit"
                            disabled={reviewSubmitting || !reviewText.trim()}
                            className="rounded-full bg-[#D6A85F] px-6 py-2.5 font-semibold text-[#111111] transition-colors hover:bg-[#B88B47] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {reviewSubmitting ? "Submitting..." : "Post review"}
                        </button>
                    </div>
                </form>
            ) : (
                <p className="mt-8 text-center text-[#A7A29A]">
                    <Link to="/login" className="text-[#D6A85F] hover:underline">Log in</Link> to leave a review.
                </p>
            )}

            {reviewsLoading ? (
                <p className="mt-10 text-center text-[#A7A29A]">Loading reviews...</p>
            ) : reviews.length === 0 ? (
                <p className="mt-10 text-center text-[#A7A29A]">No reviews yet. Be the first to share your experience.</p>
            ) : (
                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3">
                    {reviews.map((review) => (
                        <article key={review._id} className="rounded-2xl border border-[#33302B] bg-[#202020] p-6">
                            <div className="flex items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#D6A85F]/10 font-semibold text-[#D6A85F]">
                                        {review.icon || review.name?.charAt(0) || "?"}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-[#F5F2EB]">{review.name}</p>
                                        <div className="flex" aria-label={`${review.star} out of 5 stars`}>
                                            {Array.from({ length: 5 }, (_, index) => (
                                                <Star key={index} className={`h-4 w-4 ${index < review.star ? "fill-[#D6A85F] text-[#D6A85F]" : "text-[#55514A]"}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                {user && String(review.USERID) === String(user.id) && (
                                    <button
                                        type="button"
                                        onClick={() => removeReview(review._id)}
                                        className="text-xs text-[#A7A29A] hover:text-red-400"
                                        aria-label={`Delete your review by ${review.name}`}
                                    >
                                        Delete
                                    </button>
                                )}
                            </div>
                            <p className="mt-5 whitespace-pre-wrap leading-relaxed text-[#A7A29A]">{review.text}</p>
                        </article>
                    ))}
                </div>
            )}
            {reviewsHasMore && (
                <div className="mt-8 text-center">
                    <button
                        type="button"
                        onClick={loadMoreReviews}
                        disabled={reviewsLoadingMore}
                        className="rounded-xl border border-[#33302B] px-6 py-3 text-sm font-medium text-[#F5F2EB] transition hover:border-[#D6A85F] hover:text-[#D6A85F] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {reviewsLoadingMore ? "Loading..." : "Load more reviews"}
                    </button>
                </div>
            )}
            </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section id="cta" data-home-section className="py-20 bg-[#111111] border-t border-[#33302B] relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-[#D6A85F]/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="container max-w-[1280px] mx-auto px-6 text-center relative">
            <div className={`transition-all duration-700 ${isVisible.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-[#F5F2EB]">Ready to start learning?</h2>
                <p className="text-[#A7A29A] text-lg mt-4 max-w-lg mx-auto">Create your free MORVA account and start building your learning habit today.</p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/learning">
                    <button className="px-10 py-4 bg-[#D6A85F] text-[#111111] rounded-full font-semibold hover:bg-[#B88B47] transition-all flex items-center gap-2 text-lg focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#111111]">
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </Link>
                </div>
                <p className="text-sm text-[#A7A29A] mt-4">No credit card required.</p>
            </div>
            </div>
        </section>
        </main>
    );
};

export default Home;