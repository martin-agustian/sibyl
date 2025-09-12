import { uniqueId } from "lodash";
import { IconLayoutDashboard } from "@tabler/icons-react";

import { UserRole } from "@/commons/type";

export const getMenuItems = (role: UserRole) => {
  const dashboardHref =
    role === "CLIENT" ? "/client/dashboard" : "/lawyer/marketplace";

  return [
    {
      navlabel: true,
      subheader: "HOME",
    },
    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: dashboardHref,
    },
  ];
};
