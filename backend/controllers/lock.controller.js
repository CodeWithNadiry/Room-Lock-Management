import {
  createLockSchema,
} from "../schemas/lock.schema.js";

import {
  createLockService,
  deleteLockService,
  findLockBySerial,
  getLocksService,
  updateLockService,
} from "../services/lock.services.js";

export async function createLock(req, res, next) {
  try {
    const { serial_number } = req.body;

    const exists = await findLockBySerial(serial_number);
    if (exists) {
      return res.status(422).json({ message: "Serial already exists" });
    }

    const lock = await createLockService(req.body);
    res.status(201).json({ lock });
  } catch (err) {
    next(err);
  }
}

export async function getLocks(req, res) {
  const locks = await getLocksService();
  res.json({ locks });
}

export async function updateLock(req, res) {
  const lock = await updateLockService(req.params.id, req.body);
  if (!lock) return res.status(404).json({ message: "Not found" });
  res.json({ lock });
}

export async function deleteLock(req, res) {
  const lock = await deleteLockService(req.params.id);
  if (!lock) return res.status(404).json({ message: "Not found" });
  res.json({ message: "Deleted" });
}