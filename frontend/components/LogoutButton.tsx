"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button"; // if using shadcn/ui, else replace with normal <button>

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })} // redirect to home after logout
      className="rounded-2xl px-4 py-2 bg-red-500 text-white hover:bg-red-600"
    >
      Logout
    </Button>
  );
}
