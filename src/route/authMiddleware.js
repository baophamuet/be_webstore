import jwt from "jsonwebtoken";

export function authMiddleware(req, res, next) {
  const token = req.cookies.token;

  if (!token) return res.status(401).json({ message: "Chưa đăng nhập" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; // ⚠️ Gắn vào đây để dùng tiếp
    next(); // đi tiếp
  } catch (err) {
    return res.status(401).json({ message: "Token không hợp lệ" });
  }
}
