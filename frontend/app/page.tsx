"use client";
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { redirect } from "next/navigation";
import Link from "next/link";
import { getUser } from "@/lib/action/getUser";
import { LayoutDashboard } from "lucide-react";

// Landing page component for the AI-powered agriculture platform
// Built with Tailwind + shadcn components. Drop this file into a React/Vite app.

export default function Home() {
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

  return (
    <div className="min-h-scree text-slate-900">
      {/* Header */}
      <header className="max-w-7xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
            AI
          </div>
          <div>
            <h1 className="text-lg font-semibold">AgroAI</h1>
            <p className="text-xs text-slate-500 -mt-0.5">
              Precision & predictive crop intelligence
            </p>
          </div>
        </div>

        <nav className="flex items-center gap-4">
          <a className="text-sm text-slate-600 hover:text-slate-900">
            Features
          </a>
          <a className="text-sm text-slate-600 hover:text-slate-900">
            How it works
          </a>
          <a className="text-sm text-slate-600 hover:text-slate-900">Pricing</a>
          {userData ? (
            <Link href="/dashboard">
              <Button size="sm" className="cursor-pointer">
                <LayoutDashboard className="w-4 h-4" />
                Dashboard
              </Button>
            </Link>
          ) : (
            <div className="flex gap-2">
              <Link href="/api/auth/signin">
                <Button variant="ghost" size="sm" className="cursor-pointer">
                  Sign in
                </Button>
              </Link>
              <Link href="/signup">
                <Button size="sm" className="cursor-pointer">
                  Sign up
                </Button>
              </Link>
            </div>
          )}
        </nav>
      </header>

      {/* Hero */}
      <main className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        <section>
          <Badge className="mb-4">New · AI-driven</Badge>
          <h2 className="text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight text-slate-900">
            From hyperspectral images to field-level action
          </h2>
          <p className="mt-4 text-lg text-slate-600">
            AgroAI fuses hyperspectral & multispectral imaging with on-field
            sensors to detect vegetation stress, predict pest outbreaks, and
            deliver localized alerts so you can act before losses occur.
          </p>

          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="text-sm">
              <div className="text-emerald-600 font-semibold">97%</div>
              <div className="text-slate-500">Detection accuracy</div>
            </div>
            <div className="text-sm">
              <div className="text-emerald-600 font-semibold">Real-time</div>
              <div className="text-slate-500">Field alerts</div>
            </div>
            <div className="text-sm">
              <div className="text-emerald-600 font-semibold">LSTM + CNN</div>
              <div className="text-slate-500">Temporal & spatial models</div>
            </div>
            <div className="text-sm">
              <div className="text-emerald-600 font-semibold">Mobile</div>
              <div className="text-slate-500">Push notifications</div>
            </div>
          </div>
        </section>

        {/* Visual / dashboard mock */}
        <section className="order-first lg:order-last">
          <div className="rounded-2xl shadow-lg overflow-hidden border border-slate-100">
            {/* Mock dashboard - replace with real screenshot */}
            <div className="bg-gradient-to-b from-emerald-50 to-white p-6">
              <div className="rounded-lg bg-white p-6 shadow-sm">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="font-semibold">Field Health — Sector 12</h3>
                    <p className="text-sm text-slate-500">Updated 12 min ago</p>
                  </div>
                  <div className="text-sm text-slate-600">NDVI heatmap</div>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="h-40 bg-emerald-100 rounded-lg flex items-center justify-center text-emerald-700">
                    Spectral map
                  </div>
                  <div className="h-40 bg-emerald-50 rounded-lg p-3">
                    <p className="text-sm text-slate-600">
                      Soil moisture: <strong>23%</strong>
                    </p>
                    <p className="text-sm text-slate-600">
                      Air temp: <strong>28°C</strong>
                    </p>
                    <p className="text-sm text-slate-600">
                      Leaf wetness: <strong>Low</strong>
                    </p>

                    <div className="mt-3 grid grid-cols-2 gap-2">
                      <div className="rounded-md bg-white border p-2 text-xs text-slate-600">
                        Anomaly: Patch A
                      </div>
                      <div className="rounded-md bg-white border p-2 text-xs text-slate-600">
                        Risk: Medium
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 text-right">
                  <Button variant="ghost" size="sm">
                    Open full dashboard
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Features */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold">What AgroAI does</h3>
        <p className="text-slate-600 mt-2">
          A unified platform that combines spectral imaging, environmental
          sensors and AI models to give actionable, localized insights.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <h4 className="font-semibold">
                Hyperspectral & Multispectral Processing
              </h4>
            </CardHeader>
            <CardContent>
              Ingest HDR Image,extracts spctral bands and indices (NDVI, GNDVI,
              SAVI) and soil signatures for deep analysis.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h4 className="font-semibold">Sensor Fusion & Context</h4>
            </CardHeader>
            <CardContent>
              Fuse soil moisture, temperature, humidity, and leaf wetness with
              image features to improve temporal predictions and reduce false
              positives.
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <h4 className="font-semibold">AI Models & Alerts</h4>
            </CardHeader>
            <CardContent>
              LSTM for temporal trends, CNN for spatial patterns. Zone-specific
              alerts with recommended interventions and estimated yield impact.
            </CardContent>
          </Card>
        </div>
      </section>

      {/* How it works */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <h3 className="text-2xl font-bold">How it works</h3>
        <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 border rounded-lg">
            <div className="text-emerald-600 font-bold text-xl">1</div>
            <h4 className="font-semibold mt-2">Ingest</h4>
            <p className="text-slate-600 mt-2">
              Upload drone/ satellite multispectral & hyperspectral images and
              connect field sensors.
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="text-emerald-600 font-bold text-xl">2</div>
            <h4 className="font-semibold mt-2">Analyze</h4>
            <p className="text-slate-600 mt-2">
              Extract vegetation indices, run CNN/LSTM pipelines, and fuse
              sensor streams for context-aware insights.
            </p>
          </div>

          <div className="p-6 border rounded-lg">
            <div className="text-emerald-600 font-bold text-xl">3</div>
            <h4 className="font-semibold mt-2">Act</h4>
            <p className="text-slate-600 mt-2">
              Receive zone-specific alerts, field reports, and mobile
              notifications to apply targeted interventions.
            </p>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-6 py-12">
        <div className="rounded-2xl bg-emerald-50 p-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl font-bold">Ready to protect your yield?</h3>
            <p className="text-slate-600 mt-1">
              Start with a free trial or request a custom demo for large
              estates.
            </p>
          </div>
          <div className="flex gap-3">
            <Button size="lg">Start free trial</Button>
            <Button variant="ghost" size="lg">
              Contact sales
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-6 py-8 text-sm text-slate-500">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div>
            © {new Date().getFullYear()} AgroAI — Built for sustainable,
            precision agriculture
          </div>
          <div className="flex gap-4">
            <a>Privacy</a>
            <a>Terms</a>
            <a>Contact</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
