"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const redis_1 = require("redis");
const redisClient = (0, redis_1.createClient)({
    url: "redis://localhost:6379", // default local Redis
});
redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});
redisClient.on("connect", () => {
    console.log("✅ Connected to Redis");
});
// Initiate the connection
redisClient.connect().catch(console.error);
exports.default = redisClient;
