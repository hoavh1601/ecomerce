const { getDb } = require("../config/database");
const { ObjectId } = require("mongodb");

class ProductService {
  async createProduct(id, productData, files) {
    const db = getDb();
    const images = files
      ? files.map((file) => `/uploads/products/${file.filename}`)
      : [];

    const categoryId = productData.categoryId
      ? new ObjectId(productData.categoryId)
      : null;

    const product = {
      ...productData,
      price: Number(productData.price),
      images,
      categoryId,
      createdAt: new Date(),
      updatedAt: new Date(),
      sellerId: id,
    };

    const result = await db.collection("products").insertOne(product);
    return { ...product, _id: result.insertedId };
  }

  async getProducts(query = {}, sellerId = "") {
    try {
      const db = getDb();
      const {
        page = 1,
        limit = 10,
        name = "",
        minPrice,
        maxPrice,
        stockFilter,
        categoryId,
        ...rest
      } = query;

      const skip = (page - 1) * Number(limit);
      console.log("query", query);

      let filter = {};
      if (sellerId) {
        filter.sellerId = new ObjectId(sellerId);
      }

      if (categoryId && categoryId !== "all") {
        filter.categoryId = new ObjectId(categoryId);
      }

      if (name) {
        filter.name = { $regex: name, $options: "i" };
      }

      if (Number(minPrice) || Number(maxPrice)) {
        filter.price = {};
        if (minPrice) filter.price.$gte = Number(minPrice);
        if (maxPrice) filter.price.$lte = Number(maxPrice);
      }

      if (stockFilter) {
        switch (stockFilter) {
          case "inStock":
            filter.stock = { $gt: 0 };
            break;
          case "outOfStock":
            filter.stock = 0;
            break;
        }
      }
      const aggregation = [
        { $match: filter },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: "$category" },
        { $skip: skip },
        { $limit: Number(limit) },
        { $sort: { createdAt: -1 } },
      ];

      console.log("filter", filter);

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

  // async getProductById(id) {
  //   const db = getDb();
  //   const [product] = await db
  //     .collection("products")
  //     .aggregate([
  //       {
  //         $match: { _id: new ObjectId(id) },
  //       },
  //       {
  //         $lookup: {
  //           from: "categories",
  //           localField: "categoryId",
  //           foreignField: "_id",
  //           as: "category",
  //         },
  //       },
  //       { $unwind: "$category" },
  //     ])
  //     .toArray();
  // }

  async updateProduct(id, updateData, files) {
    const db = getDb();

    if (files?.length) {
      updateData.images = [
        updateData.existingImages,
        ...files.map((file) => `/uploads/products/${file.filename}`),
      ];
    }

    console.log("updateData", updateData);

    if (updateData.categoryId) {
      updateData.categoryId = new ObjectId(updateData.categoryId);
    }

    const result = await db.collection("products").findOneAndUpdate(
      { _id: new ObjectId(id) },
      {
        $set: {
          ...updateData,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    return result.value;
  }

  async deleteProduct(id) {
    const db = getDb();
    await db.collection("products").deleteOne({
      _id: new ObjectId(id),
    });
    return { message: "Product deleted successfully" };
  }

  async getPublicProducts(query = {}) {
    try {
      const db = getDb();
      const {
        page = 1,
        limit = 12,
        name = "",
        minPrice,
        maxPrice,
        categoryId,
        sortBy = "createdAt",
        order = "desc",
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

      if (categoryId) {
        filter.categoryId = new ObjectId(categoryId);
      }

      let sort = {};
      sort[sortBy] = order === "desc" ? -1 : 1;

      const aggregation = [
        { $match: filter },
        {
          $lookup: {
            from: "categories",
            localField: "categoryId",
            foreignField: "_id",
            as: "category",
          },
        },
        { $unwind: { path: "$category", preserveNullAndEmptyArrays: true } },
        { $skip: skip },
        { $limit: Number(limit) },
        { $sort: sort },
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

module.exports = new ProductService();
