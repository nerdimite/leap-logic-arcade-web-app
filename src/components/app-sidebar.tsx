"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

// Updated navigation data with proper paths
const data = {
  navTop: [
    {
      title: "127.0.0.1",
      path: "/dashboard",
    },
  ],
  navMain: [
    {
      title: "Pic Perfect Challenge",
      items: [
        {
          title: "Submit",
          path: "/dashboard/pic-perfect/submit",
        },
        {
          title: "Vote",
          path: "/dashboard/pic-perfect/vote",
        },
        {
          title: "Leaderboard",
          path: "/dashboard/pic-perfect/leaderboard",
        },
      ],
    },
    {
      title: "P.U.B.G. Challenge",
      items: [
        {
          title: "Capture the Prompt",
          path: "/dashboard/pubg/capture",
        },
        {
          title: "Taskmaster",
          path: "/dashboard/pubg/taskmaster",
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const pathname = usePathname();

  return (
    <Sidebar {...props}>
      <SidebarHeader>
        <h1 className="p-2 text-lg font-bold font-press-start-2p text-primary">
          Logic Arcade
        </h1>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {data.navTop.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.path}
                    className="text-xl"
                  >
                    <Link href={item.path}>
                      {pathname === item.path ? (
                        <>
                          <span className="animate-caret-blink">&gt;_</span>{" "}
                          {item.title}
                        </>
                      ) : (
                        <>
                          <span className="text-primary">&gt;_</span>{" "}
                          {item.title}
                        </>
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
        {data.navMain.map((item) => (
          <SidebarGroup key={item.title}>
            <SidebarGroupLabel className="text-md">
              {item.title}
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {item.items.map((subItem) => (
                  <SidebarMenuItem key={subItem.title}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname === subItem.path}
                      className="text-xl"
                    >
                      <Link href={subItem.path}>
                        {pathname === subItem.path ? (
                          <>
                            <span className="animate-caret-blink">&gt;_</span>{" "}
                            {subItem.title}
                          </>
                        ) : (
                          <span className="text-primary">
                            &gt;_ {subItem.title}
                          </span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        ))}
      </SidebarContent>
      <SidebarRail />
    </Sidebar>
  );
}
