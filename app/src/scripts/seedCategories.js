// src/scripts/seedCategories.js
require("dotenv").config();
const { MongoClient, ObjectId } = require("mongodb");
const bcrypt = require("bcryptjs");

const adminUser = {
  _id: new ObjectId(),
  email: "admin@example.com",
  fullName: "Admin",
  phone: "0987654321",
  role: "ADMIN",
  password: bcrypt.hashSync("admin123", 10),
  createdAt: new Date(),
  updatedAt: new Date(),
};

async function seedCategories() {
  let client;
  try {
    client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("e-commerce");
    await db.collection("users").insertOne(adminUser);

    // console.log(`Successfully seeded ${result.insertedCount} categories`);
  } catch (error) {
    console.error("Error seeding categories:", error);
  } finally {
    if (client) {
      await client.close();
    }
    process.exit(0);
  }
}

seedCategories();
