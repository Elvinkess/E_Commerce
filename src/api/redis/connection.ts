import { createClient } from "redis";
console.log("REDIS_URL from env:", process.env.REDIS_URL);

const redisClient = createClient({
  url:process.env.REDIS_URL, /*"redis://localhost:6379"*/ // default local Redis
  socket: {
    tls: true, // Required for Render Redis
    rejectUnauthorized: false // Sometimes needed if SSL cert causes issues
  }
});
redisClient.on("connect", () => {
  console.log("✅ Connected to Redis,",process.env.REDIS_URL);
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});



// Initiate the connection
redisClient.connect().catch(console.error);

export default redisClient;
