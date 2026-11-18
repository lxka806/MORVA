import { useEffect, useState } from "react";

const URL = import.meta.env.VITE_API_URL;
const PAGE_SIZE = 50;

function LiderBoard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [loadingMore, setLoadingMore] = useState(false);
    const [loadMoreError, setLoadMoreError] = useState("");
    const [hasMore, setHasMore] = useState(false);
    const [page, setPage] = useState(1);

    useEffect(() => {
        const controller = new AbortController();
        const getLeaderboard = async () => {
            try {
                const response = await fetch(`${URL}/api/auth/leaderboard?page=1&limit=${PAGE_SIZE}`, {
                    credentials: "include",
                    signal: controller.signal
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.message || "Failed to load leaderboard");
                }
                if (!Array.isArray(data)) {
                    throw new Error("Unexpected leaderboard response");
                }
                setLeaderboard(data);
                setHasMore(response.headers.get("X-Has-More") === "true");
            } catch (e) {
                if (e.name !== "AbortError") {
                    console.error(e);
                    setError(e.message || "Unable to load leaderboard");
                }
            } finally {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            }
        };

        getLeaderboard();
        return () => controller.abort();
    }, []);

    const loadMoreUsers = async () => {
        setLoadingMore(true);
        setLoadMoreError("");

        try {
            const nextPage = page + 1;
            const response = await fetch(`${URL}/api/auth/leaderboard?page=${nextPage}&limit=${PAGE_SIZE}`, {
                credentials: "include"
            });
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Unable to load more learners");
            }
            if (!Array.isArray(data)) {
                throw new Error("Unexpected leaderboard response");
            }

            setLeaderboard((currentUsers) => [...currentUsers, ...data]);
            setPage(nextPage);
            setHasMore(response.headers.get("X-Has-More") === "true");
        } catch (e) {
            console.error(e);
            setLoadMoreError(e.message || "Unable to load more learners");
        } finally {
            setLoadingMore(false);
        }
    };

    if (loading) {
        return (
            <main className="min-h-screen bg-[#111111] text-[#F5F2EB]">
                <div className="mx-auto max-w-6xl px-6 pt-20 pb-24">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-2 border-[#33302B] border-t-[#D6A85F]"></div>
                            <p className="text-[#A7A29A] font-sans">Loading leaderboard...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#111111] text-[#F5F2EB] font-sans">
            <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
                <div className="max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-[#33302B] bg-[#1A1A1A] px-4 py-2 text-xs font-semibold tracking-widest text-[#A7A29A]">
                        MORVA LEADERBOARD
                    </span>

                    <h1 className="mt-6 font-serif text-5xl font-semibold tracking-tight text-[#F5F2EB] md:text-7xl">
                        Top
                        <span className="text-[#D6A85F]"> Learners</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-[#A7A29A]">
                        Ranked by how many words are in each user&apos;s dictionary and how many of them are already learned.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-24">
                {error ? (
                    <div className="rounded-2xl border border-[#D47777]/30 bg-[#D47777]/10 p-6 text-[#D47777]">
                        {error}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-2xl border border-[#33302B] bg-[#202020]">
                        <div className="grid grid-cols-[80px_1.5fr_1fr_1fr_1fr] gap-4 border-b border-[#33302B] bg-[#1A1A1A] px-6 py-4 text-xs font-semibold uppercase tracking-wider text-[#A7A29A]">
                            <span>Rank</span>
                            <span>User</span>
                            <span>Dictionary</span>
                            <span>Learned</span>
                        </div>

                        {leaderboard.length === 0 ? (
                            <div className="p-8 text-center text-[#A7A29A]">
                                No users have started learning yet.
                            </div>
                        ) : (
                            leaderboard.map((user) => (
                                <div
                                    key={user.id}
                                    className="grid grid-cols-[80px_1.5fr_1fr_1fr_1fr] gap-4 border-b border-[#33302B] px-6 py-5 last:border-b-0 transition-colors hover:bg-[#1A1A1A]"
                                >
                                    <div className="flex items-center">
                                        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full border font-semibold text-sm ${
                                            user.rank === 1
                                                ? "border-[#D6A85F] bg-[#D6A85F] text-[#111111] shadow-[0_0_16px_rgba(214,168,95,0.35)]"
                                                : user.rank === 2
                                                    ? "border-[#A7A29A]/40 bg-[#A7A29A]/15 text-[#F5F2EB]"
                                                    : user.rank === 3
                                                        ? "border-[#B88B47]/60 bg-[#B88B47]/20 text-[#D6A85F]"
                                                        : "border-[#33302B] bg-[#1A1A1A] text-[#A7A29A]"
                                        }`}>
                                            #{user.rank}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-[#F5F2EB]">{user.name}</p>
                                        <p className="text-sm text-[#A7A29A]">@{user.username}</p>
                                    </div>
                                    <div className="flex items-center text-[#F5F2EB]">{user.totalWords}</div>
                                    <div className="flex items-center text-[#F5F2EB]">{user.learnedWords}</div>
                                </div>
                            ))
                        )}
                    </div>
                )}
                {hasMore && !error && (
                    <div className="mt-6 text-center">
                        {loadMoreError && (
                            <p role="alert" className="mb-3 text-sm text-[#D47777]">{loadMoreError}</p>
                        )}
                        <button
                            type="button"
                            onClick={loadMoreUsers}
                            disabled={loadingMore}
                            className="rounded-xl border border-[#33302B] px-6 py-3 text-sm font-medium text-[#F5F2EB] transition hover:border-[#D6A85F] hover:text-[#D6A85F] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {loadingMore ? "Loading..." : "Load more learners"}
                        </button>
                    </div>
                )}
            </section>
        </main>
    );
}

export default LiderBoard;