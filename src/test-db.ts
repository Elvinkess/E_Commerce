import AppDataSource from "./api/connection";


AppDataSource.initialize()
  .then(() => {
    console.log("✅ Database connection established.");
  })
  .catch((error) => {
    console.error("❌ Error connecting to database:", error);
  });