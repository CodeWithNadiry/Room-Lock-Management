import { LuDoorOpen, LuLayoutDashboard, LuLink, LuLock } from "react-icons/lu";
import BaseLayout from "./BaseLayout";

const links = [
  { label: "Dashboard", to: "dashboard", icon: LuLayoutDashboard },
  { label: "Rooms", to: "rooms", icon: LuDoorOpen },
  { label: "Locks", to: "locks", icon: LuLock },
];
const StaffLayout = () => {
  return <BaseLayout links={links} />;
};

export default StaffLayout;