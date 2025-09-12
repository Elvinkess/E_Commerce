"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
console.log("REDIS_URL from env:", process.env.REDIS_URL);
const redisClient = (0, redis_1.createClient)({
    url: process.env.REDIS_URL,
    socket: {
        tls: true, // Required for Render/Upstash TLS
        rejectUnauthorized: false,
        keepAlive: 10000, // TCP keep-alive in ms
        reconnectStrategy: retries => {
            console.log(`⚡ Reconnecting to Redis (attempt #${retries})`);
            // retry after 1s, 2s, 5s, etc., or return new delay in ms
            return Math.min(retries * 1000, 30000);
        }
    }
});
redisClient.on("connect", () => {
    console.log("✅ Connected to Redis", process.env.REDIS_URL);
});
redisClient.on("ready", () => {
    console.log("🔑 Redis is ready to use");
});
redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});
redisClient.on("end", () => {
    console.log("⚠️ Redis connection closed");
});
// Initiate connection
redisClient.connect().catch(console.error);
exports.default = redisClient;
// const redisClient = createClient({
//   url:process.env.REDIS_URL, /*"redis://localhost:6379"*/ // default local Redis
//   socket: {
//     tls: true, // Required for Render Redis
//     rejectUnauthorized: false // Sometimes needed if SSL cert causes issues
//   }
// });
// redisClient.on("connect", () => {
//   console.log("✅ Connected to Redis,",process.env.REDIS_URL);
// });
// redisClient.on("error", (err) => {
//   console.error("❌ Redis connection error:", err);
// });
// // Initiate the connection
// redisClient.connect().catch(console.error);
// export default redisClient;
