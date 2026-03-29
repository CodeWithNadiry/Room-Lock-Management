import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import Button from "../components/Button";
import usePropertyStore from "../store/PropertyStore";
import useAuthStore from "../store/AuthStore";
import useModalStore from "../store/ModalStore";

const Users = () => {
  const { openModal } = useModalStore();
  const { activeProperty } = usePropertyStore();

  // ✅ Proper selectors from Zustand so component re-renders when role/token change
  const token = useAuthStore((state) => state.token);
  const role = useAuthStore((state) => state.role);

  const queryClient = useQueryClient();
  const propertyId = activeProperty?.id;

  console.log("User role:", role);

  // Fetch users for the active property
  const fetchUsers = async () => {
    const res = await axios.get(
      "https://room-lock-management-eqw4.vercel.app/users",
      {
        headers: { Authorization: `Bearer ${token}` },
        params: { property_id: propertyId },
      }
    );
    return res.data.users;
  };

  const { data: users = [], isLoading, isError } = useQuery({
    queryKey: ["users", propertyId],
    queryFn: fetchUsers,
    enabled: !!propertyId && !!token,
  });

  // Mutation to delete a user
  const deleteUserMutation = useMutation({
    mutationFn: async (userId) => {
      await axios.delete(
        `https://room-lock-management-eqw4.vercel.app/users/${userId}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["users", propertyId] });
    },
  });

  const handleDeleteUser = (userId) => {
    if (window.confirm("Are you sure you want to delete this user?")) {
      deleteUserMutation.mutate(userId);
    }
  };

  if (isLoading) return <span>Loading Users...</span>;
  if (isError) return <span>Error loading Users</span>;

  const isSuperAdmin = role?.toLowerCase() === "superadmin";

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Users</h1>

        {isSuperAdmin && (
          <Button onClick={() => openModal("users")}>Add User</Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6 overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2">Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              {isSuperAdmin && <th>Actions</th>}
            </tr>
          </thead>

          <tbody>
            {users.length === 0 ? (
              <tr>
                <td
                  colSpan={isSuperAdmin ? 5 : 4}
                  className="py-10 text-center"
                >
                  <div className="flex flex-col items-center gap-2 text-gray-500">
                    <p className="text-lg font-medium">No users found</p>
                    <p className="text-sm">
                      There are no users assigned to this property yet.
                    </p>

                    {isSuperAdmin && (
                      <button
                        onClick={() => openModal("users")}
                        className="mt-3 text-blue-600 hover:underline text-sm"
                      >
                        + Add your first user
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b">
                  <td className="py-3">{user.name}</td>
                  <td className="truncate">{user.email}</td>
                  <td className="capitalize">{user.role}</td>
                  <td>
                    <span
                      className={`px-2 py-1 rounded text-xs ${
                        user.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.is_active ? "Active" : "Inactive"}
                    </span>
                  </td>

                  {isSuperAdmin && (
                    <td>
                      <div className="flex gap-3 items-center">
                        <button
                          onClick={() => openModal("users", user)}
                          className="text-blue-600"
                        >
                          Edit
                        </button>

                        <button
                          onClick={() => handleDeleteUser(user.id)}
                          disabled={deleteUserMutation.isPending}
                          className="text-red-600 disabled:opacity-50"
                        >
                          {deleteUserMutation.isPending
                            ? "Deleting..."
                            : "Delete"}
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

export default Users;