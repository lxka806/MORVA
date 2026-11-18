import { useEffect, useState } from "react";

const URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 50;

function Words() {
    const [words, setWords] = useState([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState("");
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(null);
    const [editing, setEditing] = useState(null);
    const [editWord, setEditWord] = useState("");
    const [editDifficulty, setEditDifficulty] = useState("medium");
    const [filter, setFilter] = useState("all");

    useEffect(() => {
        const controller = new AbortController();
        const getWords = async () => {
            try {
                const response = await fetch(`${URL}/api/words?page=1&limit=${PAGE_SIZE}`, {
                    credentials: "include",
                    signal: controller.signal
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Unable to load your dictionary");
                }
                if (!Array.isArray(data)) {
                    throw new Error("Unexpected dictionary response");
                }
                setWords(data);
                setHasMore(response.headers.get("X-Has-More") === "true");

            } catch (e) {
                if (e.name !== "AbortError") {
                    console.error(e);
                    setError(e.message || "Unable to load your dictionary");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        getWords();
        return () => controller.abort();
    }, []);

    const loadMoreWords = async () => {
        setLoadingMore(true);
        setLoadMoreError("");

        try {
            const nextPage = page + 1;
            const response = await fetch(`${URL}/api/words?page=${nextPage}&limit=${PAGE_SIZE}`, {
                credentials: "include"
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load more words");
            }
            if (!Array.isArray(data)) {
                throw new Error("Unexpected dictionary response");
            }

            setWords((currentWords) => [...currentWords, ...data]);
            setPage(nextPage);
            setHasMore(response.headers.get("X-Has-More") === "true");
        } catch (e) {
            console.error(e);
            setLoadMoreError(e.message || "Unable to load more words");
        } finally {
            setLoadingMore(false);
        }
    };

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

            setWords((currentWords) => currentWords.filter((word) => word._id !== id));
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

            setWords((currentWords) => currentWords.map((word) =>
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

            setWords((currentWords) => currentWords.map((word) =>
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
            case "easy":   return "text-[#7DAD8A] bg-[#7DAD8A]/10 border-[#7DAD8A]/30";
            case "medium": return "text-[#D6A85F] bg-[#D6A85F]/10 border-[#D6A85F]/30";
            case "hard":   return "text-[#D47777] bg-[#D47777]/10 border-[#D47777]/30";
            default:       return "text-[#A7A29A] bg-[#202020] border-[#33302B]";
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#111111] text-[#F5F2EB]">
                <div className="mx-auto max-w-6xl px-6 pt-20 pb-24">
                    <div className="flex items-center justify-center min-h-[400px]">
                        <div className="text-center">
                            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#33302B] border-t-[#D6A85F]"></div>
                            <p className="text-[#A7A29A] font-sans">Loading your dictionary...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#111111] text-[#F5F2EB] font-sans">

            {/* Header */}
            <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
                <div className="max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-[#33302B] bg-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-widest text-[#A7A29A]">
                        MORVA DICTIONARY
                    </span>

                    <h1 className="mt-6 font-serif text-5xl font-semibold tracking-tight text-[#F5F2EB] md:text-7xl">
                        My
                        <span className="text-[#D6A85F]"> Dictionary</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[#A7A29A]">
                        Manage your MORVA vocabulary. Track your progress and master the language.
                    </p>
                </div>
            </section>

            {/* Dictionary Content */}
            <section className="mx-auto max-w-6xl px-6 pb-24">

                {error ? (
                    <div className="rounded-2xl border border-[#D47777]/30 bg-[#D47777]/10 p-6 text-[#D47777]">
                        {error}
                    </div>
                ) : words.length === 0 ? (
                    <div className="rounded-2xl border border-[#33302B] bg-[#1A1A1A] p-16 text-center">
                        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-[#202020] text-3xl text-[#D6A85F]">
                            📚
                        </div>
                        <h2 className="font-serif text-2xl font-semibold text-[#F5F2EB]">
                            Your dictionary is empty
                        </h2>
                        <p className="mt-2 text-[#A7A29A]">
                            You haven't added any words yet. Start building your MORVA vocabulary today!
                        </p>
                        <a
                            href="/translate"
                            className="mt-6 inline-block rounded-xl bg-[#D6A85F] px-8 py-3 font-semibold text-[#111111] transition hover:bg-[#B88B47] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#1A1A1A]"
                        >
                            Go to Translator →
                        </a>
                    </div>
                ) : (
                    <>
                        {/* Stats and Filter */}
                        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium text-[#A7A29A]">
                                    {words.length} words loaded
                                </span>
                                <span className="text-sm text-[#7DAD8A]">
                                    {words.filter(w => w.learned).length} learned
                                </span>
                            </div>

                            <div className="flex items-center gap-3">
                                <label className="text-sm text-[#A7A29A]">Filter:</label>
                                <select
                                    value={filter}
                                    onChange={(e) => setFilter(e.target.value)}
                                    className="rounded-xl border border-[#33302B] bg-[#1A1A1A] px-4 py-2 text-sm text-[#F5F2EB] outline-none transition focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30"
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
                                    className="group rounded-2xl border border-[#33302B] bg-[#202020] p-6 transition hover:border-[#D6A85F]/60"
                                >
                                    {editing === word._id ? (
                                        // Edit Mode
                                        <div className="space-y-4">
                                            <div>
                                                <label className="text-xs font-semibold uppercase tracking-widest text-[#A7A29A]">
                                                    Word
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editWord}
                                                    onChange={(e) => setEditWord(e.target.value)}
                                                    className="mt-1 w-full rounded-xl border border-[#33302B] bg-[#1A1A1A] px-4 py-2 text-lg font-semibold text-[#F5F2EB] outline-none transition focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30"
                                                    placeholder="Enter word..."
                                                    autoFocus
                                                />
                                            </div>

                                            <div>
                                                <label className="text-xs font-semibold uppercase tracking-widest text-[#A7A29A]">
                                                    Difficulty
                                                </label>
                                                <select
                                                    value={editDifficulty}
                                                    onChange={(e) => setEditDifficulty(e.target.value)}
                                                    className="mt-1 w-full rounded-xl border border-[#33302B] bg-[#1A1A1A] px-4 py-2 text-sm text-[#F5F2EB] outline-none transition focus:border-[#D6A85F] focus:ring-2 focus:ring-[#D6A85F]/30"
                                                >
                                                    <option value="easy">Easy</option>
                                                    <option value="medium">Medium</option>
                                                    <option value="hard">Hard</option>
                                                </select>
                                            </div>

                                            <div className="flex gap-2 pt-2">
                                                <button
                                                    onClick={() => handleSaveEdit(word._id)}
                                                    className="flex-1 rounded-xl bg-[#D6A85F] px-4 py-2 text-sm font-semibold text-[#111111] transition hover:bg-[#B88B47] focus:outline-none focus:ring-2 focus:ring-[#D6A85F] focus:ring-offset-2 focus:ring-offset-[#202020]"
                                                >
                                                    Save Changes
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="flex-1 rounded-xl border border-[#33302B] px-4 py-2 text-sm font-medium text-[#A7A29A] transition hover:border-[#D6A85F] hover:text-[#F5F2EB]"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        // View Mode
                                        <>
                                            <div className="mb-3 flex items-start justify-between">
                                                <h2 className="font-serif text-xl font-semibold text-[#F5F2EB]">
                                                    {word.word}
                                                </h2>
                                                <span className={`rounded-full border px-3 py-1 text-xs font-medium ${getDifficultyColor(word.difficulty)}`}>
                                                    {word.difficulty || "medium"}
                                                </span>
                                            </div>

                                            <div className="mb-4 rounded-xl border border-[#33302B] bg-[#1A1A1A] p-4">
                                                <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-[#A7A29A]">
                                                    MORVA Translation
                                                </p>
                                                <p className="cipher text-lg leading-8 tracking-widest text-[#F5F2EB]">
                                                    {word.word}
                                                </p>
                                            </div>

                                            <div className="mt-4 flex items-center justify-between border-t border-[#33302B] pt-4">
                                                <button
                                                    onClick={() => toggleLearned(word._id, word.learned)}
                                                    className={`text-sm font-medium transition ${
                                                        word.learned
                                                            ? "text-[#7DAD8A] hover:text-[#7DAD8A]/80"
                                                            : "text-[#A7A29A] hover:text-[#F5F2EB]"
                                                    }`}
                                                >
                                                    {word.learned ? "✓ Learned" : "○ Not learned"}
                                                </button>

                                                <div className="flex gap-1">
                                                    <button
                                                        onClick={() => handleEdit(word)}
                                                        className="rounded-lg px-3 py-1 text-sm text-[#A7A29A] transition hover:bg-[#1A1A1A] hover:text-[#D6A85F]"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(word._id)}
                                                        disabled={deleting === word._id}
                                                        className="rounded-lg px-3 py-1 text-sm text-[#D47777] transition hover:bg-[#D47777]/10 hover:text-[#D47777] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {deleting === word._id ? "..." : "Delete"}
                                                    </button>
                                                </div>
                                            </div>
                                            {hasMore && (
                                                <div className="mt-8 text-center">
                                                    {loadMoreError && (
                                                        <p role="alert" className="mb-3 text-sm text-[#D47777]">{loadMoreError}</p>
                                                    )}
                                                    <button
                                                        type="button"
                                                        onClick={loadMoreWords}
                                                        disabled={loadingMore}
                                                        className="rounded-xl border border-[#33302B] px-6 py-3 text-sm font-medium text-[#F5F2EB] transition hover:border-[#D6A85F] hover:text-[#D6A85F] disabled:cursor-not-allowed disabled:opacity-50"
                                                    >
                                                        {loadingMore ? "Loading..." : "Load more words"}
                                                    </button>
                                                </div>
                                            )}
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </>
                )}

            </section>

            {/* Back to Translator */}
            <section className="border-t border-[#33302B] bg-[#1A1A1A]">
                <div className="mx-auto max-w-6xl px-6 py-12 text-center">
                    <a
                        href="/translate"
                        className="inline-flex items-center gap-2 text-sm font-medium text-[#A7A29A] transition hover:text-[#D6A85F]"
                    >
                        ← Back to Translator
                    </a>
                </div>
            </section>

        </main>
    );
}

export default Words;