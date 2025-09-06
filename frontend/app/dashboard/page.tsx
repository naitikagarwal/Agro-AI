"use client";

import { getUser } from "@/lib/action/getUser";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import DashboardHome from "@/components/dashboard-home";
import { AppSidebarClient } from "@/components/AppSidebarClient";

interface User {
  id: string;
  fullName: string;
  username: string;
  email: string;
}

export default function Dashboard() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await getUser();
      setUserData(res.user);
      console.log(res.user);
      setLoading(false);
    }
    fetchUser();
  }, []);

  if (loading) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-gray-50">
        <div className="w-64 h-1 bg-gray-200 overflow-hidden relative rounded">
          <div className="absolute left-0 top-0 h-full w-1/3 bg-emerald-500 animate-[slide_1.5s_linear_infinite]"></div>
        </div>
        <style>
          {`
      @keyframes slide {
        0% { left: -33%; }
        50% { left: 50%; }
        100% { left: 100%; }
      }
    `}
        </style>
      </div>
    );
  }

  if (!userData) {
    // redirect("/api/auth/signin");
  }

  const fields = userData?.Fields ?? [];

  return (
    <div className="!bg-white">
      <SidebarProvider>
        <AppSidebarClient fields={fields} />

        <SidebarInset className="flex flex-col">
          <SidebarTrigger className="cursor-pointer" />

          <DashboardHome></DashboardHome>
        </SidebarInset>
      </SidebarProvider>
    </div>
  );
}
