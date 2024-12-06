const { getDb } = require("../config/database");
const { ObjectId } = require("mongodb");

class AdminService {
  async getUsers(query = {}) {
    const db = getDb();
    const { page = 1, limit = 10, search = "" } = query;
    const skip = (page - 1) * Number(limit);

    let filter = {};
    if (search) {
      filter.$or = [
        { fullName: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const [users, total] = await Promise.all([
      db
        .collection("users")
        .find(filter)
        .skip(skip)
        .limit(Number(limit))
        .toArray(),
      db.collection("users").countDocuments(filter),
    ]);

    return {
      data: users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }

  async updateUserStatus(userId, status) {
    const db = getDb();
    const result = await db
      .collection("users")
      .findOneAndUpdate(
        { _id: new ObjectId(userId) },
        { $set: { status, updatedAt: new Date() } },
        { returnDocument: "after" }
      );
    return result.value;
  }

  async getCategories() {
    const db = getDb();
    return await db.collection("categories").find().toArray();
  }

  async createCategory(data) {
    const db = getDb();
    const category = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection("categories").insertOne(category);
    return { ...category, _id: result.insertedId };
  }

  async updateCategory(id, data) {
    const db = getDb();
    const result = await db.collection("categories").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...data,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );
    return result.value;
  }

  // Orders for admin
  async getOrders(query = {}) {
    const db = getDb();
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * Number(limit);

    let filter = {};
    if (status) {
      filter.status = status;
    }

    const aggregation = [
      { $match: filter },
      {
        $lookup: {
          from: "users",
          localField: "userId",
          foreignField: "_id",
          as: "user",
        },
      },
      { $unwind: "$user" },
      { $skip: skip },
      { $limit: Number(limit) },
      { $sort: { createdAt: -1 } },
    ];

    const [orders, total] = await Promise.all([
      db.collection("orders").aggregate(aggregation).toArray(),
      db.collection("orders").countDocuments(filter),
    ]);

    return {
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
      },
    };
  }
  async getProducts(query = {}) {
    try {
      const db = getDb();
      const {
        page = 1,
        limit = 10,
        name = "",
        minPrice,
        maxPrice,
        categoryId,
        ...rest
      } = query;

      const skip = (page - 1) * Number(limit);

      let filter = {};

      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }

      if (Number(minPrice) || Number(maxPrice)) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      if (categoryId && categoryId !== "all") {
        filter.categoryId = new ObjectId(categoryId);
      }

      // Use aggregation to get seller info
      const aggregation = [
        { $match: filter },
        {
          $lookup: {
            from: "users",
            localField: "sellerId",
            foreignField: "_id",
            as: "seller",
          },
        },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$seller" },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $skip: skip },
        { $limit: Number(limit) },
        { $sort: { createdAt: -1 } },
      ];

      const [products, total] = await Promise.all([
        db.collection("products").aggregate(aggregation).toArray(),
        db.collection("products").countDocuments(filter),
      ]);

      return {
        data: products,
        pagination: {
          page: Number(page),
          limit: Number(limit),
          total,
          totalPages: Math.ceil(total / Number(limit)),
        },
      };
    } catch (error) {
      throw error;
    }
  }
}

module.exports = new AdminService();
