import jwt from "jsonwebtoken";
export const isAuth = (req, res, next) => {
  const authHeader = req.get("Authorization");

  if (!authHeader) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const token = authHeader.split(" ")[1];

  console.log("RECEIVED TOKEN:", token);
  if (!token) {
    return res.status(401).json({ message: "Token missing." });
  }

  try {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

  console.log("DECODED TOKEN:", decodedToken);

  req.userId = decodedToken.userId;
  req.userRole = decodedToken.role;
  req.userPropertyId = decodedToken.property_id;

  next();
} catch (err) {
  console.log("JWT ERROR:", err.message); // 👈 ADD THIS
  return res.status(401).json({ message: "Invalid or expired token." });
}
};