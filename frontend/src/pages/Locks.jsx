import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Button from "../components/Button";
import useAuthStore from "../store/AuthStore";
import { HiPencil, HiTrash } from "react-icons/hi";
import useModalStore from "../store/ModalStore";
import usePropertyStore from "../store/PropertyStore";

const Locks = () => {
  const { activeProperty } = usePropertyStore();
  const { token } = useAuthStore();
  const { openModal } = useModalStore();
  const queryClient = useQueryClient();

  // Fetch locks for the current property
  const fetchLocks = async () => {
    const res = await axios.get("https://room-lock-management-8vz7.vercel.app/locks", {
      headers: { Authorization: `Bearer ${token}` },
      params: { property_id: activeProperty?.id },
    });
    return res.data.locks;
  };

  const { data: locks = [], isLoading, isError } = useQuery({
    queryKey: ["locks", activeProperty?.id],
    queryFn: fetchLocks,
    enabled: !!token && !!activeProperty?.id,
  });

  // Delete lock
  const deleteMutation = useMutation({
    mutationFn: async (id) => {
      await axios.delete(`https://room-lock-management-8vz7.vercel.app/locks/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => queryClient.invalidateQueries(["locks"]),
  });

  if (isLoading) return <span>Loading Locks...</span>;
  if (isError) return <span>Error loading Locks</span>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Locks</h1>
        <div className="flex gap-2">
          <Button onClick={() => openModal("locks")}>Add Lock</Button>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2">Serial Number</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {locks.length === 0 ? (
              <tr>
                <td colSpan={3} className="py-10 text-center">
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <p className="text-lg font-medium">No locks found</p>
                    <button
                      className="mt-3 text-blue-600 hover:underline text-sm"
                      onClick={() => openModal("locks")}
                    >
                      + Add your first lock
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              locks.map((lock) => (
                <tr key={lock.id} className="border-b">
                  <td className="py-3">{lock.serial_number}</td>
                  <td>
                    {lock.room_lock_connection
                      ? `Assigned to Room ${lock.room_lock_connection.room_id}`
                      : "Unassigned"}
                  </td>
                  <td>
                    <div className="flex gap-2 items-center ml-3 lg:ml-0">
                      <button
                        onClick={() => openModal("locks", lock)}
                        className="flex items-center gap-1 text-blue-600 cursor-pointer"
                      >
                        <HiPencil className="text-lg" />
                        <span className="hidden lg:inline">Edit</span>
                      </button>

                      <button
                        onClick={() => {
                          if (
                            window.confirm(
                              "Are you sure you want to delete this lock?"
                            )
                          ) {
                            deleteMutation.mutate(lock.id);
                          }
                        }}
                        className="flex items-center gap-1 text-red-600 cursor-pointer"
                      >
                        <HiTrash className="text-lg" />
                        <span className="hidden lg:inline">Delete</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Locks;