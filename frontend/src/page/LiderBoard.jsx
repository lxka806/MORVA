import { useEffect, useState } from "react";

const URL = import.meta.env.VITE_API_URL;

function LiderBoard() {
    const [leaderboard, setLeaderboard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const getLeaderboard = async () => {
            try {
                const response = await fetch(`${URL}/api/auth/leaderboard`, {
                    credentials: "include"
                });

                const data = await response.json();

                if (!response.ok) {
                    setError(data.message || "Failed to load leaderboard");
                    return;
                }

                setLeaderboard(data);
            } catch (e) {
                console.log(e);
                setError("Something went wrong");
            } finally {
                setLoading(false);
            }
        };

        getLeaderboard();
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-white text-black">
                <div className="mx-auto max-w-6xl px-6 pt-20 pb-24">
                    <div className="flex min-h-[400px] items-center justify-center">
                        <div className="text-center">
                            <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-gray-200 border-t-blue-600"></div>
                            <p className="text-gray-500">Loading leaderboard...</p>
                        </div>
                    </div>
                </div>
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-white text-black">
            <section className="mx-auto max-w-6xl px-6 pt-20 pb-12">
                <div className="max-w-3xl">
                    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-4 py-2 text-xs font-semibold tracking-widest text-gray-500">
                        MORVA LEADERBOARD
                    </span>

                    <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-7xl">
                        Top
                        <span className="text-blue-600"> Learners</span>
                    </h1>

                    <p className="mt-6 max-w-2xl text-lg leading-8 text-gray-500">
                        Ranked by how many words are in each user&apos;s dictionary and how many of them are already learned.
                    </p>
                </div>
            </section>

            <section className="mx-auto max-w-6xl px-6 pb-24">
                {error ? (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-600">
                        {error}
                    </div>
                ) : (
                    <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
                        <div className="grid grid-cols-[80px_1.5fr_1fr_1fr_1fr] gap-4 border-b border-gray-200 bg-gray-50 px-6 py-4 text-xs font-semibold uppercase tracking-wider text-gray-500">
                            <span>Rank</span>
                            <span>User</span>
                            <span>Dictionary</span>
                            <span>Learned</span>
                        </div>

                        {leaderboard.length === 0 ? (
                            <div className="p-8 text-center text-gray-500">
                                No users have started learning yet.
                            </div>
                        ) : (
                            leaderboard.map((user) => (
                                <div
                                    key={user.id}
                                    className="grid grid-cols-[80px_1.5fr_1fr_1fr_1fr] gap-4 border-b border-gray-100 px-6 py-5 last:border-b-0 hover:bg-gray-50"
                                >
                                    <div className="flex items-center">
                                        <span className={`inline-flex h-9 w-9 items-center justify-center rounded-full font-bold ${
                                            user.rank === 1
                                                ? "bg-yellow-100 text-yellow-700"
                                                : user.rank === 2
                                                    ? "bg-slate-200 text-slate-700"
                                                    : user.rank === 3
                                                        ? "bg-orange-100 text-orange-700"
                                                        : "bg-gray-100 text-gray-600"
                                        }`}>
                                            #{user.rank}
                                        </span>
                                    </div>

                                    <div>
                                        <p className="font-semibold text-gray-900">{user.name}</p>
                                        <p className="text-sm text-gray-500">@{user.username}</p>
                                    </div>
                                    <div className="flex items-center text-gray-700">{user.totalWords}</div>
                                    <div className="flex items-center text-gray-700">{user.learnedWords}</div>
                                </div>
                            ))
                        )}
                    </div>
                )}
            </section>
        </main>
    );
}

export default LiderBoard;