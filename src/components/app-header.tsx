"use client";
import * as React from "react";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { UserButton, useUser } from "@clerk/nextjs";

// Helper function to get breadcrumb info from pathname
function getBreadcrumbInfo(pathname: string) {
  const segments = pathname.split("/").filter(Boolean);

  // Default values
  let title = "Dashboard";
  let subtitle = "";
  let titleHref = "/dashboard";

  if (segments.includes("pic-perfect")) {
    title = "Pic Perfect Challenge";
    titleHref = "/dashboard/pic-perfect";
    subtitle =
      segments[segments.length - 1].charAt(0).toUpperCase() +
      segments[segments.length - 1].slice(1);
  } else if (segments.includes("pubg")) {
    title = "P.U.B.G. Challenge";
    titleHref = "/dashboard/pubg";
    subtitle =
      segments[segments.length - 1] === "capture"
        ? "Capture the Prompt"
        : "Taskmaster";
  }

  return { title, subtitle, titleHref };
}

export function AppHeader({ ...props }: React.HTMLAttributes<HTMLElement>) {
  const pathname = usePathname();
  const { title, subtitle, titleHref } = getBreadcrumbInfo(pathname);
  const { user } = useUser();

  return (
    <header
      className="flex h-16 shrink-0 items-center justify-between gap-2 border-b px-4"
      {...props}
    >
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mr-2 data-[orientation=vertical]:h-4"
        />
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem className="hidden md:block">
              <BreadcrumbLink href={titleHref} className="text-primary text-lg">
                {title}
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator className="hidden md:block" />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-secondary text-lg">
                {subtitle}
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className="flex items-center gap-4">
        <div className=" bg-card border border-border rounded-md px-2 py-1">
          <span className="text-sm text-secondary">Logged in as: </span>
          <span className="text-md text-secondary font-extrabold">
            {user?.username}
          </span>
        </div>
        <UserButton />
      </div>
    </header>
  );
}
