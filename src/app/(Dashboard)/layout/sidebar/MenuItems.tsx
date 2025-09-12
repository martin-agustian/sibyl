import { uniqueId } from "lodash";
import { IconChecklist, IconLayoutDashboard } from "@tabler/icons-react";

import { UserRole } from "@/commons/type";

export const getMenuItems = (role: UserRole) => {
  const menu = [
    {
      navlabel: true,
      subheader: "HOME",
    },
    {
      id: uniqueId(),
      title: "Dashboard",
      icon: IconLayoutDashboard,
      href: role === "CLIENT" ? "/client/dashboard" : "/lawyer/marketplace",
    },
  ];

  if (role === "LAWYER") {
    menu.push({
      id: uniqueId(),
      title: "My Quotes",
      icon: IconChecklist,
      href: "/lawyer/my-quotes",
    })
  }

  return menu;
};
