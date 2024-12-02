const { getDb } = require("../config/database");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

class AuthService {
  async register(userData) {
    const db = getDb();

    const existingUser = await db.collection("users").findOne({
      email: userData.email,
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }

    const hashedPassword = await bcrypt.hash(userData.password, 10);

    const user = {
      ...userData,
      password: hashedPassword,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    await db.collection("users").insertOne(user);

    const { password, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async login(email, password) {
    const db = getDb();
    const user = await db.collection("users").findOne({ email });

    if (!user) {
      throw new Error("Invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error("Invalid credentials");
    }

    const token = jwt.sign(
      { userId: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "24h" }
    );

    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
  }

  async getProfile(userId) {
    const db = getDb();

    const user = await db.collection("users").findOne(
      { _id: userId },
      { projection: { password: 0 } }
    );

    console.log('userId12313123',user);


    if (!user) {
      throw new Error("User not found");
    }

    if (user.role === "SELLER") {
      const [productsCount, ordersCount] = await Promise.all([
        db.collection("products").countDocuments({
          userId: userId,
        }),
        db.collection("orders").countDocuments({
          sellerId: userId,
        }),
      ]);

      return {
        ...user,
        stats: {
          productsCount,
          ordersCount,
        },
      };
    }

    if (user.role === "BUYER") {
      const ordersCount = await db.collection("orders").countDocuments({
        userId: userId,
      });

      return {
        ...user,
        stats: {
          ordersCount,
        },
      };
    }

    return user;
  }

  async updateProfile(userId, updateData) {
    const db = getDb();

    const { email, role, password, ...allowedUpdates } = updateData;

    const updatedUser = await db.collection("users").findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          ...allowedUpdates,
          updatedAt: new Date(),
        },
      },
      {
        returnDocument: "after",
        projection: { password: 0 },
      }
    );

    if (!updatedUser.value) {
      throw new Error("User not found");
    }

    return updatedUser.value;
  }

  async changePassword(userId, currentPassword, newPassword) {
    const db = getDb();

    const user = await db.collection("users").findOne({
      _id: userId,
    });

    if (!user) {
      throw new Error("User not found");
    }

    const isValidPassword = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isValidPassword) {
      throw new Error("Mật khẩu hiện tại không đúng");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);

    await db.collection("users").updateOne(
      { _id: userId },
      {
        $set: {
          password: hashedPassword,
          updatedAt: new Date(),
        },
      }
    );

    return { message: "Đổi mật khẩu thành công" };
  }
}

module.exports = new AuthService();