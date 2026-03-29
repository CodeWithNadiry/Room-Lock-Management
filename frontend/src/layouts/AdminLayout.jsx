import {
  LuLayoutDashboard,
  LuBuilding,
  LuDoorOpen,
  LuLock,
  LuUsers,
} from "react-icons/lu";
import BaseLayout from "./BaseLayout";
import ModalManager from "../components/ModalManager";

const links = [
  { label: "Dashboard", to: "dashboard", icon: LuLayoutDashboard },
  { label: "Properties", to: "properties", icon: LuBuilding },
  { label: "Rooms", to: "rooms", icon: LuDoorOpen },
  { label: "Locks", to: "locks", icon: LuLock },
  { label: "Users", to: "users", icon: LuUsers },
  { label: "Connections", to: "connections", icon: LuLock },
];

const AdminLayout = () => {
  return (
    <>
      <BaseLayout links={links} />
      <ModalManager />
    </>
  );
};

export default AdminLayout;