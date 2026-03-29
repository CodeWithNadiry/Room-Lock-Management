import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";
import Button from "../components/Button";
import RoomLockForm from "../forms/RoomLockForm";

const Connections = () => {
  const { token } = useAuthStore();
  const { openModal } = useModalStore();
  const queryClient = useQueryClient();

  const { data: connections, isLoading, error } = useQuery({
    queryKey: ["roomLocks"],
    queryFn: async () => {
      const res = await axios.get("https://room-lock-management-8vz7.vercel.app//room-lock", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    },
  });

  const handleUnassign = async (lockId) => {
    try {
      await axios.post(
        "https://room-lock-management-8vz7.vercel.app//room-lock/unassign",
        { lock_id: lockId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      queryClient.invalidateQueries(["roomLocks"]);
    } catch (err) {
      alert(err.response?.data?.message || "Error unassigning lock");
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error loading connections</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Room-Lock Connections</h1>
      <Button onClick={() => openModal('connections')}>Assign Lock</Button>

      <table className="w-full mt-5 border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-200">
            <th className="border border-gray-300 p-2">Room ID</th>
            <th className="border border-gray-300 p-2">Lock ID</th>
            <th className="border border-gray-300 p-2">Property ID</th>
            <th className="border border-gray-300 p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {connections?.map((conn) => (
            <tr key={conn.id}>
              <td className="border border-gray-300 p-2">{conn.room_id}</td>
              <td className="border border-gray-300 p-2">{conn.lock_id}</td>
              <td className="border border-gray-300 p-2">{conn.property_id}</td>
              <td className="border border-gray-300 p-2 flex gap-2">
                <Button
                  onClick={() => openModal('connections', conn)}
                  variant="secondary"
                >
                  Edit
                </Button>
                <Button
                  onClick={() => handleUnassign(conn.lock_id)}
                  variant="danger"
                >
                  Unassign
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Connections;