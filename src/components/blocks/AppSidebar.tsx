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
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Button } from "../ui/button";
import { deleteCookie, getCookie } from "cookies-next/client";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { AuthResponse } from "@/actions/auth";
import { useEffect, useState } from "react";
import Menu, { Logout } from "@/constants/menu";

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
        {Menu.map((group, gid) => (
          <SidebarGroup key={gid}>
            <SidebarGroupLabel>{group.label}</SidebarGroupLabel>
            <SidebarGroupContent>
              {group.items.map((item, iid) => (
                <SidebarMenu key={iid}>
                  <SidebarMenuItem>
                    <SidebarMenuButton asChild>
                      <Link
                        href={item.link}
                        className="flex items-center gap-2"
                      >
                        {item.icon}
                        {item.label}
                      </Link>
                    </SidebarMenuButton>
                    {item?.badge && (
                      <SidebarMenuBadge className="bg-primary px-2">
                        <span className="text-white">{item.badge}</span>
                      </SidebarMenuBadge>
                    )}
                  </SidebarMenuItem>
                </SidebarMenu>
              ))}
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          {state === "expanded" && (
            <SidebarMenuItem className="flex flex-col p-2 bg-gray-100 rounded-lg">
              <span className="text-xs">Logged In as</span>
              <span className="text-base font-medium">
                {user?.user?.academy?.academy_name || ""}
              </span>
            </SidebarMenuItem>
          )}
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <Button variant={"destructive"} onClick={logout}>
                {Logout.icon}
                {state === "expanded" && Logout.label}
              </Button>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default AppSidebar;
