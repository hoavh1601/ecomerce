const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const {
  JWT_SECRET,
  JWT_EXPIRES_IN,
  JWT_REFRESH_SECRET,
  JWT_REFRESH_EXPIRES_IN,
} = process.env;

class TokenUtil {
  generateAccessToken(userId, role) {
    return jwt.sign({ userId, role }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    });
  }

  generateRefreshToken(userId) {
    return jwt.sign({ userId, type: "refresh" }, JWT_REFRESH_SECRET, {
      expiresIn: JWT_REFRESH_EXPIRES_IN,
    });
  }

  generateTokens(userId, role) {
    const accessToken = this.generateAccessToken(userId, role);
    const refreshToken = this.generateRefreshToken(userId);

    // Tính thời gian hết hạn cho refresh token
    const refreshTokenExpiry = new Date(
      Date.now() + ms(JWT_REFRESH_EXPIRES_IN)
    );

    return {
      accessToken,
      refreshToken,
      refreshTokenExpiry,
    };
  }

  verifyAccessToken(token) {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Access token đã hết hạn");
      }
      throw new Error("Access token không hợp lệ");
    }
  }

  verifyRefreshToken(token) {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET);
    } catch (error) {
      if (error.name === "TokenExpiredError") {
        throw new Error("Refresh token đã hết hạn");
      }
      throw new Error("Refresh token không hợp lệ");
    }
  }

  generateResetToken() {
    return crypto.randomBytes(32).toString("hex");
  }

  getExpiryDate(duration) {
    return new Date(Date.now() + ms(duration));
  }
}

module.exports = new TokenUtil();
