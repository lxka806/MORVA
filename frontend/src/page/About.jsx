import React, { useState, useEffect } from 'react';
import { 
  ArrowRight, 
  ChevronDown, 
  PenTool,
  Type,
  Layout,
  Sparkles,
  Clock,
  BookOpen,
  Target,
  Award,
  BarChart3,
  Flame
} from 'lucide-react';


const About = () => {
  const [hoveredChar, setHoveredChar] = useState(null);
  const [showScrollIndicator, setShowScrollIndicator] = useState(true);
  const [activeTimeline, setActiveTimeline] = useState(0);

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

    document.querySelectorAll('[data-section]').forEach(el => {
      observer.observe(el);
    });

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

  const morvaAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').map((letter, i) => ({
    letter,
    glyph: String.fromCharCode(0x1F300 + i + 1),
  }));

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

  return (
    <main className="font-sans antialiased bg-[#111111] text-[#F5F2EB]">

      {/* ===== HERO ===== */}
      <section className="relative min-h-screen flex items-center overflow-hidden bg-gradient-to-b from-[#1A1A1A] to-[#111111]">
        <div className="container max-w-[1280px] mx-auto px-6 py-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-[#33302B] bg-[#1A1A1A] text-xs font-semibold tracking-widest text-[#A7A29A] uppercase mb-6">
                <span className="w-1.5 h-1.5 rounded-full bg-[#D6A85F]"></span>
                THE STORY BEHIND MORVA
              </div>

              <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl font-semibold tracking-tight leading-[1.1] text-[#F5F2EB]">
                It started with
                <br />
                <span className="text-[#D6A85F]">Morse code.</span>
                <br />
                Then I created
                <br />
                <span className="text-[#D6A85F]">MORVA.</span>
              </h1>

              <p className="text-lg text-[#A7A29A] mt-6 max-w-lg leading-relaxed">
                MORVA began as an experiment: taking inspiration from Morse code and reimagining 
                the idea as a visual writing system that could be easier to recognize, learn, and use.
              </p>
            </div>

            {/* Morse to MORVA transformation */}
            <div className="relative">
              <div className="bg-[#202020] rounded-2xl border border-[#33302B] p-8">
                <div className="grid grid-cols-3 gap-4">
                  {['A', 'B', 'C', 'D', 'E', 'F'].map((letter, i) => (
                    <div key={letter} className="text-center p-4 bg-[#1A1A1A] rounded-2xl border border-[#33302B]">
                      <p className="text-2xl font-bold text-[#F5F2EB]">{letter}</p>
                      <p className="text-sm text-[#A7A29A] mt-1 font-mono">
                        {['.-', '-...', '-.-.', '-..', '.', '..-.'][i]}
                      </p>
                      <div className="w-px h-8 bg-[#33302B] mx-auto my-2"></div>
                      <div className="text-3xl text-[#D6A85F] cipher">
                        {['A', 'B', 'C', 'D', 'E', 'F'][i]}
                      </div>
                      <p className="text-xs text-[#D6A85F] mt-1 font-medium">MORVA</p>
                    </div>
                  ))}
                </div>
                <div className="text-center mt-6 pt-6 border-t border-[#33302B]">
                  <ArrowRight className="w-6 h-6 text-[#D6A85F] mx-auto" />
                  <p className="text-sm text-[#A7A29A] mt-2">Morse Code → MORVA Glyphs</p>
                </div>
              </div>
            </div>
          </div>

          {showScrollIndicator && (
            <div className="absolute bottom-12 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 animate-bounce">
              <span className="text-xs text-[#A7A29A] font-medium tracking-widest uppercase">Scroll to explore</span>
              <ChevronDown className="w-5 h-5 text-[#A7A29A]" />
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
              <div className="font-serif text-8xl font-semibold text-[#D6A85F]/15 mb-6">01</div>
              <h2 className="font-serif text-4xl font-semibold tracking-tight mb-6 text-[#F5F2EB]">Why Morse code?</h2>
              <p className="text-[#A7A29A] text-lg leading-relaxed mb-4">
                I was fascinated by how Morse code can represent an entire alphabet using a very simple system of dots and dashes.
              </p>
              <p className="text-[#A7A29A] text-lg leading-relaxed">
                I wanted to take that idea and experiment with something different — a system that felt more visual and easier to recognize.
              </p>
            </div>
            <div className="bg-[#1A1A1A] rounded-2xl p-8 border border-[#33302B]">
              <img
                src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR5btPVdbnsIUBONjqBX8iH3q5J_HKPLolvvbTPGMOb8ueF0LvLi7y3GoU&s=10"
                alt="Morse code reference"
                className="rounded-lg"
              />
            </div>
          </div>
        </div>
      </section>

      {/* ===== SECTION 2 — THE QUESTION ===== */}
      <section 
        data-section="question" 
        id="question"
        className={`py-32 bg-[#1A1A1A] border-y border-[#33302B] transition-all duration-700 ${visibleSections.question ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6 text-center">
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.1] text-[#F5F2EB]">
            What if it could be easier?
          </h2>
          <p className="text-xl text-[#A7A29A] mt-8 max-w-2xl mx-auto">
            That question became the beginning of MORVA.
          </p>
        </div>
      </section>

      {/* ===== SECTION 4 — CREATING THE CHARACTERS ===== */}
      <section 
        data-section="characters" 
        id="characters"
        className={`py-24 bg-[#1A1A1A] transition-all duration-700 ${visibleSections.characters ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <div className="max-w-2xl mb-16">
            <h2 className="font-serif text-4xl font-semibold tracking-tight text-[#F5F2EB]">Designing a new alphabet.</h2>
            <p className="text-[#A7A29A] text-lg mt-4 leading-relaxed">
              Each character needed to feel unique, but the whole system still needed to feel connected.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {characterEvolution.map((char) => (
              <div 
                key={char.letter}
                className="bg-[#202020] rounded-2xl border border-[#33302B] p-8 text-center hover:border-[#D6A85F]/50 transition-all duration-300"
                onMouseEnter={() => setHoveredChar(char.letter)}
                onMouseLeave={() => setHoveredChar(null)}
              >
                <div className="font-serif text-7xl font-semibold text-[#D6A85F]/15 mb-4">{char.letter}</div>
                <div className="flex items-center justify-center gap-3">
                  {char.stages.map((stage, i) => (
                    <React.Fragment key={stage}>
                      <div className="text-center">
                        <div className={`w-16 h-16 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 ${
                          hoveredChar === char.letter && i === 3 
                            ? 'bg-[#D6A85F] text-[#111111] scale-110 shadow-[0_0_24px_rgba(214,168,95,0.35)]'
                            : 'bg-[#1A1A1A] border border-[#33302B] text-[#A7A29A]'
                        }`}>
                          {hoveredChar === char.letter && i === 3 ? '✦' : ['✎', '◇', '◈', '✦'][i]}
                        </div>
                        <p className="text-xs text-[#A7A29A] mt-2">{stage}</p>
                      </div>
                      {i < char.stages.length - 1 && (
                        <ArrowRight className="w-4 h-4 text-[#33302B] flex-shrink-0" />
                      )}
                    </React.Fragment>
                  ))}
                </div>
                {hoveredChar === char.letter && (
                  <p className="text-sm text-[#D6A85F] mt-4 font-medium">
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
            <h2 className="font-serif text-4xl font-semibold tracking-tight text-[#F5F2EB]">26 characters. One system.</h2>
            <p className="text-[#A7A29A] mt-2">The MORVA alphabet</p>
          </div>

          <div className="grid grid-cols-4 sm:grid-cols-7 md:grid-cols-9 lg:grid-cols-13 gap-3">
            {morvaAlphabet.map((char) => (
              <div 
                key={char.letter}
                className="group bg-[#1A1A1A] rounded-xl p-4 text-center border border-[#33302B] hover:border-[#D6A85F]/60 hover:bg-[#D6A85F]/5 transition-all duration-300 cursor-default"
              >
                <p className="text-sm font-medium text-[#A7A29A] group-hover:text-[#D6A85F] transition-colors">
                  {char.letter}
                </p>
                <div className="cipher text-3xl my-2 text-[#F5F2EB] transition-transform duration-300 group-hover:scale-110 group-hover:text-[#D6A85F]">
                  {char.letter}
                </div>
                <p className="text-[10px] text-[#33302B] group-hover:text-[#D6A85F]/70 transition-colors">
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
        className={`py-24 bg-[#1A1A1A] transition-all duration-700 ${visibleSections.font ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <h2 className="font-serif text-4xl font-semibold tracking-tight text-center mb-16 text-[#F5F2EB]">
            From sketches to a real typeface.
          </h2>

          <div className="relative">
            {/* Timeline */}
            <div className="flex items-center justify-between mb-12">
              {timelineSteps.map((step, index) => (
                <div 
                  key={index}
                  className="flex flex-col items-center gap-2 cursor-pointer group"
                  onClick={() => setActiveTimeline(index)}
                >
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center transition-all duration-300 ${
                    activeTimeline >= index 
                      ? 'bg-[#D6A85F] text-[#111111] shadow-[0_0_24px_rgba(214,168,95,0.3)]'
                      : 'bg-[#202020] border border-[#33302B] text-[#A7A29A] group-hover:border-[#D6A85F]/40'
                  }`}>
                    {step.icon}
                  </div>
                  <span className={`text-xs font-medium transition-colors ${
                    activeTimeline >= index ? 'text-[#D6A85F]' : 'text-[#A7A29A]'
                  }`}>
                    {step.label}
                  </span>
                </div>
              ))}
            </div>

            {/* Timeline progress bar */}
            <div className="relative h-1 bg-[#202020] rounded-full mb-8 overflow-hidden">
              <div 
                className="h-full bg-[#D6A85F] rounded-full transition-all duration-1000"
                style={{ width: `${(activeTimeline / (timelineSteps.length - 1)) * 100}%` }}
              />
            </div>

            {/* Before/After comparison */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
              <div className="bg-[#202020] rounded-2xl border border-[#33302B] p-8 text-center">
                <p className="text-sm font-medium text-[#A7A29A] uppercase tracking-wider mb-4">Normal</p>
                <p className="text-2xl font-medium text-[#F5F2EB]">Hello, this is MORVA.</p>
              </div>
              <div className="bg-[#202020] rounded-2xl border border-[#D6A85F]/30 p-8 text-center">
                <p className="text-sm font-medium text-[#D6A85F] uppercase tracking-wider mb-4">MORVA</p>
                <p className="text-2xl font-mono tracking-wider text-[#F5F2EB] cipher">Hello, this is MORVA.</p>
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
          <h2 className="font-serif text-4xl font-semibold tracking-tight text-center mb-6 text-[#F5F2EB]">When MORVA became real.</h2>
          <p className="text-[#A7A29A] text-center mb-16 max-w-2xl mx-auto">
            The first working version of the MORVA website and converter.
          </p>

          <div className="bg-[#0a0a0a] rounded-2xl p-4 border border-[#33302B]">
            <div className="bg-[#1A1A1A] rounded-xl overflow-hidden border border-[#33302B]">
              <div className="bg-[#202020] px-4 py-3 flex items-center gap-2 border-b border-[#33302B]">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-[#D47777]/60"></div>
                  <div className="w-3 h-3 rounded-full bg-[#D6A85F]/60"></div>
                  <div className="w-3 h-3 rounded-full bg-[#7DAD8A]/60"></div>
                </div>
                <div className="flex-1 mx-4">
                  <div className="bg-[#111111] rounded-lg px-4 py-1 text-sm text-[#A7A29A] text-center border border-[#33302B]">
                    morva.dev
                  </div>
                </div>
              </div>
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div>
                    <h3 className="font-serif text-2xl font-semibold text-[#F5F2EB]">MORVA Translator</h3>
                    <div className="mt-4 space-y-4">
                      <div className="bg-[#202020] rounded-xl p-4 border border-[#33302B]">
                        <p className="text-sm text-[#A7A29A]">Original text</p>
                        <p className="text-lg font-medium text-[#F5F2EB]">Hello MORVA</p>
                      </div>
                      <ArrowRight className="w-6 h-6 text-[#D6A85F] mx-auto" />
                      <div className="bg-[#111111] rounded-xl p-4 border border-[#33302B]">
                        <p className="text-sm text-[#A7A29A]">MORVA translation</p>
                        <p className="text-lg font-mono text-[#D6A85F] cipher">Hello MORVA</p>
                      </div>
                    </div>
                  </div>
                  <div className="bg-[#202020] rounded-xl p-6 border border-[#33302B]">
                    <p className="text-sm font-medium text-[#A7A29A] uppercase tracking-wider">Timeline</p>
                    <div className="mt-4 space-y-3">
                      <div className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-[#D6A85F]"></span>
                        <span className="font-medium text-[#F5F2EB]">Idea</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-[#D6A85F]/70"></span>
                        <span className="font-medium text-[#F5F2EB]">First prototype</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-[#D6A85F]/50"></span>
                        <span className="font-medium text-[#F5F2EB]">Working font</span>
                      </div>
                      <div className="flex items-center gap-3 text-sm">
                        <span className="w-2 h-2 rounded-full bg-[#D6A85F]"></span>
                        <span className="font-medium text-[#D6A85F]">MORVA website</span>
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
        className={`py-24 bg-[#1A1A1A] transition-all duration-700 ${visibleSections.today ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-semibold tracking-tight text-[#F5F2EB]">From an experiment to a platform.</h2>
            <p className="text-[#A7A29A] text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
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
              <div key={i} className="bg-[#202020] rounded-xl p-4 text-center border border-[#33302B] hover:border-[#D6A85F]/50 transition-all">
                <div className="text-[#D6A85F] mx-auto mb-2 flex justify-center">{feature.icon}</div>
                <p className="text-xs font-medium text-[#A7A29A]">{feature.label}</p>
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
          <h2 className="font-serif text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight leading-[1.1] text-[#F5F2EB]">
            Make something familiar
            <br />
            feel <span className="text-[#D6A85F]">completely new.</span>
          </h2>
          <p className="text-xl text-[#A7A29A] mt-8 max-w-2xl mx-auto leading-relaxed">
            MORVA isn't about replacing existing languages. It's an experiment in how we can interact with written language differently.
          </p>
        </div>
      </section>

      {/* ===== SECTION 10 — WHAT'S NEXT ===== */}
      <section 
        data-section="next" 
        id="next"
        className={`py-24 bg-[#0a0a0a] border-t border-[#33302B] transition-all duration-700 ${visibleSections.next ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}
      >
        <div className="container max-w-[1280px] mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="font-serif text-4xl font-semibold tracking-tight text-[#F5F2EB]">MORVA isn't finished.</h2>
            <p className="text-[#A7A29A] text-lg mt-4 max-w-2xl mx-auto leading-relaxed">
              The writing system can continue to evolve. New characters, better tools, new ways to practice, 
              and new ways to interact with MORVA are still ahead.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {comingFeatures.map((feature, i) => (
              <div key={i} className="bg-[#141414] rounded-2xl border border-[#33302B] p-8 hover:border-[#D6A85F]/50 transition-all">
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="w-5 h-5 text-[#D6A85F]" />
                  <span className="text-xs font-medium text-[#D6A85F] uppercase tracking-wider">Coming soon</span>
                </div>
                <h3 className="font-serif text-xl font-semibold text-[#F5F2EB]">{feature.title}</h3>
                <p className="text-[#A7A29A] mt-2">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== FINAL ===== */}
      <section className="py-32 bg-[#111111]">
        <div className="container max-w-[1280px] mx-auto px-6 text-center">
          <p className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] text-[#F5F2EB]">
            It started with
            <br />
            dots and dashes.
          </p>
          <p className="font-serif text-4xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.1] mt-8 text-[#F5F2EB]">
            Now it's <span className="text-[#D6A85F]">MORVA.</span>
          </p>
          <div className="mt-12"></div>
        </div>
      </section>

    </main>
  );
};

export default About;