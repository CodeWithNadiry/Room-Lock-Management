import Joi from "joi";

export const createRoomSchema = Joi.object({
  property_id: Joi.number().required(),
  room_number: Joi.string().trim().required(),
  floor: Joi.number().optional(),
});

export const updateRoomSchema = Joi.object({
  room_number: Joi.string().trim().optional(),
  floor: Joi.number().optional(),
});