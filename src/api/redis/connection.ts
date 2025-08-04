import { createClient } from "redis";

const redisClient = createClient({
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

export default redisClient;
