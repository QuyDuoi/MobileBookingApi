const JWT = require("jsonwebtoken");
const SECRETKEY = "FPTPOLYTECHNIC";

const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1]; // Tách token từ "Bearer TOKEN"

  if (!token) {
    return res.status(401).json({ msg: "Token không được cung cấp" });
  }

  // Xác thực token
  JWT.verify(token, SECRETKEY, (err, user) => {
    if (err) {
      return res.status(403).json({ msg: "Token không hợp lệ" });
    }

    // Lưu thông tin người dùng vào request để sử dụng sau này
    req.user = user;
    next();
  });
};

module.exports = authenticateToken;
