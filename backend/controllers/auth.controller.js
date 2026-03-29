import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { findUserByEmail } from "../services/auth.services.js";

export async function login(req, res, next) {
  try {
    
    const { email, password } = req.body;

    const user = await findUserByEmail(email);
    if (!user) {
      const err = new Error("User not found");
      err.statusCode = 401;
      return next(err);
    }

    if (!user.is_active) {
      const err = new Error("User is inactive, contact admin!");
      err.statusCode = 403;
      return next(err);
    }

    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const err = new Error("Incorrect password");
      err.statusCode = 401;
      return next(err);
    }

    const token = jwt.sign(
      {
        email: user.email,
        userId: user.id,
        role: user.role,
        property_id: user.property_id || null,
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN },
    );

    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        role: user.role,
        email: user.email,
        property_id: user.property_id,
      },
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}
