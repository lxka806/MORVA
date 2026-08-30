import { useEffect, useState } from "react";

const URL = import.meta.env.VITE_API_URL;

function Words() {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(null);
    const [editing, setEditing] = useState(null);
    const [editWord, setEditWord] = useState("");
    const [editDifficulty, setEditDifficulty] = useState("medium");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const getWords = async () => {
            try {
                const response = await fetch(`${URL}/api/words`, {
                    credentials: "include"
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message);
                    return;
                }

                setWords(data);

            } catch (e) {
                console.log(e);
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        getWords();
    }, []);

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this word?")) return;

        setDeleting(id);

        try {
            const response = await fetch(`${URL}/api/words/${id}`, {
                method: "DELETE",
                credentials: "include"
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to delete word");
                setDeleting(null);
                return;
            }

            setWords(words.filter(word => word._id !== id));
            setDeleting(null);

        } catch (e) {
            console.log(e);
            alert("Something went wrong");
            setDeleting(null);
        }
    };

    const handleEdit = (word) => {
        setEditing(word._id);
        setEditWord(word.word);
        setEditDifficulty(word.difficulty || "medium");
    };

    const handleSaveEdit = async (id) => {
        if (!editWord.trim()) return;

        try {
            const response = await fetch(`${URL}/api/words/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    word: editWord.trim(),
                    difficulty: editDifficulty
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to update word");
                return;
            }

            setWords(words.map(word => 
                word._id === id ? { ...word, word: editWord.trim(), difficulty: editDifficulty } : word
            ));
            setEditing(null);
            setEditWord("");
            setEditDifficulty("medium");

        } catch (e) {
            console.log(e);
            alert("Something went wrong");
        }
    };

    const handleCancelEdit = () => {
        setEditing(null);
        setEditWord("");
        setEditDifficulty("medium");
    };

    const toggleLearned = async (id, currentStatus) => {
        try {
            const response = await fetch(`${URL}/api/words/${id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({
                    learned: !currentStatus
                })
            });

            const data = await response.json();

            if (!response.ok) {
                alert(data.message || "Failed to update word");
                return;
            }

            setWords(words.map(word => 
                word._id === id ? { ...word, learned: !currentStatus } : word
            ));

        } catch (e) {
            console.log(e);
            alert("Something went wrong");
        }
    };

    const filteredWords = filter === "all" 
        ? words 
        : filter === "learned" 
            ? words.filter(w => w.learned)
            : words.filter(w => !w.learned);

    const getDifficultyColor = (difficulty) => {
        switch(difficulty) {
            case "easy": return "text-green-600 bg-green-50 border-green-200";
            case "medium": return "text-yellow-600 bg-yellow-50 border-yellow-200";
            case "hard": return "text-red-600 bg-red-50 border-red-200";
            default: return "text-gray-600 bg-gray-50 border-gray-200";
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-white text-black">
                <div className="mx-auto max-w-6xl px-6 pt-20 pb-24">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                            <p className="text-gray-500">Loading your dictionary...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black">

            {/* Header */}
            <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
                <div className="max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold tracking-widest text-gray-500">
                        MORVA DICTIONARY
                    </span>

                    <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
                        My
                        <span className="text-blue-600"> Dictionary</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
                        Manage your MORVA vocabulary. Track your progress and master the language.
                    </p>
                </div>
            </section>

            {/* Dictionary Content */}
            <section className="mx-auto max-w-6xl px-6 pb-24">

                {error ? (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600">
                        {error}
                    </div>
                ) : words.length === 0 ? (
                    <div className="rounded-3xl border border-gray-200 bg-gray-50 p-16 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-white text-3xl">
                            📚
                        </div>
                        <h2 className="text-2xl font-semibold text-gray-700">Your dictionary is empty</h2>
                        <p className="mt-2 text-gray-500">
                            You haven't added any words yet. Start building your MORVA vocabulary today!
                        </p>
                        <a 
                            href="/translate" 
                            className="mt-6 inline-block rounded-2xl bg-black px-8 py-3 font-semibold text-white transition hover:bg-blue-600 hover:shadow-xl hover:shadow-blue-600/20"
                        >
                            Go to Translator →
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Stats and Filter */}
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-gray-500">
                                    {words.length} total words
                                </span>
                                <span className="text-sm text-green-600">
                                    {words.filter(w => w.learned).length} learned
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-sm text-gray-500">Filter:</label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                >
                                    <option value="all">All</option>
                                    <option value="learned">Learned</option>
                                    <option value="unlearned">Not Learned</option>
                                </select>
                            </div>
                        </div>

                        {/* Words Grid */}
                        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                            {filteredWords.map((word) => (
                                <div
                                    key={word._id}
                                    className="group rounded-3xl border border-gray-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:-translate-y-1"
                                >
                                    {editing === word._id ? (
                                        // Edit Mode
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                                    Word
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editWord}
                                                    onChange={(e) => setEditWord(e.target.value)}
                                                    className="mt-1 w-full rounded-xl border border-gray-200 px-4 py-2 text-lg font-semibold outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                                    placeholder="Enter word..."
                                                    autoFocus
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold uppercase tracking-widest text-gray-400">
                                                    Difficulty
                                                </label>
                                                <select
                                                    value={editDifficulty}
                                                    onChange={(e) => setEditDifficulty(e.target.value)}
                                                    className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10"
                                                >
                                                    <option value="easy">Easy</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="hard">Hard</option>
                                                </select>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={() => handleSaveEdit(word._id)}
                                                    className="flex-1 rounded-xl bg-blue-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/20"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="flex-1 rounded-xl border border-gray-200 px-4 py-2 text-sm font-medium text-gray-600 transition hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <>
                                            <div className="mb-3 flex items-start justify-between">
                                                <h2 className="text-xl font-bold text-gray-900">
                                                    {word.word}
                                                </h2>
                                                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                                                    {word.difficulty || "medium"}
                                                </span>
                                            </div>

                                            <div className="mb-4 rounded-xl border border-gray-100 bg-gray-50 p-4">
                                                <p className="text-xs font-semibold uppercase tracking-widest text-gray-400 mb-2">
                                                    MORVA Translation
                                                </p>
                                                <p className="cipher text-lg leading-8 tracking-widest text-gray-700">
                                                    {word.word}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
                                                <button
                                                    onClick={() => toggleLearned(word._id, word.learned)}
                                                    className={`text-sm font-medium transition ${
                                                        word.learned 
                                                            ? "text-green-600 hover:text-green-700" 
                                                            : "text-gray-400 hover:text-gray-600"
                                                    }`}
                                                >
                                                    {word.learned ? "✓ Learned" : "○ Not learned"}
                                                </button>

                                                <div className="flex gap-2">
                                                    <button
                                                        onClick={() => handleEdit(word)}
                                                        className="rounded-lg px-3 py-1 text-sm text-gray-500 transition hover:bg-gray-100 hover:text-gray-700"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(word._id)}
                                                        disabled={deleting === word._id}
                                                        className="rounded-lg px-3 py-1 text-sm text-red-500 transition hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {deleting === word._id ? "..." : "Delete"}
                                                    </button>
                                                </div>
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </section>

            {/* Back to Translator */}
            <section className="border-t border-gray-100 bg-gray-50">
                <div className="mx-auto max-w-6xl px-6 py-12 text-center">
                    <a
                        href="/translate"
                        className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 transition hover:text-blue-600"
                    >
                        ← Back to Translator
                    </a>
                </div>
            </section>

        </main>
    );
}

export default Words;