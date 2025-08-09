"use client";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "../ui/button";
import { deleteCookie, getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
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
import Image from "next/image";
import { AuthResponse } from "@/actions/auth";
import { useEffect, useState } from "react";

const AppSidebar = () => {
  const [user, setUser] = useState<AuthResponse["data"] | null>(null);
  const router = useRouter();
  const { state } = useSidebar();

  useEffect(() => {
    const userCookie = getCookie("tkuser");
    const userLocal = userCookie
      ? (JSON.parse(userCookie as string) as AuthResponse["data"])
      : null;

    setUser(userLocal);
  }, []);

  const logout = () => {
    deleteCookie("tktoken");
    deleteCookie("tkuser");

    router.push("/auth/login");
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Image
          src={
            state === "expanded"
              ? "/static/app-logo-full.png"
              : "/static/logo.png"
          }
          alt="Testkart Logo"
          width={900}
          height={300}
          className="h-16 object-contain"
        />
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Application</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/teacher/dashboard"
                    className="flex items-center gap-2"
                  >
                    <LayoutDashboard size={18} />
                    Dashboard
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/teacher/test-series"
                    className="flex items-center gap-2"
                  >
                    <BookOpen size={18} />
                    Test Series
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/teacher/courses"
                    className="flex items-center gap-2"
                  >
                    <LuVideo size={18} />
                    Courses
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Students</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/teacher/students"
                    className="flex items-center gap-2"
                  >
                    <Users size={18} />
                    Students
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/teacher/reports"
                    className="flex items-center gap-2"
                  >
                    <BarChart3 size={18} />
                    Reports
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/teacher/reviews"
                    className="flex items-center gap-2"
                  >
                    <Star size={18} />
                    Reviews
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/teacher/edit-academy"
                    className="flex items-center gap-2"
                  >
                    <Building2 size={18} />
                    Edit Academy
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link
                    href="/teacher/edit-profile"
                    className="flex items-center gap-2"
                  >
                    <UserCog size={18} />
                    Edit Profile
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem className="flex flex-col p-2 bg-gray-100 rounded-lg">
            <span className="text-xs">Logged In as</span>
            <span className="text-base font-medium">
              {user?.user?.academy?.academy_name || ""}
            </span>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button
                variant={"destructive"}
                onClick={logout}
                className="flex items-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
