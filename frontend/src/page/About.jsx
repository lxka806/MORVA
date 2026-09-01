import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowRight, 
  ChevronDown, 
  X,
  ZoomIn,
  Play,
  Pause,
  Code,
  PenTool,
  Type,
  Layout,
  Sparkles,
  ArrowUpRight,
  Clock,
  BookOpen,
  Target,
  Award,
  BarChart3,
  Flame
} from 'lucide-react';

import morvaVideo from "../assets/morva-story.mp4";

const About = () => {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [hoveredChar, setHoveredChar] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [activeTimeline, setActiveTimeline] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const videoRef = useRef(null);

  // Intersection Observer for animations
  const sectionRefs = useRef({});
  const [visibleSections, setVisibleSections] = useState({});

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections(prev => ({ ...prev, [entry.target.id]: true }));
          }
        });
      },
      { threshold: 0.2 }
    );

    // Observe all sections
    document.querySelectorAll('[data-section]').forEach(el => {
      observer.observe(el);
    });

    // Hide scroll indicator after scrolling
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowScrollIndicator(false);
      }
    };
    window.addEventListener('scroll', handleScroll);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // MORVA Alphabet data
  const morvaAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => ({
    letter,
    glyph: String.fromCharCode(0x1F300 + i + 1), // Using emoji as placeholder glyphs
    // In production, these would be actual MORVA font glyphs
  }));

  // Gallery images data
  const galleryImages = [
    { id: 1, title: 'First experiment', size: 'large', caption: 'Initial Morse code experiments' },
    { id: 2, title: 'Shape exploration', size: 'small', caption: 'Exploring visual patterns' },
    { id: 3, title: 'Rejected character', size: 'small', caption: 'Characters that didn\'t make it' },
    { id: 4, title: 'Early alphabet', size: 'tall', caption: 'The first alphabet draft' },
    { id: 5, title: 'Final direction', size: 'small', caption: 'Refining the system' },
  ];

  const characterEvolution = [
    { letter: 'A', stages: ['Sketch', 'Refine', 'Digital', 'Final'] },
    { letter: 'B', stages: ['Sketch', 'Refine', 'Digital', 'Final'] },
    { letter: 'C', stages: ['Sketch', 'Refine', 'Digital', 'Final'] },
  ];

  const timelineSteps = [
    { label: 'Idea', icon: <Sparkles className="w-6 h-6" /> },
    { label: 'First prototype', icon: <PenTool className="w-6 h-6" /> },
    { label: 'Working font', icon: <Type className="w-6 h-6" /> },
    { label: 'MORVA website', icon: <Layout className="w-6 h-6" /> },
  ];

  const comingFeatures = [
    { title: 'Advanced Editor', description: 'More text formatting options' },
    { title: 'Mobile App', description: 'MORVA on the go' },
    { title: 'Community Features', description: 'Share your translations' },
  ];

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
      } else {
        videoRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <main className="font-['Inter'] antialiased bg-white text-[#111111]">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-gray-50 to-white">
        <div className="container max-w-[1280px] mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-gray-200 bg-gray-50/80 text-xs font-semibold tracking-widest text-gray-600 uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-500"></span>
                THE STORY BEHIND MORVA
              </div>

              <h1 className="text-5xl sm:text-6xl md:text-7xl font-bold tracking-tight leading-[1.1]">
                It started with
                <br />
                <span className="text-blue-500">Morse code.</span>
                <br />
                Then I created
                <br />
                <span className="text-blue-500">MORVA.</span>
              </h1>

              <p className="text-lg text-gray-600 mt-6 max-w-lg leading-relaxed">
                MORVA began as an experiment: taking inspiration from Morse code and reimagining 
                the idea as a visual writing system that could be easier to recognize, learn, and use.
              </p>
            </div>

            {/* Morse to MORVA transformation */}
            <div className="relative">
              <div className="bg-white rounded-3xl border border-gray-200 shadow-xl p-8">
                <div className="grid grid-cols-3 gap-4">
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((letter, i) => (
                    <div key={letter} className="text-center p-4 bg-gray-50 rounded-2xl border border-gray-100">
                      <p className="text-2xl font-bold text-gray-800">{letter}</p>
                      <p className="text-sm text-gray-400 mt-1 font-mono">
                        {['.-', '-...', '-.-.', '-..', '.', '..-.'][i]}
                      </p>
                      <div className="w-px h-8 bg-gray-200 mx-auto my-2"></div>
                      <div className="text-3xl animate-pulse cipher">
                        {['A', 'B', 'C', 'D', 'E', 'F'][i]}
                      </div>
                      <p className="text-xs text-blue-500 mt-1 font-medium">MORVA</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6 pt-6 border-t border-gray-100">
                  <ArrowRight className="w-6 h-6 text-blue-500 mx-auto" />
                  <p className="text-sm text-gray-500 mt-2">Morse Code → MORVA Glyphs</p>
                </div>
              </div>
            </div>
          </div>

          {/* Scroll indicator */}
          {showScrollIndicator && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs text-gray-400 font-medium tracking-widest uppercase">Scroll to explore</span>
              <ChevronDown className="w-5 h-5 text-gray-400" />
            </div>
          )}
        </div>
      </section>

      {/* ===== SECTION 1 — THE INSPIRATION ===== */}
      <section 
        data-section="inspiration" 
        id="inspiration"
        className={`py-24 transition-all duration-700 ${visibleSections.inspiration ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
            <div>
              <div className="text-8xl font-bold text-gray-100 mb-6">01</div>
              <h2 className="text-4xl font-bold tracking-tight mb-6">Why Morse code?</h2>
              <p className="text-gray-500 text-lg leading-relaxed mb-4">
                I was fascinated by how Morse code can represent an entire alphabet using a very simple system of dots and dashes.
              </p>
              <p className="text-gray-500 text-lg leading-relaxed">
                I wanted to take that idea and experiment with something different — a system that felt more visual and easier to recognize.
              </p>
            </div>
            <div className="bg-gray-50 rounded-3xl p-8 border border-gray-200">
              <img src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5btPVdbnsIUBONjqBX8iH3q5J_HKPLolvvbTPGMOb8ueF0LvLi7y3GoU&s=10" alt="Morse code reference" />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2 — THE QUESTION ===== */}
      <section 
        data-section="question" 
        id="question"
        className={`py-32 bg-gray-50 transition-all duration-700 ${visibleSections.question ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1] text-[#111111]">
            What if it could be easier?
          </h2>
          <p className="text-xl text-gray-500 mt-8 max-w-2xl mx-auto">
            That question became the beginning of MORVA.
          </p>
        </div>
      </section>

      {/* ===== SECTION 4 — CREATING THE CHARACTERS ===== */}
      <section 
        data-section="characters" 
        id="characters"
        className={`py-24 bg-gray-50 transition-all duration-700 ${visibleSections.characters ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="text-4xl font-bold tracking-tight">Designing a new alphabet.</h2>
            <p className="text-gray-500 text-lg mt-4 leading-relaxed">
              Each character needed to feel unique, but the whole system still needed to feel connected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {characterEvolution.map((char) => (
              <div 
                key={char.letter}
                className="bg-white rounded-3xl border border-gray-200 p-8 text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                onMouseEnter={() => setHoveredChar(char.letter)}
                onMouseLeave={() => setHoveredChar(null)}
              >
                <div className="text-7xl font-bold text-gray-200 mb-4">{char.letter}</div>
                <div className="flex items-center justify-center gap-3">
                  {char.stages.map((stage, i) => (
                    <React.Fragment key={stage}>
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-2xl transition-all duration-500 ${
                          hoveredChar === char.letter && i === 3 
                            ? 'bg-blue-500 text-white scale-110 shadow-lg shadow-blue-500/30' 
                            : 'bg-gray-100 text-gray-400'
                        }`}>
                          {hoveredChar === char.letter && i === 3 ? '✦' : ['✎', '◇', '◈', '✦'][i]}
                        </div>
                        <p className="text-xs text-gray-400 mt-2">{stage}</p>
                      </div>
                      {i < char.stages.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-gray-300 flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {hoveredChar === char.letter && (
                  <p className="text-sm text-blue-600 mt-4 font-medium">
                    → MORVA glyph revealed
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 5 — THE MORVA ALPHABET ===== */}
      <section 
        data-section="alphabet" 
        id="alphabet"
        className={`py-24 transition-all duration-700 ${visibleSections.alphabet ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">26 characters. One system.</h2>
            <p className="text-gray-500 mt-2">The MORVA alphabet</p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-13 gap-3">
            {morvaAlphabet.map((char) => (
              <div 
                key={char.letter}
                className="group bg-gray-50 rounded-2xl p-4 text-center border border-gray-100 hover:border-blue-300 hover:shadow-lg hover:bg-blue-50/30 transition-all duration-300 cursor-default"
              >
                <p className="text-sm font-medium text-gray-400 group-hover:text-blue-600 transition-colors">
                  {char.letter}
                </p>
                <div className="cipher text-3xl my-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-600">
                  {char.letter}
                </div>
                <p className="text-[10px] text-gray-300 group-hover:text-blue-400 transition-colors">
                  MORVA
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 6 — FROM DRAWING TO FONT ===== */}
      <section 
        data-section="font" 
        id="font"
        className={`py-24 bg-gray-50 transition-all duration-700 ${visibleSections.font ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <h2 className="text-4xl font-bold tracking-tight text-center mb-16">From sketches to a real typeface.</h2>

          <div className="relative">
            {/* Timeline */}
            <div className="flex items-center justify-between mb-12">
              {timelineSteps.map((step, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => setActiveTimeline(index)}
                >
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 ${
                    activeTimeline >= index 
                      ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                      : 'bg-gray-200 text-gray-400 group-hover:bg-gray-300'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    activeTimeline >= index ? 'text-blue-600' : 'text-gray-400'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Timeline progress bar */}
            <div className="relative h-1 bg-gray-200 rounded-full mb-8">
              <div 
                className="h-full bg-blue-500 rounded-full transition-all duration-1000"
                style={{ width: `${(activeTimeline / (timelineSteps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Before/After comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-white rounded-3xl border border-gray-200 p-8 text-center">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">Normal</p>
                <p className="text-2xl font-medium">Hello, this is MORVA.</p>
              </div>
              <div className="bg-black rounded-3xl p-8 text-center">
                <p className="text-sm font-medium text-gray-400 uppercase tracking-wider mb-4">MORVA</p>
                <p className="text-2xl font-mono tracking-wider text-white cipher">Hello, this is MORVA.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 7 — THE FIRST WORKING VERSION ===== */}
      <section 
        data-section="first" 
        id="first"
        className={`py-24 transition-all duration-700 ${visibleSections.first ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <h2 className="text-4xl font-bold tracking-tight text-center mb-6">When MORVA became real.</h2>
          <p className="text-gray-500 text-center mb-16 max-w-2xl mx-auto">
            The first working version of the MORVA website and converter.
          </p>

          <div className="bg-black rounded-3xl p-4 shadow-2xl">
            <div className="bg-white rounded-2xl overflow-hidden">
              <div className="bg-gray-100 px-4 py-3 flex items-center gap-2 border-b border-gray-200">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-400"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-400"></div>
                  <div className="w-3 h-3 rounded-full bg-green-400"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-white rounded-lg px-4 py-1 text-sm text-gray-400 text-center">morva.dev</div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="text-2xl font-bold">MORVA Translator</h3>
                    <div className="mt-4 space-y-4">
                      <div className="bg-gray-50 rounded-xl p-4 border border-gray-200">
                        <p className="text-sm text-gray-400">Original text</p>
                        <p className="text-lg font-medium">Hello MORVA</p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-blue-500 mx-auto" />
                      <div className="bg-black rounded-xl p-4 border border-gray-800">
                        <p className="text-sm text-gray-400">MORVA translation</p>
                        <p className="text-lg font-mono text-white cipher">Hello MORVA</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-2xl p-6 border border-gray-200">
                    <p className="text-sm font-medium text-gray-400 uppercase tracking-wider">Timeline</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="font-medium">Idea</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        <span className="font-medium">First prototype</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-300"></span>
                        <span className="font-medium">Working font</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-blue-500"></span>
                        <span className="font-medium text-blue-600">MORVA website</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 8 — TODAY ===== */}
      <section 
        data-section="today" 
        id="today"
        className={`py-24 bg-gray-50 transition-all duration-700 ${visibleSections.today ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight">From an experiment to a platform.</h2>
            <p className="text-gray-500 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              What started as an experiment with Morse code eventually became a complete digital experience.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { icon: <BookOpen className="w-6 h-6" />, label: 'Text conversion' },
              { icon: <Type className="w-6 h-6" />, label: 'Personal dictionary' },
              { icon: <Target className="w-6 h-6" />, label: 'Learning' },
              { icon: <BarChart3 className="w-6 h-6" />, label: 'Practice' },
              { icon: <Award className="w-6 h-6" />, label: 'Quizzes' },
              { icon: <Flame className="w-6 h-6" />, label: 'Progress tracking' },
              { icon: <Clock className="w-6 h-6" />, label: 'Streak tracking' },
              { icon: <Sparkles className="w-6 h-6" />, label: 'Leaderboard' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-2xl p-4 text-center border border-gray-200 hover:shadow-md transition-all hover:-translate-y-0.5">
                <div className="text-blue-500 mx-auto mb-2">{feature.icon}</div>
                <p className="text-xs font-medium text-gray-600">{feature.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== SECTION 9 — THE PHILOSOPHY ===== */}
      <section 
        data-section="philosophy" 
        id="philosophy"
        className={`py-32 transition-all duration-700 ${visibleSections.philosophy ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight leading-[1.1]">
            Make something familiar
            <br />
            feel <span className="text-blue-500">completely new.</span>
          </h2>
          <p className="text-xl text-gray-500 mt-8 max-w-2xl mx-auto leading-relaxed">
            MORVA isn't about replacing existing languages. It's an experiment in how we can interact with written language differently.
          </p>
        </div>
      </section>

      {/* ===== SECTION 10 — WHAT'S NEXT ===== */}
      <section 
        data-section="next" 
        id="next"
        className={`py-24 bg-[#0a0a0a] transition-all duration-700 ${visibleSections.next ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold tracking-tight text-white">MORVA isn't finished.</h2>
            <p className="text-gray-400 text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              The writing system can continue to evolve. New characters, better tools, new ways to practice, 
              and new ways to interact with MORVA are still ahead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comingFeatures.map((feature, i) => (
              <div key={i} className="bg-[#141414] rounded-3xl border border-gray-800 p-8 hover:border-gray-600 transition-all hover:-translate-y-1">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-blue-500" />
                  <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">Coming soon</span>
                </div>
                <h3 className="text-xl font-bold text-white">{feature.title}</h3>
                <p className="text-gray-400 mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL ===== */}
      <section className="py-32 bg-white">
        <div className="container max-w-[1280px] mx-auto px-6 text-center">
          <p className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1]">
            It started with
            <br />
            dots and dashes.
          </p>
          <p className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-[1.1] mt-8">
            Now it's <span className="text-blue-500">MORVA.</span>
          </p>
          <div className="mt-12">
          </div>
        </div>
      </section>

      {/* ===== LIGHTBOX ===== */}
      {lightboxOpen && selectedImage && (
        <div 
          className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
          onClick={() => setLightboxOpen(false)}
        >
          <div className="relative max-w-4xl w-full bg-white rounded-3xl p-8">
            <button 
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-gray-100 transition"
              onClick={() => setLightboxOpen(false)}
            >
              <X className="w-6 h-6" />
            </button>
            <div className="aspect-video bg-gray-100 rounded-2xl flex items-center justify-center">
              <div className="text-center">
                <p className="text-6xl mb-4">✧</p>
                <p className="text-xl font-semibold">{selectedImage.title}</p>
                <p className="text-gray-500">{selectedImage.caption}</p>
                <p className="text-sm text-gray-400 mt-4">[ Placeholder for full image ]</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default About;