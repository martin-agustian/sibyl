import { uniqueId } from "lodash";
import { IconChecklist, IconLayoutDashboard } from "@tabler/icons-react";

import { UserRole } from "@/commons/type";
import { UserRoleEnum } from "@/commons/enum";

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
      href: role === UserRoleEnum.CLIENT ? "/client/dashboard" : "/lawyer/marketplace",
    },
  ];

  if (role === UserRoleEnum.LAWYER) {
    menu.push({
      id: uniqueId(),
      title: "My Quotes",
      icon: IconChecklist,
      href: "/lawyer/my-quotes",
    })
  }

  return menu;
};
