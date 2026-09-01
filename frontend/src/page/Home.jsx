import React, { useEffect, useRef, useState } from 'react';
import { Link } from "react-router-dom";
import { 
    ArrowRight, 
    CheckCircle, 
    TrendingUp, 
    Award, 
    Clock, 
    Calendar, 
    Star,
    Zap,
    ChevronRight,
    Users,
    BookOpen,
    Target,
    BarChart3
} from 'lucide-react';

const Home = () => {
    // Intersection Observer for scroll animations
    const [isVisible, setIsVisible] = useState({
        hero: true,
        metrics: false,
        features: false,
        steps: false,
        showcase: false,
        motivation: false,
        cta: false
    });

    const sectionRefs = {
        metrics: useRef(null),
        features: useRef(null),
        steps: useRef(null),
        showcase: useRef(null),
        motivation: useRef(null),
        cta: useRef(null)
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

        Object.values(sectionRefs).forEach(ref => {
        if (ref.current) observer.observe(ref.current);
        });

        return () => observer.disconnect();
    }, []);

    // Number counter animation
    const [counts, setCounts] = useState({ sessions: 0, words: 0, satisfaction: 0 });
    const metricsRef = useRef(null);

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
        <main className="font-['Inter'] antialiased bg-white text-[#111111]">
        {/* ===== HERO SECTION ===== */}
        <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
            <div className="container max-w-[1280px] mx-auto px-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center">
                {/* Left content */}
                <div className="space-y-6 animate-fadeInUp">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50/80 text-xs font-semibold tracking-widest text-gray-600 uppercase">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                    LEARN. PRACTICE. IMPROVE.
                </div>

                <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-bold leading-[1.05] tracking-tight">
                    Learn smarter.
                    <br />
                    Speak with <span className="text-blue-500">confidence.</span>
                </h1>

                <p className="text-lg sm:text-xl text-gray-600 max-w-lg leading-relaxed">
                    Build your vocabulary, practice with interactive quizzes, track your progress, 
                    and turn consistent learning into real progress.
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2 ">
                    <Link to="/translate">
                        <button className="group px-8 py-3.5 bg-[#111111] text-white rounded-full font-medium hover:bg-[#2a2a2a] transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2">
                            translate now
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                        </button>
                    </Link>
                    <link />
                    <Link to="/about">
                        <button className="px-8 py-3.5 border border-gray-200 rounded-full font-medium text-gray-700 hover:bg-gray-50 hover:border-gray-300 transition-all hover:-translate-y-0.5">
                            Explore MORVA
                        </button>
                    </Link>
                    <p className='cipher'></p>
                </div>

                <div className="flex items-center gap-3 pt-4">
                    <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="w-8 h-8 rounded-full bg-gray-200 border-2 border-white flex items-center justify-center text-xs font-semibold text-gray-600">
                        {String.fromCharCode(64 + i)}
                        </div>
                    ))}
                    </div>
                    <span className="text-sm text-gray-500">Built for curious learners.</span>
                </div>
                </div>

                {/* Right - Dashboard preview */}
                <div className="relative lg:pl-4">
                <div className="relative">
                    {/* Main dashboard card */}
                    <div className="bg-white rounded-3xl border border-gray-200 shadow-xl shadow-gray-100/50 p-6 md:p-8">
                    {/* Dashboard header */}
                    <div className="flex justify-between items-start mb-6">
                        <div>
                        <p className="text-sm text-gray-500 font-medium">Good morning, Luka</p>
                        <p className="text-lg font-semibold">Keep your streak alive.</p>
                        </div>
                        <div className="flex items-center gap-1 text-sm bg-blue-50 text-blue-600 px-3 py-1 rounded-full font-medium">
                        <Zap className="w-3.5 h-3.5" />
                        12 days
                        </div>
                    </div>

                    {/* Stats grid */}
                    <div className="grid grid-cols-2 gap-4 mb-6">
                        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Weekly goal</p>
                        <p className="text-2xl font-bold">78%</p>
                        <div className="w-full h-1.5 bg-gray-200 rounded-full mt-2 overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full w-[78%] transition-all duration-1000"></div>
                        </div>
                        </div>
                        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Vocabulary</p>
                        <p className="text-2xl font-bold">1,284</p>
                        <p className="text-xs text-green-600 mt-1">+24 this week</p>
                        </div>
                        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Quiz accuracy</p>
                        <p className="text-2xl font-bold">89%</p>
                        </div>
                        <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                        <div>
                            <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">Progress</p>
                            <p className="text-2xl font-bold">78%</p>
                        </div>
                        <div className="relative w-12 h-12">
                            <svg className="w-12 h-12 transform -rotate-90">
                            <circle cx="24" cy="24" r="20" fill="none" stroke="#e5e7eb" strokeWidth="4" />
                            <circle cx="24" cy="24" r="20" fill="none" stroke="#3b82f6" strokeWidth="4" 
                                strokeDasharray={`${2 * Math.PI * 20 * 0.78} ${2 * Math.PI * 20}`} 
                                strokeLinecap="round" />
                            </svg>
                        </div>
                        </div>
                    </div>

                    {/* Activity chart */}
                    <div className="mb-6">
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-2">Weekly activity</p>
                        <div className="flex items-end gap-2 h-16">
                        {[65, 80, 45, 90, 70, 55, 40].map((height, i) => (
                            <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div 
                                className="w-full max-w-[28px] rounded-md bg-blue-500/70 hover:bg-blue-500 transition-all duration-300"
                                style={{ height: `${height}%` }}
                            />
                            <span className="text-[10px] text-gray-400 font-medium">
                                {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'][i]}
                            </span>
                            </div>
                        ))}
                        </div>
                    </div>

                    {/* Continue learning card */}
                    <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 flex items-center justify-between">
                        <div>
                        <p className="font-semibold">MORVA — Intermediate</p>
                        <div className="flex items-center gap-3 mt-1">
                            <div className="w-24 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                            <div className="h-full bg-blue-500 rounded-full w-[64%]"></div>
                            </div>
                            <span className="text-xs font-medium text-gray-600">64%</span>
                        </div>
                        </div>
                        <button className="text-blue-600 font-medium text-sm hover:text-blue-700 flex items-center gap-1 transition-colors">
                        Continue
                        <ChevronRight className="w-4 h-4" />
                        </button>
                    </div>
                    </div>

                    {/* Floating cards */}
                    <div className="absolute -bottom-4 -left-6 md:-bottom-6 md:-left-8 bg-white rounded-2xl border border-gray-200 shadow-lg px-4 py-3 animate-float-delayed">
                    <p className="text-xs text-green-600">✓ Quiz completed</p>
                    <p className="font-semibold text-sm">89% score</p>
                    </div>
                    <div className="absolute top-1/2 -left-10 md:-left-12 -translate-y-1/2 bg-white rounded-2xl border border-gray-200 shadow-lg px-3 py-2 hidden md:block animate-float-slow">
                    <p className="text-xs text-orange-500">🔥 7 day streak</p>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* ===== TRUST / SOCIAL PROOF ===== */}
        <section 
            id="metrics" 
            ref={sectionRefs.metrics}
            className="border-t border-gray-100 bg-gray-50/40 py-16"
        >
            <div className="container max-w-[1280px] mx-auto px-6">
            <p className="text-center text-sm font-semibold tracking-widest text-gray-400 uppercase mb-12">
                Everything you need to make progress.
            </p>
            <div className={`grid grid-cols-2 md:grid-cols-4 gap-8 transition-all duration-700 ${isVisible.metrics ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight">{counts.sessions.toLocaleString()}+</p>
                <p className="text-sm text-gray-500 mt-1">Learning sessions</p>
                </div>
                <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight">{counts.words.toLocaleString()}+</p>
                <p className="text-sm text-gray-500 mt-1">Words practiced</p>
                </div>
                <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight">{counts.satisfaction}%</p>
                <p className="text-sm text-gray-500 mt-1">Learner satisfaction</p>
                </div>
                <div className="text-center">
                <p className="text-4xl md:text-5xl font-bold tracking-tight">24/7</p>
                <p className="text-sm text-gray-500 mt-1">Access</p>
                </div>
            </div>
            </div>
        </section>

        {/* ===== FEATURES — BENTO GRID ===== */}
        <section id="features" ref={sectionRefs.features} className="py-20">
            <div className="container max-w-[1280px] mx-auto px-6">
            <div className="text-center mb-16">
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight">Everything you need to learn better.</h2>
                <p className="text-gray-500 text-lg mt-3 max-w-2xl mx-auto">One simple platform for building consistent learning habits.</p>
            </div>

            <div className={`grid grid-cols-1 md:grid-cols-3 gap-5 transition-all duration-700 ${isVisible.features ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {/* Feature 1 - Learning (large) */}
                <div className="md:col-span-2 bg-white rounded-3xl border border-gray-200 p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start gap-2 mb-4">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">01</span>
                </div>
                <h3 className="text-2xl font-bold">Learn at your pace.</h3>
                <p className="text-gray-500 mt-1">Explore structured lessons and build your knowledge step by step.</p>
                <div className="mt-5 bg-gray-50/80 rounded-2xl p-5 border border-gray-100">
                    <div className="flex justify-between items-start mb-3">
                    <div>
                        <p className="text-sm font-medium">MORVA · Unit 3</p>
                        <p className="text-xs text-gray-400">Lesson 4 of 12</p>
                    </div>
                    <span className="text-xs font-medium text-blue-600">64%</span>
                    </div>
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden mb-4">
                    <div className="h-full bg-blue-500 rounded-full w-[64%]"></div>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-500">Completed: 8 lessons</span>
                    <button className="text-blue-600 font-medium flex items-center gap-1 hover:text-blue-700 transition-colors">
                        Continue <ChevronRight className="w-4 h-4" />
                    </button>
                    </div>
                </div>
                </div>

                {/* Feature 2 - Vocabulary */}
                <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start gap-2 mb-4">
                    <BookOpen className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">02</span>
                </div>
                <h3 className="text-2xl font-bold">Build your vocabulary.</h3>
                <p className="text-gray-500 mt-1">Save important words and practice them whenever you need.</p>
                <div className="mt-5 bg-gray-50/80 rounded-2xl p-5 border border-gray-100">
                    <div className="flex justify-between items-center">
                    <div>
                        <p className="text-2xl font-bold text-gray-800 cipher">TO learn</p>
                        <p className="text-sm text-gray-600 mt-1">to learn</p>
                    </div>
                    <div className="text-right">
                        <span className="text-xs font-medium text-green-600 bg-green-50 px-3 py-1 rounded-full">Mastered</span>
                        <p className="text-xs text-gray-400 mt-1">Difficulty: ★★☆</p>
                    </div>
                    </div>
                </div>
                </div>

                {/* Feature 3 - Quizzes */}
                <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start gap-2 mb-4">
                    <Target className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">03</span>
                </div>
                <h3 className="text-2xl font-bold">Test yourself.</h3>
                <p className="text-gray-500 mt-1">Turn what you've learned into real progress with interactive quizzes.</p>
                <div className="mt-5 bg-gray-50/80 rounded-2xl p-5 border border-gray-100">
                    <p className="text-sm font-medium mb-3">What does <span className='cipher'>"To learn"</span> mean?</p>
                    <div className="space-y-2">
                    {['To teach', 'To learn', 'To speak', 'To read'].map((answer, i) => (
                        <div key={i} className={`px-4 py-2 rounded-xl text-sm border transition-colors ${i === 1 ? 'border-green-400 bg-green-50 text-green-700' : 'border-gray-200 hover:bg-gray-50'}`}>
                        {String.fromCharCode(65 + i)}. {answer} {i === 1 && <CheckCircle className="inline w-4 h-4 ml-2 text-green-500" />}
                        </div>
                    ))}
                    </div>
                    <p className="text-xs text-gray-400 mt-3">Question 7 / 10</p>
                </div>
                </div>

                {/* Feature 4 - Progress */}
                <div className="bg-white rounded-3xl border border-gray-200 p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start gap-2 mb-4">
                    <BarChart3 className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">04</span>
                </div>
                <h3 className="text-2xl font-bold">See your progress.</h3>
                <p className="text-gray-500 mt-1">Understand your learning habits with clear statistics and insights.</p>
                <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="bg-gray-50/80 rounded-xl p-3 text-center border border-gray-100">
                    <p className="text-xl font-bold">12</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Day streak</p>
                    </div>
                    <div className="bg-gray-50/80 rounded-xl p-3 text-center border border-gray-100">
                    <p className="text-xl font-bold">89%</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Accuracy</p>
                    </div>
                    <div className="bg-gray-50/80 rounded-xl p-3 text-center border border-gray-100 col-span-2">
                    <p className="text-xl font-bold">1,284</p>
                    <p className="text-[10px] text-gray-400 uppercase tracking-wider">Words learned</p>
                    </div>
                </div>
                </div>

                {/* Feature 5 - Leaderboard */}
                <div className="md:col-span-1 bg-white rounded-3xl border border-gray-200 p-7 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300 group">
                <div className="flex items-start gap-2 mb-4">
                    <Award className="w-6 h-6 text-blue-500" />
                    <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-3 py-1 rounded-full">05</span>
                </div>
                <h3 className="text-2xl font-bold">Compete & improve.</h3>
                <p className="text-gray-500 mt-1">Challenge yourself and see how your progress compares.</p>
                <div className="mt-5 space-y-2">
                    {[
                    { name: 'Alex', xp: 2840, highlight: false },
                    { name: 'Mia', xp: 2540, highlight: false },
                    { name: 'Luka', xp: 2320, highlight: true },
                    { name: 'Noah', xp: 2100, highlight: false },
                    ].map((user, i) => (
                    <div key={i} className={`flex items-center justify-between px-4 py-2.5 rounded-xl border transition-all ${user.highlight ? 'bg-blue-50 border-blue-200' : 'border-gray-100 hover:bg-gray-50'}`}>
                        <div className="flex items-center gap-3">
                        <span className="text-sm font-bold text-gray-400 w-5">{i + 1}</span>
                        <span className={`font-medium ${user.highlight ? 'text-blue-700' : ''}`}>{user.name}</span>
                        </div>
                        <span className={`text-sm font-medium ${user.highlight ? 'text-blue-600' : 'text-gray-600'}`}>{user.xp.toLocaleString()} XP</span>
                    </div>
                    ))}
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* ===== HOW MORVA WORKS ===== */}
        <section id="steps" ref={sectionRefs.steps} className="py-20 bg-gray-50/40 border-t border-gray-100">
            <div className="container max-w-[1280px] mx-auto px-6">
            <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-center mb-16">Your progress starts with three simple steps.</h2>
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 transition-all duration-700 ${isVisible.steps ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                {[
                { number: '01', title: 'Create your account', desc: 'Set up your personal MORVA learning space in seconds.' },
                { number: '02', title: 'Start learning', desc: 'Practice vocabulary, complete lessons, and challenge yourself with quizzes.' },
                { number: '03', title: 'Track your progress', desc: 'Watch your skills improve and build a consistent learning habit.' }
                ].map((step, i) => (
                <div key={i} className="bg-white rounded-3xl border border-gray-200 p-8 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300">
                    <p className="text-6xl font-bold text-gray-100 mb-4">{step.number}</p>
                    <h3 className="text-xl font-bold">{step.title}</h3>
                    <p className="text-gray-500 mt-2">{step.desc}</p>
                </div>
                ))}
            </div>
            </div>
        </section>
        {/* ===== MOTIVATION SECTION ===== */}
        <section id="motivation" ref={sectionRefs.motivation} className="py-20 bg-white">
            <div className="container max-w-[1280px] mx-auto px-6">
            <div className={`grid grid-cols-1 lg:grid-cols-2 gap-16 items-center transition-all duration-700 ${isVisible.motivation ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
                <div>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                    Consistency beats intensity.
                </h2>
                <p className="text-gray-500 text-lg mt-4 max-w-md">
                    Learn a little every day. MORVA helps you turn small sessions into real progress.
                </p>
                </div>

                <div className="bg-gray-50/80 rounded-3xl border border-gray-200 p-8">
                <div className="flex justify-between items-start mb-6">
                    <p className="font-semibold text-lg">December 2026</p>
                    <p className="text-sm font-medium text-blue-600 bg-blue-50 px-4 py-1.5 rounded-full">18 days active</p>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                    {Array.from({ length: 35 }, (_, i) => {
                    const day = i + 1;
                    // Simulate activity: random but patterned
                    const activity = Math.random();
                    let level = 'empty';
                    if (day > 28) level = 'empty';
                    else if (activity > 0.8) level = 'strong';
                    else if (activity > 0.5) level = 'medium';
                    else if (activity > 0.2) level = 'light';
                    
                    const colors = {
                        empty: 'bg-gray-100',
                        light: 'bg-blue-200',
                        medium: 'bg-blue-400',
                        strong: 'bg-blue-600'
                    };
                    return (
                        <div 
                        key={i} 
                        className={`aspect-square rounded-md ${colors[level]} transition-all duration-200 hover:scale-110`}
                        title={`Day ${day}`}
                        />
                    );
                    })}
                </div>
                <div className="flex items-center gap-4 mt-4 text-xs text-gray-400">
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-gray-100"></span> None</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-200"></span> Light</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-400"></span> Medium</span>
                    <span className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-sm bg-blue-600"></span> Strong</span>
                </div>
                </div>
            </div>
            </div>
        </section>

        {/* ===== FINAL CTA ===== */}
        <section id="cta" ref={sectionRefs.cta} className="py-20 bg-white border-t border-gray-100 relative overflow-hidden">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-400/5 rounded-full blur-3xl pointer-events-none"></div>
            <div className="container max-w-[1280px] mx-auto px-6 text-center relative">
            <div className={`transition-all duration-700 ${isVisible.cta ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
                <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">Ready to start learning?</h2>
                <p className="text-gray-500 text-lg mt-4 max-w-lg mx-auto">Create your free MORVA account and start building your learning habit today.</p>
                <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link to="/learning">
                    <button className="px-10 py-4 bg-[#111111] text-white rounded-full font-medium hover:bg-[#2a2a2a] transition-all hover:shadow-lg hover:-translate-y-0.5 flex items-center gap-2 text-lg">
                        Get Started Free
                        <ArrowRight className="w-5 h-5" />
                    </button>
                </Link>
                </div>
                <p className="text-sm text-gray-400 mt-4">No credit card required.</p>
            </div>
            </div>
        </section>
        </main>
    );
};

export default Home;