import { DataTypes } from "sequelize";
import sequelize from "../config/connectDB.js";
import Property from "./property.model.js";

const Room = sequelize.define(
  "Room",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    property_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: Property,
        key: "id",
      },
    },
    room_number: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    floor: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    created_at: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "rooms",
    timestamps: false,
  }
);

Room.belongsTo(Property, { foreignKey: "property_id" });
Property.hasMany(Room, { foreignKey: "property_id" });

export default Room;