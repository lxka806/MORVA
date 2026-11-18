const configuredThreshold = Number(process.env.SLOW_REQUEST_THRESHOLD_MS)
const slowRequestThreshold = Number.isFinite(configuredThreshold) && configuredThreshold >= 0
    ? configuredThreshold
    : 500

const requestTiming = (req, res, next) => {
    const startedAt = process.hrtime.bigint()

    res.once("finish", () => {
        const durationMs = Number(process.hrtime.bigint() - startedAt) / 1e6
        if (durationMs >= slowRequestThreshold) {
            console.warn(
                `[slow-api] ${req.method} ${req.baseUrl}${req.route?.path || req.path} ${res.statusCode} ${durationMs.toFixed(1)}ms`
            )
        }
    })

    next()
}

module.exports = requestTiming
