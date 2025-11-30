const jwt = require("jsonwebtoken");

// Clave secreta (ponla en .env después)
const SECRET = process.env.JWT_SECRET || "VENERIS_SECRETO";

exports.generateToken = (payload) => {
  return jwt.sign(payload, SECRET, {
    expiresIn: "7d" // Token dura 7 días
  });
};

exports.verifyToken = (token) => {
  try {
    return jwt.verify(token, SECRET);
  } catch (error) {
    return null;
  }
};
