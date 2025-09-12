import { createClient } from "redis";

const redisClient = createClient({
  url:process.env.REDIS_CONNECTION, /*"redis://localhost:6379"*/ // default local Redis
  socket: {
    tls: true, // Required for Render Redis
    rejectUnauthorized: false // Sometimes needed if SSL cert causes issues
  }
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

// Initiate the connection
redisClient.connect().catch(console.error);

export default redisClient;
