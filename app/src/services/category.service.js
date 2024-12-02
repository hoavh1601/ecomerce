const { getDb } = require("../config/database");
const { ObjectId } = require("mongodb");

class CategoryService {
  async getCategories() {
    const db = getDb();
    console.log("cate", db.collection("categories").find().toArray());
    return db.collection("categories").find().toArray();
  }

  async getCategoryById(id) {
    const db = getDb();
    return db.collection("categories").findOne({
      _id: new ObjectId(id),
    });
  }
}

module.exports = new CategoryService();
