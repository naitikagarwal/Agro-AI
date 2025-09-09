"use client";

import React from "react";
import Link from "next/link";

/**
 * Overview page — high level summary (distinct from Report)
 * Shows:
 * - KPIs with thresholds (color-coded)
 * - global trend + risk distribution
 * - top risky fields with quick actions
 * - compact alerts
 */

/* -------------------------
   Sample data
   ------------------------- */
type Field = {
  id: number;
  name: string;
  location?: string;
  pestRisk: number;
  healthScore: number;
  lastSeen?: string;
};
const sampleFields: Field[] = [
  {
    id: 1,
    name: "Field Alpha",
    location: "Sector 12",
    pestRisk: 0.04,
    healthScore: 0.92,
    lastSeen: "2025-09-06",
  },
  {
    id: 2,
    name: "Field Beta",
    location: "Sector 5",
    pestRisk: 0.21,
    healthScore: 0.63,
    lastSeen: "2025-09-06",
  },
  {
    id: 3,
    name: "Field Gamma",
    location: "Sector 9",
    pestRisk: 0.33,
    healthScore: 0.48,
    lastSeen: "2025-09-05",
  },
  {
    id: 4,
    name: "Field Delta",
    location: "Sector 2",
    pestRisk: 0.12,
    healthScore: 0.75,
    lastSeen: "2025-09-06",
  },
  {
    id: 5,
    name: "Field Epsilon",
    location: "Sector 1",
    pestRisk: 0.41,
    healthScore: 0.38,
    lastSeen: "2025-09-05",
  },
];

const recentAlerts = [
  {
    id: "A101",
    fieldId: 5,
    type: "Pest Alert",
    time: "2025-09-06T07:45Z",
    severity: "High",
  },
  {
    id: "A100",
    fieldId: 3,
    type: "Water Stress",
    time: "2025-09-06T01:20Z",
    severity: "Medium",
  },
  {
    id: "A099",
    fieldId: 2,
    type: "Yellowing",
    time: "2025-09-05T21:10Z",
    severity: "Low",
  },
];

const recentTrend = [0.9, 0.88, 0.85, 0.82, 0.78, 0.72];

/* -------------------------
   UI Helpers
   ------------------------- */

function KPI({
  label,
  value,
  hint,
  color = "text-emerald-900",
  children,
}: {
  label: string;
  value: React.ReactNode;
  hint?: string;
  color?: string;
  children?: React.ReactNode;
}) {
  return (
    <div className="bg-white/70 backdrop-blur-sm rounded-lg p-4 shadow-sm border border-emerald-50">
      <div className="text-xs text-slate-600">{label}</div>
      <div className={`mt-2 text-2xl font-bold ${color}`}>{value}</div>
      {hint && <div className="text-xs text-slate-500 mt-1">{hint}</div>}
      {children && <div className="mt-2">{children}</div>}
    </div>
  );
}

function Sparkline({
  values,
  width = 120,
  height = 28,
}: {
  values: number[];
  width?: number;
  height?: number;
}) {
  const max = Math.max(...values, 1);
  const pts = values
    .map(
      (v, i) =>
        `${(i / (values.length - 1)) * width},${height - (v / max) * height}`,
    )
    .join(" ");
  return (
    <svg
      width={width}
      height={height}
      viewBox={`0 0 ${width} ${height}`}
      className="inline-block align-middle"
    >
      <polyline
        fill="none"
        stroke="#166534"
        strokeWidth={2}
        points={pts}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function Donut({ pct = 0.15, size = 72 }: { pct?: number; size?: number }) {
  const stroke = 10;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const dash = Math.min(Math.max(pct, 0), 1) * c;
  const remaining = c - dash;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`translate(${size / 2}, ${size / 2})`}>
        <circle r={r} fill="none" stroke="#ECFDF5" strokeWidth={stroke} />
        <circle
          r={r}
          fill="none"
          stroke="#16A34A"
          strokeWidth={stroke}
          strokeDasharray={`${dash} ${remaining}`}
          strokeLinecap="round"
          transform="rotate(-90)"
        />
        <text
          x="0"
          y="4"
          textAnchor="middle"
          fontSize={12}
          fontWeight={700}
          fill="#065F46"
        >
          {Math.round(pct * 100)}%
        </text>
      </g>
    </svg>
  );
}

function RiskBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const bg =
    value < 0.2
      ? "bg-emerald-200"
      : value < 0.4
        ? "bg-amber-200"
        : "bg-red-200";
  return (
    <div className="w-36 h-3 rounded bg-emerald-50 overflow-hidden">
      <div className={`${bg} h-full`} style={{ width: `${pct}%` }} />
    </div>
  );
}

function relativeTime(iso?: string) {
  if (!iso) return "-";
  const d = new Date(iso);
  const now = new Date();
  const diff = Math.floor((now.getTime() - d.getTime()) / 1000);
  if (diff < 60) return `${diff}s ago`;
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  return `${Math.floor(diff / 86400)}d ago`;
}

/* -------------------------
   Page component
   ------------------------- */

export default function OverviewPage() {
  const totalFields = sampleFields.length;
  const anomaliesPct = recentAlerts.length / Math.max(1, sampleFields.length);
  const avgHealth = Math.round(
    (sampleFields.reduce((s, f) => s + f.healthScore, 0) /
      sampleFields.length) *
      100,
  );
  const avgPest = Math.round(
    (sampleFields.reduce((s, f) => s + f.pestRisk, 0) / sampleFields.length) *
      100,
  );

  const topRiskFields = [...sampleFields]
    .sort((a, b) => b.pestRisk - a.pestRisk)
    .slice(0, 3);

  // KPI color thresholds
  const healthColor =
    avgHealth > 70
      ? "text-emerald-700"
      : avgHealth > 50
        ? "text-amber-600"
        : "text-red-600";
  const pestColor =
    avgPest < 20
      ? "text-emerald-700"
      : avgPest < 35
        ? "text-amber-600"
        : "text-red-600";

  return (
    <div className="min-h-screen p-6">
      <div className="max-w-5xl mx-auto">
        <header className="flex items-start justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-900">
              Overview
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              At-a-glance summary. Use Report for full details.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/report"
              className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium shadow-sm"
            >
              Open Report
            </Link>
            <button className="px-3 py-2 rounded-md border border-emerald-200 text-emerald-800 text-sm bg-white/70">
              Refresh
            </button>
          </div>
        </header>

        {/* KPI row */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <KPI
            label="Fields monitored"
            value={totalFields}
            hint="Active fields"
          />
          <KPI
            label="Avg crop health"
            value={`${avgHealth}%`}
            hint="Across monitored fields"
            color={healthColor}
          >
            <Sparkline values={recentTrend} />
          </KPI>
          <div className="bg-white/70 rounded-lg p-4 shadow-sm border border-emerald-50 flex items-center justify-between">
            <div>
              <div className="text-xs text-slate-600">Anomalies (recent)</div>
              <div className="text-2xl font-bold text-emerald-900">
                {recentAlerts.length}
              </div>
              <div className="text-xs text-slate-500 mt-1">Last 72 hours</div>
            </div>
            <div className="ml-4">
              <Donut pct={anomaliesPct} />
            </div>
          </div>
          <KPI
            label="Avg pest risk"
            value={`${avgPest}%`}
            hint="Higher = worse"
            color={pestColor}
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Top risk fields */}
          <div className="lg:col-span-1 space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-50">
              <h2 className="font-semibold text-emerald-800">
                Top risk fields
              </h2>
              <p className="text-xs text-slate-500 mt-1">
                Quick actions for highest pest risk
              </p>

              <div className="mt-3 space-y-3">
                {topRiskFields.map((f) => (
                  <div
                    key={f.id}
                    className="flex items-center justify-between p-3 rounded hover:bg-emerald-50"
                  >
                    <div>
                      <div className="font-medium text-emerald-900">
                        {f.name}
                      </div>
                      <div className="text-xs text-slate-500">{f.location}</div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right text-xs text-slate-600">
                        <div className="font-semibold">
                          {Math.round(f.pestRisk * 100)}%
                        </div>
                        <div className="text-xs text-slate-500">Pest risk</div>
                      </div>
                      <RiskBar value={f.pestRisk} />
                      {/* <Link href={`/fields/${f.id}`} className="text-sm text-emerald-700 font-medium">Open</Link>  use the whole box for route*/}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-50">
              <h3 className="font-semibold text-emerald-800">Quick actions</h3>
              <div className="mt-3 flex flex-col gap-2">
                <Link
                  href="/upload"
                  className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm text-center"
                >
                  Upload sensor data
                </Link>
                {/* <Link href="/report" className="px-3 py-2 rounded-md border border-emerald-200 text-emerald-800 text-sm text-center bg-white/70">Open full report</Link> use the whole box for route */}
                <button className="px-3 py-2 rounded-md text-sm border border-emerald-200 bg-white/70">
                  Schedule inspection
                </button>
              </div>
            </div>
          </div>

          {/* Middle: Risk distribution (compact) */}
          <div className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-50 h-full">
              <h3 className="font-semibold text-emerald-800">
                Risk distribution
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Fields grouped by risk level
              </p>

              <div className="mt-4 space-y-3">
                {/* compute counts */}
                {(() => {
                  const counts = { low: 0, medium: 0, high: 0 };
                  sampleFields.forEach((f) => {
                    if (f.pestRisk < 0.2) counts.low++;
                    else if (f.pestRisk < 0.35) counts.medium++;
                    else counts.high++;
                  });
                  return (
                    <>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-emerald-200 rounded" />{" "}
                          Low
                        </div>
                        <div className="text-slate-700 font-medium">
                          {counts.low}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-amber-200 rounded" />{" "}
                          Medium
                        </div>
                        <div className="text-slate-700 font-medium">
                          {counts.medium}
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <div className="flex items-center gap-2">
                          <span className="w-3 h-3 bg-red-200 rounded" /> High
                        </div>
                        <div className="text-slate-700 font-medium">
                          {counts.high}
                        </div>
                      </div>
                    </>
                  );
                })()}
              </div>

              <div className="mt-4">
                <div className="text-xs text-slate-500">
                  Global health trend
                </div>
                <div className="mt-2">
                  <Sparkline values={recentTrend} />
                </div>
              </div>
            </div>
          </div>

          {/* Right: Recent alerts (compact list) */}
          <aside className="lg:col-span-1">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-50 h-full">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-emerald-800">
                  Recent alerts
                </h3>
                <div className="text-xs text-slate-500">Latest</div>
              </div>

              <div className="space-y-2">
                {recentAlerts.map((a) => {
                  const field = sampleFields.find((f) => f.id === a.fieldId);
                  return (
                    <div
                      key={a.id}
                      className="p-2 rounded hover:bg-emerald-50 flex items-center justify-between"
                    >
                      <div>
                        <div className="text-sm font-medium text-emerald-900">
                          {a.type}
                        </div>
                        <div className="text-xs text-slate-500">
                          {field?.name ?? "Unknown"} • {relativeTime(a.time)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div
                          className={`text-xs font-semibold ${a.severity === "High" ? "text-red-600" : a.severity === "Medium" ? "text-amber-600" : "text-emerald-700"}`}
                        >
                          {a.severity}
                        </div>
                        <Link
                          href={`/fields/${a.fieldId}`}
                          className="text-xs text-emerald-700 mt-1 block"
                        >
                          Inspect
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="mt-4 text-xs text-slate-500">
                Tip: Click an alert to open the field page or go to the Report
                for an annotated image and time series.
              </div>
            </div>
          </aside>
        </div>

        <footer className="mt-8 text-sm text-slate-500">
          <div>
            Overview is intentionally lightweight and summary-first. Use Report
            for annotated images, per-day LSTM cards, and detailed risk maps.
          </div>
        </footer>
      </div>
    </div>
  );
}
