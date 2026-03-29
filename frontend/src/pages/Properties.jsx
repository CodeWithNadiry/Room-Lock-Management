import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { HiPencil, HiTrash } from "react-icons/hi";
import Button from "../components/Button";
import useModalStore from "../store/ModalStore";
import useAuthStore from "../store/AuthStore";

async function fetchProperties(token) {
  const response = await axios.get("https://room-lock-management-8vz7.vercel.app//properties", {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data.properties;
}

const Properties = () => {
  const { openModal } = useModalStore();
  const { token, role } = useAuthStore();
  const queryClient = useQueryClient();

  const { data: properties = [], isLoading, isError } = useQuery({
    queryKey: ["properties"],
    queryFn: () => fetchProperties(token),
    enabled: !!token,
  });

  const deletePropertyMutation = useMutation({
    mutationFn: async (propertyId) => {
      await axios.delete(`https://room-lock-management-8vz7.vercel.app//properties/${propertyId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries(["properties"]);
    },
  });

  const handleDeleteProperty = (propertyId) => {
    if (window.confirm("Are you sure you want to delete this property?")) {
      deletePropertyMutation.mutate(propertyId);
    }
  };

  if (isLoading) return <span>Loading properties...</span>;
  if (isError) return <span>Error loading properties</span>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Properties</h1>

        {role === "superadmin" && (
          <Button onClick={() => openModal("properties")}>Add Property</Button>
        )}
      </div>

      <div className="bg-white rounded-xl shadow p-6">
        <table className="w-full table-fixed text-left">
          <thead>
            <tr className="border-b text-gray-500 text-sm">
              <th className="py-2 w-1/6">Property ID</th>
              <th className="py-2 w-1/3">Name</th>
              <th className="w-1/3">Created</th>
              {role === "superadmin" && <th className="w-1/6">Actions</th>}
            </tr>
          </thead>

          <tbody>
            {properties
              .sort((a, b) => a.id - b.id)
              .map(({ id, name, created_at }, index) => (
                <tr key={id} className="border-b">
                  <td className="py-3">{index + 1}</td>
                  <td className="py-3 truncate">{name}</td>
                  <td>{new Date(created_at).toLocaleDateString()}</td>

                  {role === "superadmin" && (
                    <td>
                      <div className="flex gap-2 items-center ml-3 lg:ml-0">
                        <button
                          onClick={() =>
                            openModal("properties", { id, name })
                          }
                          className="flex items-center gap-1 text-blue-600 cursor-pointer"
                        >
                          <HiPencil className="text-lg" />
                          <span className="hidden lg:inline">Edit</span>
                        </button>

                        <button
                          onClick={() => handleDeleteProperty(id)}
                          className="flex items-center gap-1 text-red-600 cursor-pointer"
                        >
                          <HiTrash className="text-lg" />
                          <span className="hidden lg:inline">Delete</span>
                        </button>
                      </div>
                    </td>
                  )}
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Properties;