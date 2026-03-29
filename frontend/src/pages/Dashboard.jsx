import { HiHome, HiOutlineLockClosed, HiUsers } from "react-icons/hi";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import StatsList from "../components/StatsList";
import useAuthStore from "../store/AuthStore";
import usePropertyStore from "../store/PropertyStore";
import Rooms from "./Rooms";
import Users from "./Users";
import Locks from "./Locks";

function Dashboard() {
  const { role, token } = useAuthStore();
  const { activeProperty } = usePropertyStore();

  const propertyId = activeProperty?.id;

  const fetchStats = async () => {
    if (!propertyId) return {};

    const res = await axios.get("http://localhost:5000/dashboard-stats", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        property_id: propertyId,
      },
    });

    return res.data;
  };

  const { data = {} } = useQuery({
    queryKey: ["dashboard-stats", propertyId],
    queryFn: fetchStats,
    enabled: !!propertyId,
  });

  const stats = [
    {
      title: "Total Rooms",
      quantity: data.totalRooms || 0,
      icon: HiHome,
      to: "../rooms",
      show: true,
    },
    {
      title: "Total Locks",
      quantity: data.totalLocks || 0,
      icon: HiOutlineLockClosed,
      to: "../locks",
      show: true,
    },
    {
      title: "Total Users",
      quantity: data.totalUsers || 0,
      icon: HiUsers,
      to: "../users",
      show: true,
    },
  ];
  return (
    <div className="flex flex-col gap-8">
      <StatsList stats={stats} />

      <Rooms />
      {role !== "staff" && <Users />}
      <Locks />
    </div>
  );
}

export default Dashboard;
