const redis = require("../config/redis");

const createRateLimiter = ({
    windowSeconds,
    maxRequests,
    message,
}) => {
    return async (req, res, next) => {
        try {
            const forwarded = req.headers["x-forwarded-for"];

            const ip = forwarded
                ? forwarded.split(",")[0].trim()
                : req.ip;

            const now = Math.floor(Date.now() / 1000);

            const windowStart =
                Math.floor(now / windowSeconds) *
                windowSeconds;

            const previousWindowStart =
                windowStart - windowSeconds;

            const currentKey =
                `rate-limit:${req.baseUrl}${req.path}:${ip}:${windowStart}`;

            const previousKey =
                `rate-limit:${req.baseUrl}${req.path}:${ip}:${previousWindowStart}`;

            const currentCount = await redis.incr(currentKey);

            if (currentCount === 1) {
                await redis.expire(
                    currentKey,
                    windowSeconds * 2,
                );
            }

            const previousCount =
                (await redis.get(previousKey)) || 0;

            const elapsed =
                now - windowStart;

            const previousWeight =
                (windowSeconds - elapsed) /
                windowSeconds;

            const estimatedCount =
                Number(previousCount) *
                    previousWeight +
                currentCount;

            if (estimatedCount > maxRequests) {
                await redis.decr(currentKey);

                return res.status(429).json({
                    success: false,
                    message,
                });
            }

            next();
        } catch (error) {
            console.log(
                "Rate limiter error:",
                error.message,
            );

            next();
        }
    };
};

const uploadRateLimiter = createRateLimiter({
    windowSeconds: 60,
    maxRequests: 5,
    message:
        "Too many upload requests. Please try again later.",
});

const transferInfoRateLimiter = createRateLimiter({
    windowSeconds: 60,
    maxRequests: 60,
    message:
        "Too many requests. Please try again later.",
});

const downloadRateLimiter = createRateLimiter({
    windowSeconds: 60,
    maxRequests: 20,
    message:
        "Too many download requests. Please try again later.",
});

module.exports = {
    uploadRateLimiter,
    transferInfoRateLimiter,
    downloadRateLimiter,
};