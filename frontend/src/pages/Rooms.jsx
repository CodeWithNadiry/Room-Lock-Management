import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { HiPencil, HiTrash } from "react-icons/hi";
import Button from "../components/Button";
import useModalStore from "../store/ModalStore";
import useAuthStore from "../store/AuthStore";
import usePropertyStore from "../store/PropertyStore"; // ✅ import property store

const Rooms = () => {
  const { openModal } = useModalStore();
  const { activeProperty } = usePropertyStore(); // ✅ get active property here
  const { role, user, token } = useAuthStore();
  const queryClient = useQueryClient();

  // Determine propertyId for fetching rooms
  const propertyId = role === "staff" ? user?.property_id : activeProperty?.id;

  // Fetch rooms
  const fetchRooms = async () => {
    if (!propertyId) return [];
    const res = await axios.get("https://room-lock-management-8vz7.vercel.app/rooms", {
      headers: { Authorization: `Bearer ${token}` },
      params: { property_id: propertyId },
    });
    return res.data.rooms;
  };

  const { data: rooms = [], isLoading, isError } = useQuery({
    queryKey: ["rooms", propertyId],
    queryFn: fetchRooms,
    enabled: !!token && !!propertyId, // ✅ only fetch if propertyId exists
  });

  // Delete room mutation
  const deleteRoomMutation = useMutation({
    mutationFn: async (roomId) => {
      await axios.delete(`https://room-lock-management-8vz7.vercel.app/rooms/${roomId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["rooms", propertyId]);
    },
  });

  const handleDeleteRoom = (roomId) => {
    if (window.confirm("Are you sure you want to delete this room?")) {
      deleteRoomMutation.mutate(roomId);
    }
  };

  if (isLoading) return <span>Loading Rooms...</span>;
  if (isError) return <span>Error loading Rooms</span>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Rooms</h1>
        {role !== "staff" && (
          <Button onClick={() => openModal("rooms")}>Add Room</Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2 w-1/6 truncate">Property ID</th>
              <th className="w-1/4">Room No.</th>
              <th className="w-1/4">Floor</th>
              {role !== "staff" && <th className="w-1/6">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {rooms.length === 0 ? (
              <tr>
                <td colSpan={role !== "staff" ? 4 : 3} className="py-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <p className="text-lg font-medium">No rooms found</p>
                    <p className="text-sm">
                      There are no rooms available for this property.
                    </p>
                    {role !== "staff" && (
                      <button
                        onClick={() => openModal("rooms")}
                        className="mt-3 text-blue-600 hover:underline text-sm"
                      >
                        + Add your first room
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              rooms.map((room) => (
                <tr key={room.id} className="border-b">
                  <td className="py-3">{room.property_id ?? "N/A"}</td>
                  <td>{room.room_number}</td>
                  <td>{room.floor ?? "N/A"}</td>
                  {role !== "staff" && (
                    <td>
                      <div className="flex gap-2 items-center ml-3 lg:ml-0">
                        <button
                          onClick={() => openModal("rooms", room)}
                          className="flex items-center gap-1 text-blue-600 cursor-pointer"
                        >
                          <HiPencil className="text-lg" />
                          <span className="hidden lg:inline">Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteRoom(room.id)}
                          className="flex items-center gap-1 text-red-600 cursor-pointer"
                        >
                          <HiTrash className="text-lg" />
                          <span className="hidden lg:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Rooms;