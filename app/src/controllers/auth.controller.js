const AuthService = require("../services/auth.service");

const authController = {
  register: async (req, res) => {
    try {
      const user = await AuthService.register(req.body);
      res.status(201).json({ status: "success", data: user });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const result = await AuthService.login(email, password);
      res.json({ status: "success", data: result });
    } catch (error) {
      res.status(401).json({
        status: "error",
        message: error.message,
      });
    }
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
              userId: new ObjectId(userId),
            });
            break;
          case "order":
            resource = await db.collection("orders").findOne({
              _id: new ObjectId(resourceId),
              userId: new ObjectId(userId),
            });
            break;
          // Thêm các case khác nếu cần
        }

        if (!resource && req.user.role !== "ADMIN") {
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
  getProfile: async (req, res) => {
    try {
      const profile = await AuthService.getProfile(req.user._id);
      res.json({
        status: "success",
        data: profile,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  updateProfile: async (req, res) => {
    try {
      const updatedProfile = await AuthService.updateProfile(
        req.user._id,
        req.body
      );
      res.json({
        status: "success",
        data: updatedProfile,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },

  changePassword: async (req, res) => {
    try {
      const { currentPassword, newPassword } = req.body;
      const result = await AuthService.changePassword(
        req.user._id,
        currentPassword,
        newPassword
      );
      res.json({
        status: "success",
        message: result.message,
      });
    } catch (error) {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    }
  },
};

module.exports = authController;
