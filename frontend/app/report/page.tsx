"use client";

import React from "react";

const sampleCNN = {
  annotatedAt: "2025-09-06T08:00:00Z",
  imageSize: { width: 800, height: 500 }, // used for coordinates
  anomalies: [
    // x,y are fractions (0..1) relative to image
    { id: 1, type: "Yellowing", x: 0.22, y: 0.32, confidence: 0.92 },
    { id: 2, type: "Water Stress", x: 0.58, y: 0.47, confidence: 0.87 },
    { id: 3, type: "Pest Infestation", x: 0.78, y: 0.72, confidence: 0.78 },
  ],
};

const sampleLSTM = {
  predictedAt: "2025-09-06T08:00:00Z",
  horizonDays: [1, 2, 3],
  // For each future day we provide the outputs
  forecasts: [
    {
      day: "2025-09-07",
      CropHealthScore: "Stressed",
      CropHealthNumeric: 0.45,
      SoilMoistureForecast: { mm: 18.2, pct: 24 },
      PestRiskScore: 0.13,
      AnomalyDetected: 1,
      RiskMap: [
        // 5x5 sample matrix (0=green,1=yellow,2=red)
        [0, 0, 0, 1, 1],
        [0, 0, 1, 1, 2],
        [0, 1, 1, 2, 2],
        [0, 1, 2, 2, 2],
        [0, 0, 1, 2, 2],
      ],
    },
    {
      day: "2025-09-08",
      CropHealthScore: "At Risk",
      CropHealthNumeric: 0.33,
      SoilMoistureForecast: { mm: 12.1, pct: 16 },
      PestRiskScore: 0.27,
      AnomalyDetected: 1,
      RiskMap: [
        [0, 1, 1, 1, 2],
        [1, 1, 1, 2, 2],
        [1, 1, 2, 2, 2],
        [1, 2, 2, 2, 2],
        [0, 1, 2, 2, 2],
      ],
    },
    {
      day: "2025-09-09",
      CropHealthScore: "At Risk",
      CropHealthNumeric: 0.28,
      SoilMoistureForecast: { mm: 9.3, pct: 12 },
      PestRiskScore: 0.35,
      AnomalyDetected: 1,
      RiskMap: [
        [1, 1, 1, 2, 2],
        [1, 1, 2, 2, 2],
        [1, 2, 2, 2, 2],
        [1, 2, 2, 2, 2],
        [1, 1, 2, 2, 2],
      ],
    },
  ],
};

/* -------------------------
   Helper UI components
   ------------------------- */

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-block px-2 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
      {children}
    </span>
  );
}

function SmallStat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="bg-white/60 backdrop-blur rounded-lg p-3 shadow-sm">
      <div className="text-xs text-slate-600">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}

function anomalyColor(type: string) {
  switch (type) {
    case "Yellowing":
      return "#E3A200";
    case "Water Stress":
      return "#FF6B6B";
    case "Pest Infestation":
      return "#9B2C2C";
    default:
      return "#4C51BF";
  }
}

/* Render an SVG field image and place markers */
function AnomalyMap({
  width = 800,
  height = 500,
  anomalies,
}: {
  width?: number;
  height?: number;
  anomalies: (typeof sampleCNN.anomalies)[number][];
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-emerald-100 shadow-sm bg-white">
      {/* Simple SVG "field" base (placeholder) */}
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full block">
        {/* background */}
        <defs>
          <linearGradient id="gfield" x1="0" x2="1">
            <stop offset="0" stopColor="#E9F7EF" />
            <stop offset="1" stopColor="#DFF3E6" />
          </linearGradient>
        </defs>
        <rect x="0" y="0" width={width} height={height} fill="url(#gfield)" />
        {/* simple rows to suggest crops */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x={20}
            y={(i / 12) * height + 6}
            width={width - 40}
            height={6}
            fill={i % 2 === 0 ? "#EAF8F0" : "#DFF3E6"}
            rx={3}
          />
        ))}

        {/* Markers */}
        {anomalies.map((a) => {
          const cx = a.x * width;
          const cy = a.y * height;
          const color = anomalyColor(a.type);
          return (
            <g key={a.id} transform={`translate(${cx}, ${cy})`} className="cursor-pointer">
              <circle r={18} fill={color} fillOpacity={0.18} stroke={color} strokeWidth={2} />
              <text
                x={0}
                y={6}
                textAnchor="middle"
                fontSize={10}
                fontWeight={700}
                fill={color}
              >
                {a.type[0]}
              </text>
            </g>
          );
        })}
      </svg>
      <div className="px-3 py-2 flex items-center justify-between bg-emerald-50">
        <div className="text-sm text-slate-700">Field image (annotated)</div>
        <div className="text-xs text-slate-500">Annotated: {sampleCNN.annotatedAt}</div>
      </div>
    </div>
  );
}

/* Risk map grid renderer */
function RiskMapGrid({ matrix }: { matrix: number[][] }) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const size = 34;
  const colorFor = (v: number) => {
    if (v === 0) return "#D1FAE5"; // green-ish
    if (v === 1) return "#FEF3C7"; // yellow-ish
    return "#FEE2E2"; // red-ish
  };
  const labelFor = (v: number) => (v === 0 ? "Low" : v === 1 ? "Medium" : "High");
  return (
    <div>
      <div className="grid gap-1" style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }}>
        {matrix.flatMap((row) =>
          row.map((cell, j) => (
            <div
              key={`${j}-${Math.random()}`}
              className="flex items-center justify-center text-xs font-medium rounded"
              style={{ width: size, height: size, background: colorFor(cell) }}
              title={labelFor(cell)}
            >
              {/* optionally show small index */}
            </div>
          )),
        )}
      </div>
      <div className="mt-2 text-xs text-slate-600 flex items-center gap-3">
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#D1FAE5] rounded" /> Low
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#FEF3C7] rounded" /> Medium
        </div>
        <div className="flex items-center gap-1">
          <span className="w-3 h-3 bg-[#FEE2E2] rounded" /> High
        </div>
      </div>
    </div>
  );
}

/* -------------------------
   Page UI
   ------------------------- */

export default function ReportPage() {
  const cnn = sampleCNN;
  const lstm = sampleLSTM;

  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white p-6">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-900">AgroAI - Field Report</h1>
            <p className="text-sm text-slate-600 mt-1">Prediction snapshot & future horizon (LSTM & CNN)</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium shadow-sm">
              Export JSON
            </button>
          </div>
        </header>

        {/* Top summary */}
        <section className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <SmallStat label="Next horizon" value={`${lstm.horizonDays.length} days`} />
          <SmallStat label="Latest anomaly (CNN)" value={cnn.anomalies.length > 0 ? "Yes" : "No"} />
          <SmallStat label="Pest risk (next day)" value={`${Math.round(lstm.forecasts[0].PestRiskScore * 100)}%`} />
          <SmallStat label="Soil moisture (day1)" value={`${lstm.forecasts[0].SoilMoistureForecast.pct}%`} />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Annotated image + anomalies list */}
          <div className="lg:col-span-2 space-y-4">
            <AnomalyMap
              width={sampleCNN.imageSize.width}
              height={sampleCNN.imageSize.height}
              anomalies={cnn.anomalies}
            />

            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-50">
              <h2 className="font-semibold text-lg text-emerald-800 mb-3">Detected anomalies</h2>
              <div className="grid gap-3">
                {cnn.anomalies.map((a) => (
                  <div key={a.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold"
                        style={{ background: anomalyColor(a.type) }}
                      >
                        {a.type[0]}
                      </div>
                      <div>
                        <div className="text-sm font-semibold">{a.type}</div>
                        <div className="text-xs text-slate-500">
                          pos: ({(a.x * 100).toFixed(0)}%, {(a.y * 100).toFixed(0)}%), confidence:{" "}
                          {(a.confidence * 100).toFixed(0)}%
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-slate-600">Action suggestions: <span className="font-medium">Inspect</span></div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right column: LSTM forecasts (one card per day) */}
          <aside className="space-y-4">
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-50">
              <h3 className="font-semibold text-emerald-800">LSTM Forecasts (future steps)</h3>
              <p className="text-xs text-slate-500 mt-1">Predictions use past sensor & spectral sequences.</p>
            </div>

            {lstm.forecasts.map((f) => (
              <div key={f.day} className="bg-white p-4 rounded-lg shadow-sm border border-emerald-50">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <div className="text-sm font-semibold">{f.day}</div>
                    <div className="text-xs text-slate-500">Crop Health: <span className="font-medium">{f.CropHealthScore}</span></div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-semibold">{(f.CropHealthNumeric * 100).toFixed(0)}%</div>
                    <div className="text-xs text-slate-500">Health score</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-3">
                  <div className="rounded p-2 bg-emerald-50">
                    <div className="text-xs text-slate-600">Soil moisture</div>
                    <div className="text-lg font-semibold">{f.SoilMoistureForecast.mm} mm ({f.SoilMoistureForecast.pct}%)</div>
                  </div>
                  <div className="rounded p-2 bg-emerald-50">
                    <div className="text-xs text-slate-600">Pest risk</div>
                    <div className="text-lg font-semibold">{(f.PestRiskScore * 100).toFixed(0)}%</div>
                  </div>
                </div>

                <div className="mb-2">
                  <div className="text-xs text-slate-600 mb-2">Risk map</div>
                  <RiskMapGrid matrix={f.RiskMap} />
                </div>

                <div className="mt-3 text-xs text-slate-600 flex items-center justify-between">
                  <div>AnomalyDetected: <span className="font-medium">{f.AnomalyDetected ? "Yes" : "No"}</span></div>
                  <div>Model timestamp: <span className="text-slate-500">{lstm.predictedAt}</span></div>
                </div>
              </div>
            ))}
          </aside>
        </div>

        <footer className="mt-8 text-sm text-slate-500">
          <div>Notes: CNN provides anomaly positions and types. LSTM predicts multi-day horizon outputs (health, soil moisture, pest risk, risk maps). Replace <code>sampleCNN</code> and <code>sampleLSTM</code> with your real model outputs in the page or fetch from your API.</div>
        </footer>
      </div>
    </div>
  );
}
