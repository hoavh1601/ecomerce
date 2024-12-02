// src/services/order.service.js
const { getDb } = require("../config/database");
const { ObjectId } = require("mongodb");

class OrderService {
  async createOrder(orderData) {
    const db = getDb();

    // Tính total amount và validate stock
    const productIds = orderData.items.map(
      (item) => new ObjectId(item.productId)
    );
    const products = await db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray();

    let totalAmount = 0;
    const orderItems = orderData.items.map((item) => {
      const product = products.find((p) => p._id.toString() === item.productId);
      if (!product) {
        throw new Error(`Product ${item.productId} not found`);
      }
      if (product.stock < item.quantity) {
        throw new Error(`Insufficient stock for product ${product.name}`);
      }

      const price = product.salePrice || product.price;
      totalAmount += price * item.quantity;

      return {
        productId: new ObjectId(item.productId),
        quantity: item.quantity,
        price: price,
        name: product.name,
      };
    });

    const order = {
      userId: new ObjectId(orderData.userId),
      items: orderItems,
      totalAmount,
      status: "PENDING",
      shippingAddress: orderData.shippingAddress,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Create order and update stock in transaction
    const session = db.client.startSession();
    try {
      session.startTransaction();

      // Insert order
      const result = await db
        .collection("orders")
        .insertOne(order, { session });

      // Update product stock
      for (const item of orderItems) {
        await db
          .collection("products")
          .updateOne(
            { _id: item.productId },
            { $inc: { stock: -item.quantity } },
            { session }
          );
      }

      await session.commitTransaction();
      return { ...order, _id: result.insertedId };
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }

  async getOrders(userId, role, query = {}) {
    const db = getDb();
    const { page = 1, limit = 10, status } = query;
    const skip = (page - 1) * Number(limit);

    let filter = {};
    // If BUYER, only show their orders
    if (role === "BUYER") {
      filter.userId = new ObjectId(userId);
    }
    if (status) {
      filter.status = status;
    }

    const [orders, total] = await Promise.all([
      db
        .collection("orders")
        .find(filter)
        .skip(skip)
        .limit(Number(limit))
        .sort({ createdAt: -1 })
        .toArray(),
      db.collection("orders").countDocuments(filter),
    ]);

    return {
      data: orders,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        totalPages: Math.ceil(total / Number(limit)),
      },
    };
  }

  async getOrderById(orderId, userId, role) {
    const db = getDb();
    const filter = {
      _id: new ObjectId(orderId),
    };

    // If BUYER, only allow viewing their own orders
    if (role === "BUYER") {
      filter.userId = new ObjectId(userId);
    }

    const order = await db.collection("orders").findOne(filter);
    if (!order) {
      throw new Error("Order not found");
    }

    return order;
  }

  async updateOrderStatus(orderId, status, userId, role) {
    const db = getDb();
    const filter = {
      _id: new ObjectId(orderId),
    };

    // Only ADMIN or SELLER can update status
    if (role !== "ADMIN") {
      throw new Error("Unauthorized");
    }

    const result = await db.collection("orders").findOneAndUpdate(
      filter,
      {
        $set: {
          status,
          updatedAt: new Date(),
        },
      },
      { returnDocument: "after" }
    );

    if (!result.value) {
      throw new Error("Order not found");
    }

    return result.value;
  }
}

module.exports = new OrderService();
