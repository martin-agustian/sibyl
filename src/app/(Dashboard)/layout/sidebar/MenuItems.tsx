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
      href: 
        role === UserRoleEnum.ADMIN ? process.env.NEXT_PUBLIC_DASHBOARD_ADMIN_PATH :
        role === UserRoleEnum.CLIENT ? process.env.NEXT_PUBLIC_DASHBOARD_CLIENT_PATH :
        process.env.NEXT_PUBLIC_DASHBOARD_LAWYER_PATH
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

  if (role === UserRoleEnum.ADMIN) {
    menu.push({
      id: uniqueId(),
      title: "Cases",
      icon: IconChecklist,
      href: "/admin/cases",
    })
  }

  return menu;
};
