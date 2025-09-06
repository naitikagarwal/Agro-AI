"use client";

import { getUser } from "@/lib/action/getUser";
import { redirect } from "next/navigation";
import { useEffect, useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { AppSidebar } from "@/components/app-sidebar"

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
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-1/6"></div>
        </div>
      </div>
    );
  }

  if (!userData) {
    redirect("/api/auth/signin");
  }


  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarTrigger />
      <div className="p-6">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Welcome back, {userData.id}!
            </h1>
            <p className="text-gray-600 mt-2">
              Good to see you again, @{userData.username}
            </p>
            
          </div>
        </div>

        {/* Rest of dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h2 className="text-xl font-semibold mb-4">Dashboard Stats</h2>
          </div>
        </div>
      </div>
    </SidebarProvider>
  );
}