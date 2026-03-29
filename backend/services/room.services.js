import Room from "../models/room.model.js";

export const createRoomService = (data) => Room.create(data);

export const getRoomsService = (filter = {}) =>
  Room.findAll({ where: filter, order: [["created_at", "DESC"]] });

export const updateRoomService = async (id, data) => {
  const room = await Room.findByPk(id);
  if (!room) return null;
  await room.update(data);
  return room;
};

export const deleteRoomService = async (id) => {
  const room = await Room.findByPk(id);
  if (!room) return null;
  await room.destroy();
  return room;
};