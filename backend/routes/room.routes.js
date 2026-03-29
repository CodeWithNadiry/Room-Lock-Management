import { Router } from "express";
import { createRoom, getRooms, updateRoom, deleteRoom } from "../controllers/room.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { createRoomSchema } from "../schemas/room.schema.js";

const router = Router();

router.get("/", validateRequest(createRoomSchema), isAuth, getRooms);
router.post("/", isAuth, createRoom);
router.patch("/:id", isAuth, updateRoom);
router.delete("/:id", isAuth, deleteRoom);

export default router;