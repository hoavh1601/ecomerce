// src/scripts/seedCategories.js
const { MongoClient } = require("mongodb");
require("dotenv").config();

const categories = [
  {
    name: "Electronics",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Fashion",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Home & Living",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Health & Beauty",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Sports & Outdoors",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Books & Stationery",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Toys & Games",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Automotive",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Food & Beverages",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    name: "Pet Supplies",
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

async function seedCategories() {
  let client;
  try {
    client = await MongoClient.connect("mongodb://localhost:27017");
    const db = client.db("e-commerce");

    await db.collection("categories").deleteMany({});

    const result = await db.collection("categories").insertMany(categories);

    console.log(`Successfully seeded ${result.insertedCount} categories`);
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
