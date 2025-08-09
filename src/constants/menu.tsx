import {
  LayoutDashboard,
  BookOpen,
  Users,
  BarChart3,
  Building2,
  UserCog,
  LogOut,
  Star,
} from "lucide-react";
import { LuVideo } from "react-icons/lu";

const Menu = [
  {
    label: "Application",
    items: [
      {
        label: "Dashboard",
        icon: <LayoutDashboard size={18} />,
        link: "/teacher/dashboard",
      },
      {
        label: "Test Series",
        icon: <BookOpen size={18} />,
        link: "/teacher/test-series",
      },
      {
        label: "Courses",
        icon: <LuVideo size={18} />,
        link: "/teacher/courses",
        badge: "NEW",
      },
    ],
  },
  {
    label: "Students",
    items: [
      {
        label: "Students",
        icon: <Users size={18} />,
        link: "/teacher/students",
      },
      {
        label: "Reports",
        icon: <BarChart3 size={18} />,
        link: "/teacher/reports",
      },
      {
        label: "Reviews",
        icon: <Star size={18} />,
        link: "/teacher/reviews",
      },
    ],
  },
  {
    label: "Management",
    items: [
      {
        label: "Edit Academy",
        icon: <Building2 size={18} />,
        link: "/teacher/edit-academy",
      },
      {
        label: "Edit Profile",
        icon: <UserCog size={18} />,
        link: "/teacher/edit-profile",
      },
    ],
  },
];

export const Logout = { label: "Logout", icon: <LogOut size={16} /> };

export default Menu;
