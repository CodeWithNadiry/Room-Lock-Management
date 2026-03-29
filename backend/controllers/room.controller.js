import {
  createRoomSchema,
  updateRoomSchema,
} from "../schemas/room.schema.js";

import {
  createRoomService,
  deleteRoomService,
  getRoomsService,
  updateRoomService,
} from "../services/room.services.js";

export async function createRoom(req, res, next) {
  try {
    const value = req.body;
    const room = await createRoomService(value);

    res.status(201).json({ room });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
}

export async function getRooms(req, res, next) {
  try {
    let filter = {};

    if (req.userRole === "staff") {
      filter.property_id = req.userPropertyId;
    }

    const rooms = await getRoomsService(filter);
    res.json({ rooms });
  } catch (err) {
    next(err);
  }
}

export async function updateRoom(req, res, next) {
  try {
    const { error, value } = updateRoomSchema.validate(req.body);
    if (error) throw new Error(error.details[0].message);

    const room = await updateRoomService(req.params.id, value);
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ room });
  } catch (err) {
    next(err);
  }
}

export async function deleteRoom(req, res, next) {
  const room = await deleteRoomService(req.params.id);
  if (!room) return res.status(404).json({ message: "Room not found" });
  res.json({ message: "Room deleted" });
}