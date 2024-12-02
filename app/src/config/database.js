const { MongoClient } = require("mongodb");

const uri = "mongodb://localhost:27017";
const dbName = "e-commerce";

let db = null;

async function connectToDatabase() {
  try {
    const client = await MongoClient.connect(uri);
    db = client.db(dbName);
    console.log("✅ Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("❌ MongoDB Connection Error:", error);
    process.exit(1);
  }
}

function getDb() {
  if (!db) {
    throw new Error("Database not initialized");
  }
  return db;
}

module.exports = {
  connectToDatabase,
  getDb,
};
