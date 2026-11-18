const test = require("node:test")
const assert = require("node:assert/strict")

const Auth = require("../models/auth.model")
const Lesson = require("../models/learning.model")
const Progress = require("../models/progress.model")
const Words = require("../models/words.model")
const { getLeaderboard } = require("../controllers/auth.controller")
const { completeLesson, getUserProgress } = require("../controllers/learning.controller")
const { getWords } = require("../controllers/words.controller")
const requestTimingPath = require.resolve("../middleware/requestTiming")
const originalRequestThreshold = process.env.SLOW_REQUEST_THRESHOLD_MS
process.env.SLOW_REQUEST_THRESHOLD_MS = "0"
delete require.cache[requestTimingPath]
const requestTiming = require("../middleware/requestTiming")
if (originalRequestThreshold === undefined) {
    delete process.env.SLOW_REQUEST_THRESHOLD_MS
} else {
    process.env.SLOW_REQUEST_THRESHOLD_MS = originalRequestThreshold
}

const createResponse = () => ({
    statusCode: 200,
    body: null,
    headers: {},
    status(code) {
        this.statusCode = code
        return this
    },
    set(name, value) {
        this.headers[name] = value
        return this
    },
    json(body) {
        this.body = body
        return this
    }
})

test("getWords returns a bounded page and indicates more results", async () => {
    const originalFind = Words.find
    let queryOptions = {}
    Words.find = (filter) => {
        queryOptions.filter = filter
        const query = {
            select(fields) {
                queryOptions.fields = fields
                return this
            },
            sort(fields) {
                queryOptions.sort = fields
                return this
            },
            skip(value) {
                queryOptions.skip = value
                return this
            },
            limit(value) {
                queryOptions.limit = value
                return this
            },
            async lean() {
                return [{ _id: "first" }, { _id: "next" }]
            }
        }
        return query
    }

    try {
        const res = createResponse()
        await getWords({
            user: { _id: "owner-id" },
            query: { page: "2", limit: "1" }
        }, res)

        assert.equal(res.statusCode, 200)
        assert.deepEqual(res.body, [{ _id: "first" }])
        assert.equal(res.headers["X-Has-More"], "true")
        assert.deepEqual(queryOptions.filter, { owner: "owner-id" })
        assert.equal(queryOptions.skip, 1)
        assert.equal(queryOptions.limit, 2)
        assert.match(queryOptions.fields, /word/)
    } finally {
        Words.find = originalFind
    }
})

test("leaderboard aggregates word totals and returns ranked pages", async () => {
    const originalAggregate = Auth.aggregate
    let pipeline
    Auth.aggregate = (value) => {
        pipeline = value
        return {
            allowDiskUse: async () => [
                { id: "first", totalWords: 2, learnedWords: 1 },
                { id: "next", totalWords: 1, learnedWords: 0 }
            ]
        }
    }

    try {
        const res = createResponse()
        await getLeaderboard({
            query: { page: "1", limit: "1" }
        }, res)

        assert.equal(res.statusCode, 200)
        assert.deepEqual(res.body, [{ id: "first", totalWords: 2, learnedWords: 1, rank: 1 }])
        assert.equal(res.headers["X-Has-More"], "true")
        assert.equal(pipeline[0].$lookup.from, Words.collection.name)
        assert.deepEqual(pipeline.find((stage) => stage.$limit)?.$limit, 2)
    } finally {
        Auth.aggregate = originalAggregate
    }
})

test("concurrent lesson completion does not award XP twice", async () => {
    const originalLessonExists = Lesson.exists
    const originalProgressUpdate = Progress.findOneAndUpdate
    const originalProgressCreate = Progress.create
    const originalAuthFindById = Auth.findById
    const lessonId = "0123456789abcdef01234567"

    Lesson.exists = async (filter) => {
        assert.deepEqual(filter, { _id: lessonId })
        return { _id: lessonId }
    }
    Progress.findOneAndUpdate = () => ({
        select() {
            return this
        },
        async lean() {
            return null
        }
    })
    Progress.create = async () => {
        throw Object.assign(new Error("duplicate progress"), { code: 11000 })
    }
    Auth.findById = () => ({
        select() {
            return this
        },
        async lean() {
            return { xp: 300 }
        }
    })

    try {
        const res = createResponse()
        await completeLesson({
            params: { id: lessonId },
            user: { _id: "user-id" }
        }, res)

        assert.equal(res.statusCode, 200)
        assert.deepEqual(res.body, {
            message: "Lesson already completed",
            xpEarned: 0,
            totalXP: 300
        })
    } finally {
        Lesson.exists = originalLessonExists
        Progress.findOneAndUpdate = originalProgressUpdate
        Progress.create = originalProgressCreate
        Auth.findById = originalAuthFindById
    }
})

test("user progress joins records by lesson id and preserves lesson order", async () => {
    const originalProgressFind = Progress.find
    const originalLessonFind = Lesson.find
    const originalAuthFindById = Auth.findById

    Progress.find = (filter) => {
        assert.deepEqual(filter, { user: "user-id" })
        return {
            select() {
                return this
            },
            async lean() {
                return [
                    { lesson: "lesson-2", completed: true, score: 100 },
                    { lesson: "lesson-1", completed: false, score: 0 }
                ]
            }
        }
    }
    Lesson.find = () => ({
        select() {
            return this
        },
        sort() {
            return this
        },
        async lean() {
            return [
                { _id: "lesson-1", title: "First" },
                { _id: "lesson-2", title: "Second" }
            ]
        }
    })

    test("request timing logs slow routes without query-string data", () => {
        const originalWarn = console.warn
        let finishRequest
        let warning = ""
        let nextCalled = false
        console.warn = (message) => {
            warning = message
        }

        try {
            requestTiming(
                {
                    method: "GET",
                    baseUrl: "/api/words",
                    path: "/?token=private",
                    route: { path: "/" }
                },
                {
                    statusCode: 200,
                    once(event, callback) {
                        assert.equal(event, "finish")
                        finishRequest = callback
                    }
                },
                () => {
                    nextCalled = true
                }
            )
            finishRequest()

            assert.equal(nextCalled, true)
            assert.match(warning, /^\[slow-api\] GET \/api\/words\/ 200 \d+\.\d+ms$/)
            assert.doesNotMatch(warning, /private/)
        } finally {
            console.warn = originalWarn
        }
    })
    Auth.findById = () => ({
        select() {
            return this
        },
        async lean() {
            return { xp: 100 }
        }
    })

    try {
        const res = createResponse()
        await getUserProgress({ user: { _id: "user-id" } }, res)

        assert.equal(res.statusCode, 200)
        assert.deepEqual(res.body, {
            xp: 100,
            completedLessons: 1,
            progress: [
                { lesson: "First", completed: false, score: 0 },
                { lesson: "Second", completed: true, score: 100 }
            ]
        })
    } finally {
        Progress.find = originalProgressFind
        Lesson.find = originalLessonFind
        Auth.findById = originalAuthFindById
    }
})
