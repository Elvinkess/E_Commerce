"use strict";
// import { createClient } from "redis";
// console.log("REDIS_URL from env:", process.env.REDIS_URL);
Object.defineProperty(exports, "__esModule", { value: true });
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
const redis_1 = require("redis");
const redisUrl = process.env.REDIS_URL;
console.log("REDIS_URL from env:", redisUrl);
const isTls = redisUrl === null || redisUrl === void 0 ? void 0 : redisUrl.startsWith("rediss://");
const redisClient = (0, redis_1.createClient)({
    url: redisUrl,
    socket: isTls
        ? {
            tls: true, // only enable TLS if URL requires it
            rejectUnauthorized: false, // useful if cert validation fails
        }
        : undefined,
});
redisClient.on("connect", () => {
    console.log("✅ Connected to Redis:", redisUrl);
});
redisClient.on("error", (err) => {
    console.error("❌ Redis connection error:", err);
});
// Initiate the connection
redisClient.connect().catch(console.error);
exports.default = redisClient;
