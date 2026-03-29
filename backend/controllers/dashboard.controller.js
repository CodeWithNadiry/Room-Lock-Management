import Room from "../models/room.model.js";
import User from "../models/user.model.js";
import RoomLock from "../models/roomLock.model.js";

export const getDashboardStats = async (req, res, next) => {
  const { property_id } = req.query;

  try {
    const filter = property_id ? { property_id } : {};

    const totalRooms = await Room.count({ where: filter });

    const totalLocks = await RoomLock.count({ where: filter });

    const totalUsers = await User.count({ where: filter });

    res.status(200).json({
      totalRooms,
      totalLocks,
      totalUsers,
    });
  } catch (err) {
    err.statusCode ||= 500;
    next(err);
  }
};
