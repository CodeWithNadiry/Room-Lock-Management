import { Router } from "express";
import {
  createUser,
  deleteUser,
  getUsers,
  updateUser,
} from "../controllers/user.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { isAdmin } from "../middleware/isAdmin.js";
import { isSuperAdmin } from "../middleware/isSuperAdmin.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createUserSchema } from "../schemas/user.schema.js";

const router = Router();

router.post("/", validateRequest(createUserSchema), isAuth, isSuperAdmin, createUser);

router.get("/", isAuth, isAdmin, getUsers);

router.patch("/:id", isAuth, isSuperAdmin, updateUser);

router.delete("/:id", isAuth, isSuperAdmin, deleteUser);

export default router;