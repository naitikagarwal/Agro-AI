"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { getUser } from "@/lib/action/getUser";

/* -------------------------
   Sample farmer data
   ------------------------- */
const farmer = {
  name: "Ravi Sharma",
  email: "ravi.sharma@example.com",
  phone: "+91 98765 43210",
  location: "Punjab, India",
  joined: "2022-03-14",
  fieldsOwned: 5,
  totalAcres: 120,
  avgHealth: 72,
  avgPestRisk: 18,
  bio: "Progressive farmer using AI-powered insights to maximize yield and minimize risk.",
};

/* -------------------------
   Components
   ------------------------- */

function StatCard({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center bg-white/80 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-emerald-50">
      <div className="text-2xl font-bold text-emerald-900">{value}</div>
      <div className="text-xs text-slate-500 mt-1">{label}</div>
    </div>
  );
}

/* -------------------------
   Page
   ------------------------- */

export default function ProfilePage() {
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchUser() {
      const res = await getUser();
      setUserData(res.user);
      console.log(res.user);
      setLoading(false);
      // console.log(userData);
    }
    fetchUser();
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Cover */}
      <div className="h-40 bg-emerald-700 relative">
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2">
          <div className="w-28 h-28 rounded-full bg-white border-4 border-white shadow-md flex items-center justify-center text-emerald-700 text-3xl font-bold">
            {userData ? <p>{userData.fullName[0]}</p> : <p>Loading...</p>}
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 pt-20 pb-10">
        {/* Profile Header */}
        <div className="text-center">
          <h1 className="text-2xl font-extrabold text-emerald-900">
            {userData ? <p>{userData.fullName}</p> : <p>Loading...</p>}
          </h1>

          <div className="mt-4 flex justify-center gap-3">
            <Link
              href="/overview"
              className="px-4 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium shadow-sm"
            >
              Dashboard
            </Link>
          </div>
        </div>

        {/* Stats
        <section className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8">
          <StatCard label="Fields Owned" value={farmer.fieldsOwned} />
          <StatCard label="Total Acres" value={`${farmer.totalAcres}`} />
          <StatCard label="Avg Health" value={`${farmer.avgHealth}%`} />
          <StatCard label="Avg Pest Risk" value={`${farmer.avgPestRisk}%`} />
        </section> */}

        {/* Contact Info */}
        <section className="bg-white mt-8 rounded-lg shadow-sm border border-emerald-50 p-6">
          <h2 className="text-lg font-semibold text-emerald-800 mb-4">
            Contact Information
          </h2>
          <div className="space-y-2 text-slate-700">
            <p>
              <span className="font-medium">Email:</span>
              {userData ? (
                <span> {userData.email}</span>
              ) : (
                <span>Loading...</span>
              )}
            </p>
            <p>
              <span className="font-medium">Username:</span>
              {userData ? (
                <span> {userData.username}</span>
              ) : (
                <span>Loading...</span>
              )}
            </p>
            <p>
              <p>Total Fields: {userData?.Fields?.length ?? 0}</p>
            </p>
          </div>
        </section>

        {/* Recent Activity */}
        {/* <section className="bg-white mt-8 rounded-lg shadow-sm border border-emerald-50 p-6">
          <h2 className="text-lg font-semibold text-emerald-800 mb-4">Recent Activity</h2>
          <ul className="space-y-3 text-sm text-slate-700">
            <li className="flex justify-between">
              <span>Uploaded sensor data for Field Beta</span>
              <span className="text-xs text-slate-500">2h ago</span>
            </li>
            <li className="flex justify-between">
              <span>Reviewed pest risk report</span>
              <span className="text-xs text-slate-500">1d ago</span>
            </li>
            <li className="flex justify-between">
              <span>Added new field "Field Epsilon"</span>
              <span className="text-xs text-slate-500">3d ago</span>
            </li>
          </ul>
        </section> */}
      </div>
    </div>
  );
}
