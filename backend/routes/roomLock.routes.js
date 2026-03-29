import { Router } from "express";
import { assignLock, unassignLock, getAllConnections } from "../controllers/roomLock.controller.js";
import { isAuth } from "../middleware/isAuth.js";
import { validateRequest } from "../middleware/validateRequest.js";
import { assignLockSchema } from "../schemas/roomLock.schema.js";
import { isAdmin } from "../middleware/isAdmin.js";

const router = Router();

router.get("/", isAuth, isAdmin, getAllConnections);
router.post("/assign", validateRequest(assignLockSchema), isAuth, isAdmin, assignLock);
router.post("/unassign", isAuth, isAdmin, unassignLock);

export default router;