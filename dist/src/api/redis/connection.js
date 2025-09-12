"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_CONNECTION, /*"redis://localhost:6379"*/ // default local Redis
    socket: {
        tls: true, // Required for Render Redis
        rejectUnauthorized: false // Sometimes needed if SSL cert causes issues
    }
});
redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});
redisClient.on("connect", () => {
    console.log("✅ Connected to Redis,", process.env.REDIS_URL);
});
// Initiate the connection
redisClient.connect().catch(console.error);
exports.default = redisClient;
