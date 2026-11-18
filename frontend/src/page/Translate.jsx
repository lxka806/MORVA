import { useState } from "react";
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const URL = import.meta.env.VITE_API_URL;

function Translate() {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const {
        transcript,
        listening,
        resetTranscript,
        browserSupportsSpeechRecognition
    } = useSpeechRecognition();

    const currentText = transcript || text;

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!currentText.trim()) return;

        setTranslatedText(currentText);
    };

    const handleClear = () => {
        setText("");
        setTranslatedText("");
        setSaved(false);
        setError("");
        resetTranscript();
    };

    const handleStartListening = () => {
        resetTranscript();
        SpeechRecognition.startListening({ continuous: true });
    };

    const handleStopListening = () => {
        SpeechRecognition.stopListening();
    };

    const handleResetTranscript = () => {
        resetTranscript();
        setText("");
    };

    const handleAddWord = async () => {
        if (!currentText.trim()) return;

        setError("");
        setSaved(false);

        try {
            const response = await fetch(`${URL}/api/words`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    word: currentText,
                    difficulty
                })
            });

            const data = await response.json();

            if (!response.ok) {
                setError(data.message);
                return;
            }

            setSaved(true);

        } catch (e) {
            console.log(e);
            setError("Something went wrong");
        }
    };

    return (
        <main className="min-h-screen bg-[#111111] text-[#F5F2EB] font-sans">

            {/* Header */}
            <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
                <div className="max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-[#33302B] bg-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-widest text-[#A7A29A]">
                        MORVA TRANSLATOR
                    </span>

                    <h1 className="mt-6 font-serif text-5xl font-semibold tracking-tight text-[#F5F2EB] md:text-7xl">
                        Translate into
                        <span className="text-[#D6A85F]"> MORVA.</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[#A7A29A]">
                        Convert your text into the MORVA language and discover
                        a completely new way to communicate.
                    </p>
                </div>
            </section>

            {/* Voice input */}
            <section className="mx-auto max-w-6xl px-6 pb-12">
                <div className={`rounded-2xl border bg-[#1A1A1A] p-6 transition ${
                    listening
                        ? "border-[#D6A85F]/60 shadow-[0_0_0_4px_rgba(214,168,95,0.08)]"
                        : "border-[#33302B] hover:border-[#D6A85F]/40"
                }`}>

                    <div className="flex flex-wrap items-center justify-between gap-4">

                        <div className="flex items-center gap-4">
                            <div className={`flex h-12 w-12 items-center justify-center rounded-xl border text-xl ${
                                listening
                                    ? "border-[#D6A85F]/60 bg-[#D6A85F]/10 text-[#D6A85F]"
                                    : "border-[#33302B] bg-[#202020] text-[#A7A29A]"
                            }`}>
                                🎤
                            </div>

                            <div>
                                <p className="text-xs font-semibold uppercase tracking-widest text-[#A7A29A]">
                                    Voice input
                                </p>

                                <h2 className="mt-1 text-lg font-semibold text-[#F5F2EB]">
                                    Speak your text
                                </h2>

                                <div className="mt-1 flex items-center gap-2 text-sm text-[#A7A29A]">
                                    <span
                                        className={`inline-block h-2 w-2 rounded-full transition ${
                                            listening
                                                ? "animate-pulse bg-[#D6A85F] shadow-[0_0_8px_rgba(214,168,95,0.6)]"
                                                : "bg-[#33302B]"
                                        }`}
                                    />
                                    <span>
                                        Microphone: {listening ? "on" : "off"}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {browserSupportsSpeechRecognition && (
                            <div className="flex flex-wrap items-center gap-3">

                                <button
                                    type="button"
                                    onClick={handleStartListening}
                                    disabled={listening}
                                    className="rounded-xl bg-[#D6A85F] px-5 py-2 text-sm font-semibold text-[#111111] transition hover:bg-[#B88B47] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Start
                                </button>

                                <button
                                    type="button"
                                    onClick={handleStopListening}
                                    disabled={!listening}
                                    className="rounded-xl border border-[#33302B] bg-[#202020] px-5 py-2 text-sm font-medium text-[#F5F2EB] transition hover:border-[#D6A85F]/60 hover:text-[#D6A85F] disabled:cursor-not-allowed disabled:opacity-40"
                                >
                                    Stop
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResetTranscript}
                                    className="rounded-xl border border-[#33302B] bg-transparent px-5 py-2 text-sm font-medium text-[#A7A29A] transition hover:border-[#D6A85F]/60 hover:text-[#F5F2EB]"
                                >
                                    Reset
                                </button>

                            </div>
                        )}

                    </div>

                    {browserSupportsSpeechRecognition ? (
                        transcript && (
                            <div className="mt-4 rounded-xl border border-[#D6A85F]/30 bg-[#D6A85F]/5 p-4 text-sm leading-6 text-[#F5F2EB]">
                                {transcript}
                            </div>
                        )
                    ) : (
                        <p className="mt-4 text-sm text-[#D47777]">
                            Your browser doesn't support speech recognition.
                        </p>
                    )}

                </div>
            </section>

            {/* Translator */}
            <section className="mx-auto max-w-6xl px-6 pb-24">

                <form onSubmit={handleSubmit}>

                    <div className="grid gap-5 md:grid-cols-2">

                        {/* Input */}
                        <div className="rounded-2xl border border-[#33302B] bg-[#1A1A1A] p-6 transition hover:border-[#D6A85F]/40">

                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-[#A7A29A]">
                                        Original text
                                    </p>

                                    <h2 className="mt-1 text-lg font-semibold text-[#F5F2EB]">
                                        Enter your text
                                    </h2>
                                </div>

                                <span className="rounded-full border border-[#33302B] bg-[#202020] px-3 py-1 text-xs text-[#A7A29A]">
                                    Input
                                </span>
                            </div>

                            <textarea
                                rows="10"
                                placeholder="Write something here..."
                                value={currentText}
                                onChange={(e) => {
                                    resetTranscript();
                                    setText(e.target.value);
                                    setSaved(false);
                                    setError("");
                                }}
                                className="w-full resize-none rounded-xl border border-[#33302B] bg-[#111111] p-5 text-base text-[#F5F2EB] outline-none transition placeholder:text-[#A7A29A]/60 focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30"
                            />

                            <div className="mt-4 flex items-center justify-between">
                                <span className="text-sm text-[#A7A29A]">
                                    {currentText.length} characters
                                </span>

                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-sm font-medium text-[#A7A29A] transition hover:text-[#D6A85F]"
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Add to Dictionary section */}
                            <div className="mt-4 border-t border-[#33302B] pt-4">
                                <p className="text-xs font-semibold uppercase tracking-widest text-[#A7A29A]">
                                    Add to Dictionary
                                </p>

                                <div className="mt-3 flex items-center gap-3">
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="rounded-xl border border-[#33302B] bg-[#202020] px-4 py-2 text-sm text-[#F5F2EB] outline-none transition focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={handleAddWord}
                                        disabled={!currentText.trim() || saved}
                                        className="rounded-xl bg-[#D6A85F] px-5 py-2 text-sm font-semibold text-[#111111] transition hover:bg-[#B88B47] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#1A1A1A] disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {saved ? "✓ Added" : "+ Add Word"}
                                    </button>
                                </div>

                                {error && (
                                    <p className="mt-2 text-sm text-[#D47777]">
                                        {error}
                                    </p>
                                )}
                            </div>
                        </div>

                        {/* Output */}
                        <div className="rounded-2xl border border-[#D6A85F]/25 bg-[#202020] p-6">

                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-[#D6A85F]/80">
                                        Translation
                                    </p>

                                    <h2 className="mt-1 text-lg font-semibold text-[#F5F2EB]">
                                        MORVA
                                    </h2>
                                </div>

                                <span className="rounded-full border border-[#D6A85F]/30 bg-[#D6A85F]/10 px-3 py-1 text-xs text-[#D6A85F]">
                                    Output
                                </span>
                            </div>

                            <div className="min-h-[250px] rounded-xl border border-[#33302B] bg-[#111111] p-5">

                                {translatedText ? (
                                    <p className="cipher whitespace-pre-wrap text-lg leading-8 tracking-widest text-[#F5F2EB]">
                                        {translatedText}
                                    </p>
                                ) : (
                                    <div className="flex h-[210px] items-center justify-center text-center">
                                        <div>
                                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-[#D6A85F]/30 bg-[#D6A85F]/10 font-serif text-xl text-[#D6A85F]">
                                                M
                                            </div>

                                            <p className="text-sm text-[#A7A29A]">
                                                Your MORVA translation
                                                will appear here.
                                            </p>
                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>
                    </div>

                    {/* Translate button */}
                    <div className="mt-6 flex justify-center">
                        <button
                            type="submit"
                            disabled={!text.trim()}
                            className="group rounded-xl bg-[#D6A85F] px-8 py-4 font-semibold text-[#111111] transition hover:bg-[#B88B47] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#111111] disabled:cursor-not-allowed disabled:opacity-40"
                        >
                            Translate into MORVA
                            <span className="ml-2 inline-block transition-transform group-hover:translate-x-1">
                                →
                            </span>
                        </button>
                    </div>

                </form>

            </section>

            {/* How it works */}
            <section className="border-t border-[#33302B] bg-[#1A1A1A]">
                <div className="mx-auto max-w-6xl px-6 py-20">

                    <div className="mb-12">
                        <p className="text-xs font-semibold uppercase tracking-widest text-[#D6A85F]">
                            Simple by design
                        </p>

                        <h2 className="mt-3 font-serif text-3xl font-semibold tracking-tight text-[#F5F2EB] md:text-4xl">
                            How MORVA works
                        </h2>
                    </div>

                    <div className="grid gap-5 md:grid-cols-3">

                        <div className="rounded-2xl border border-[#33302B] bg-[#202020] p-7 transition hover:border-[#D6A85F]/40">
                            <span className="font-serif text-sm font-semibold text-[#D6A85F]">
                                01
                            </span>

                            <h3 className="mt-6 text-xl font-semibold text-[#F5F2EB]">
                                Write
                            </h3>

                            <p className="mt-3 leading-7 text-[#A7A29A]">
                                Enter the text you want to translate.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#33302B] bg-[#202020] p-7 transition hover:border-[#D6A85F]/40">
                            <span className="font-serif text-sm font-semibold text-[#D6A85F]">
                                02
                            </span>

                            <h3 className="mt-6 text-xl font-semibold text-[#F5F2EB]">
                                Translate
                            </h3>

                            <p className="mt-3 leading-7 text-[#A7A29A]">
                                MORVA converts your text into its unique language system.
                            </p>
                        </div>

                        <div className="rounded-2xl border border-[#33302B] bg-[#202020] p-7 transition hover:border-[#D6A85F]/40">
                            <span className="font-serif text-sm font-semibold text-[#D6A85F]">
                                03
                            </span>

                            <h3 className="mt-6 text-xl font-semibold text-[#F5F2EB]">
                                Learn
                            </h3>

                            <p className="mt-3 leading-7 text-[#A7A29A]">
                                Practice MORVA and build your vocabulary over time.
                            </p>
                        </div>

                    </div>
                </div>
            </section>

        </main>
    );
}

export default Translate;