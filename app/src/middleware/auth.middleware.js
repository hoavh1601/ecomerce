// src/middlewares/auth.middleware.js
const jwt = require("jsonwebtoken");
const { getDb } = require("../config/database");
const { ObjectId } = require("mongodb");

const authMiddleware = {
  // Middleware kiểm tra đăng nhập
  authenticate: async (req, res, next) => {
    try {
      const token = req.headers.authorization?.split(" ")[1];
      console.log(token);

      if (!token) {
        return res.status(401).json({
          status: "error",
          message: "Vui lòng đăng nhập",
        });
      }

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Lấy thông tin user từ database
      const db = getDb();
      const user = await db.collection("users").findOne({
        _id: new ObjectId(decoded.userId),
      });
      console.log(user);

      if (!user) {
        return res.status(401).json({
          status: "error",
          message: "Token không hợp lệ",
        });
      }

      // Gán thông tin user vào request
      req.user = user;
      next();
    } catch (error) {
      return res.status(401).json({
        status: "error",
        message: "Token không hợp lệ hoặc đã hết hạn",
      });
    }
  },

  // Middleware kiểm tra role
  authorize: (...roles) => {
    return (req, res, next) => {
      if (!req.user) {
        return res.status(401).json({
          status: "error",
          message: "Vui lòng đăng nhập",
        });
      }

      if (!roles.includes(req.user.role)) {
        return res.status(403).json({
          status: "error",
          message: "Bạn không có quyền thực hiện hành động này",
        });
      }

      next();
    };
  },

  checkOwnership: (resourceType) => {
    return async (req, res, next) => {
      try {
        const db = getDb();
        const resourceId = req.params.id;
        const userId = req.user._id;

        let resource;
        switch (resourceType) {
          case "product":
            resource = await db.collection("products").findOne({
              _id: new ObjectId(resourceId),
              sellerId: new ObjectId(userId),
            });
            break;
        }

        if (!resource && req.user.role !== "ADMIN" || req.user.role !== "SELLER") {
          return res.status(403).json({
            status: "error",
            message: "Bạn không có quyền thực hiện hành động này",
          });
        }

        next();
      } catch (error) {
        return res.status(500).json({
          status: "error",
          message: "Lỗi server",
        });
      }
    };
  },
};

module.exports = authMiddleware;
