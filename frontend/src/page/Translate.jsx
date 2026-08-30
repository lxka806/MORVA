import { useState } from "react";

const URL = import.meta.env.VITE_API_URL;

function Translate() {
    const [text, setText] = useState("");
    const [translatedText, setTranslatedText] = useState("");
    const [difficulty, setDifficulty] = useState("medium");
    const [saved, setSaved] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!text.trim()) return;

        // Temporary translation
        // Replace this later with your actual MORVA translation logic
        setTranslatedText(text);
    };

    const handleClear = () => {
        setText("");
        setTranslatedText("");
        setSaved(false);
        setError("");
    };

    const handleAddWord = async () => {
        if (!text.trim()) return;

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
                    word: text,
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
        <main className="min-h-screen bg-white text-black">

            {/* Header */}
            <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">

                <div className="max-w-3xl">

                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold tracking-widest text-gray-500">
                        MORVA TRANSLATOR
                    </span>

                    <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
                        Translate into
                        <span className="text-blue-600"> MORVA.</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
                        Convert your text into the MORVA language and discover
                        a completely new way to communicate.
                    </p>

                </div>

            </section>


            {/* Translator */}
            <section className="mx-auto max-w-6xl px-6 pb-24">

                <form onSubmit={handleSubmit}>

                    <div className="grid gap-5 md:grid-cols-2">

                        {/* Input */}
                        <div className="rounded-3xl border border-gray-200 bg-gray-50 p-6 shadow-sm transition hover:shadow-md">

                            <div className="mb-5 flex items-center justify-between">

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                        Original text
                                    </p>

                                    <h2 className="mt-1 text-lg font-semibold">
                                        Enter your text
                                    </h2>
                                </div>

                                <span className="rounded-full bg-white px-3 py-1 text-xs text-gray-500">
                                    Input
                                </span>

                            </div>

                            <textarea
                                rows="10"
                                placeholder="Write something here..."
                                value={text}
                                onChange={(e) => {
                                    setText(e.target.value);
                                    setSaved(false);
                                    setError("");
                                }}
                                className="w-full resize-none rounded-2xl border border-gray-200 bg-white p-5 text-base outline-none transition placeholder:text-gray-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                            />

                            <div className="mt-4 flex items-center justify-between">

                                <span className="text-sm text-gray-400">
                                    {text.length} characters
                                </span>

                                <button
                                    type="button"
                                    onClick={handleClear}
                                    className="text-sm font-medium text-gray-500 transition hover:text-black"
                                >
                                    Clear
                                </button>

                            </div>

                            {/* Add to Dictionary section */}
                            <div className="mt-4 pt-4 border-t border-gray-200">
                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                    Add to Dictionary
                                </p>

                                <div className="mt-3 flex items-center gap-3">
                                    <select
                                        value={difficulty}
                                        onChange={(e) => setDifficulty(e.target.value)}
                                        className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                    >
                                        <option value="easy">Easy</option>
                                        <option value="medium">Medium</option>
                                        <option value="hard">Hard</option>
                                    </select>

                                    <button
                                        type="button"
                                        onClick={handleAddWord}
                                        disabled={!text.trim() || saved}
                                        className="rounded-xl bg-black px-5 py-2 text-sm font-medium text-white transition hover:bg-blue-600 hover:shadow-lg hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-40"
                                    >
                                        {saved ? "✓ Added" : "+ Add Word"}
                                    </button>
                                </div>

                                {error && (
                                    <p className="mt-2 text-sm text-red-500">
                                        {error}
                                    </p>
                                )}
                            </div>

                        </div>


                        {/* Output */}
                        <div className="rounded-3xl border border-gray-200 bg-black p-6 text-white shadow-sm">

                            <div className="mb-5 flex items-center justify-between">

                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-widest text-gray-500">
                                        Translation
                                    </p>

                                    <h2 className="mt-1 text-lg font-semibold">
                                        MORVA
                                    </h2>
                                </div>

                                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-gray-400">
                                    Output
                                </span>

                            </div>

                            <div className="min-h-[250px] rounded-2xl border border-white/10 bg-white/5 p-5">

                                {translatedText ? (
                                    <p className="whitespace-pre-wrap text-lg leading-8 cipher tracking-widest">
                                        {translatedText}
                                    </p>
                                ) : (
                                    <div className="flex h-[210px] items-center justify-center text-center ">

                                        <div>
                                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10 text-xl">
                                                M
                                            </div>

                                            <p className="text-sm text-gray-500 ">
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
                            className="group rounded-2xl bg-black px-8 py-4 font-semibold text-white transition hover:-translate-y-1 hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20 disabled:cursor-not-allowed disabled:opacity-40"
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
            <section className="border-t border-gray-100 bg-gray-50">

                <div className="mx-auto max-w-6xl px-6 py-20">

                    <div className="mb-12">

                        <p className="text-xs font-semibold uppercase tracking-widest text-blue-600">
                            Simple by design
                        </p>

                        <h2 className="mt-3 text-3xl font-bold tracking-tight md:text-4xl">
                            How MORVA works
                        </h2>

                    </div>


                    <div className="grid gap-5 md:grid-cols-3">

                        <div className="rounded-3xl border border-gray-200 bg-white p-7">

                            <span className="text-sm font-bold text-gray-300">
                                01
                            </span>

                            <h3 className="mt-6 text-xl font-semibold">
                                Write
                            </h3>

                            <p className="mt-3 leading-7 text-gray-500">
                                Enter the text you want to translate.
                            </p>

                        </div>


                        <div className="rounded-3xl border border-gray-200 bg-white p-7">

                            <span className="text-sm font-bold text-gray-300">
                                02
                            </span>

                            <h3 className="mt-6 text-xl font-semibold">
                                Translate
                            </h3>

                            <p className="mt-3 leading-7 text-gray-500">
                                MORVA converts your text into its unique language system.
                            </p>

                        </div>


                        <div className="rounded-3xl border border-gray-200 bg-white p-7">

                            <span className="text-sm font-bold text-gray-300">
                                03
                            </span>

                            <h3 className="mt-6 text-xl font-semibold">
                                Learn
                            </h3>

                            <p className="mt-3 leading-7 text-gray-500">
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