import { useEffect, useState } from "react";
import axios from "axios";
import { useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";
import Input from "../components/Input";
import Button from "../components/Button";

const RoomForm = ({ data }) => {
  const { token } = useAuthStore();
  const { closeModal } = useModalStore();
  const queryClient = useQueryClient();
  const isEdit = !!data;

  const [propertyId, setPropertyId] = useState("");
  const [roomNumber, setRoomNumber] = useState("");
  const [floor, setFloor] = useState("");
  const [error, setError] = useState(null);

  // Prefill form if editing
  useEffect(() => {
    if (data) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPropertyId(data.property_id ?? "");
      setRoomNumber(data.room_number ?? "");
      setFloor(data.floor ?? "");
    }
  }, [data]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!roomNumber.trim()) {
      setError("Room number is required");
      return;
    }

    try {
      const payload = {
        property_id: propertyId ? Number(propertyId) : null,
        room_number: roomNumber,
        floor: floor ? Number(floor) : null,
      };

      if (isEdit) {
        await axios.patch(`https://room-lock-management-8vz7.vercel.app//rooms/${data.id}`, payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await axios.post("https://room-lock-management-8vz7.vercel.app//rooms", payload, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }

      queryClient.invalidateQueries(["rooms"]);
      closeModal();
    } catch (err) {
      console.error(err.response?.data || err.message);
      setError(err.response?.data?.message || "Error saving room");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="text-xl font-bold text-center">
        {isEdit ? "Edit Room" : "Add Room"}
      </h2>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <Input
        label="Property ID (optional)"
        type="number"
        value={propertyId}
        onChange={(e) => setPropertyId(e.target.value)}
        placeholder="Enter property ID or leave empty"
      />

      <Input
        label="Room Number"
        type="text"
        value={roomNumber}
        onChange={(e) => setRoomNumber(e.target.value)}
        placeholder="Enter room number"
        required
      />

      <Input
        label="Floor (optional)"
        type="number"
        value={floor}
        onChange={(e) => setFloor(e.target.value)}
        placeholder="Enter floor"
      />

      <div className="flex gap-4 mt-5">
        <Button type="submit">{isEdit ? "Update" : "Add"}</Button>
        <Button type="button" variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
      </div>
    </form>
  );
};

export default RoomForm;