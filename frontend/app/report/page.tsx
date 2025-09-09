"use client";

import React from "react";

// Real 7-day historical data
const historicalData = {
  recordedFrom: "2025-09-02", // 7 days ago
  recordedTo: "2025-09-08",
  soilMoisture: [12.72, 12.78, 11.93, 12.87, 12.48, 15.11, 12.53],
  ambientTemperature: [18.88, 18.68, 19.65, 19.13, 19.02, 18.21, 18.68],
  humidity: [44.08, 42.78, 42.33, 44.79, 45.0, 42.43, 41.38],
  soilTemperature: [16.52, 16.57, 16.03, 17.03, 16.85, 15.66, 15.26],
  chlorophyllContent: [21.02, 19.32, 23.82, 22.69, 23.49, 23.71, 25.0],
  stressScore: [0.16, 0.16, 0.21, 0.14, 0.17, 0.14, 0.17],
  anomalyDetected: [0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0],
  pestRiskScore: [0.25, 0.27, 0.26, 0.28, 0.29, 0.23, 0.23],
  plantHealthStatus: "Moderately Stressed",
};

// Updated CNN data based on current conditions
const sampleCNN = {
  annotatedAt: "2025-09-08T08:00:00Z",
  imageSize: { width: 800, height: 500 },
  anomalies: [
    // Based on stress patterns, adding some realistic anomalies
    { id: 1, type: "Water Stress", x: 0.35, y: 0.42, confidence: 0.73 },
    { id: 2, type: "Nutrient Stress", x: 0.65, y: 0.58, confidence: 0.81 },
  ],
};

// Future predictions based on trends
const sampleLSTM = {
  predictedAt: "2025-09-09T08:00:00Z",
  horizonDays: [1, 2, 3],
  forecasts: [
    {
      day: "2025-09-10",
      CropHealthScore: "Moderately Stressed",
      CropHealthNumeric: 0.67, // Based on current stress levels
      SoilMoistureForecast: { mm: 12.8, pct: 17 },
      PestRiskScore: 0.24,
      AnomalyDetected: 0,
      RiskMap: [
        [0, 0, 1, 1, 1],
        [0, 1, 1, 1, 1],
        [0, 1, 1, 1, 2],
        [0, 0, 1, 1, 1],
        [0, 0, 0, 1, 1],
      ],
    },
    {
      day: "2025-09-11",
      CropHealthScore: "Moderately Stressed",
      CropHealthNumeric: 0.65,
      SoilMoistureForecast: { mm: 12.2, pct: 16 },
      PestRiskScore: 0.26,
      AnomalyDetected: 0,
      RiskMap: [
        [0, 1, 1, 1, 1],
        [1, 1, 1, 1, 2],
        [1, 1, 1, 2, 2],
        [0, 1, 1, 1, 1],
        [0, 0, 1, 1, 1],
      ],
    },
    {
      day: "2025-09-12",
      CropHealthScore: "At Risk",
      CropHealthNumeric: 0.62,
      SoilMoistureForecast: { mm: 11.9, pct: 15 },
      PestRiskScore: 0.28,
      AnomalyDetected: 1,
      RiskMap: [
        [1, 1, 1, 1, 2],
        [1, 1, 1, 2, 2],
        [1, 1, 2, 2, 2],
        [0, 1, 1, 1, 2],
        [0, 1, 1, 1, 1],
      ],
    },
  ],
};

/* -------------------------
   Helper UI components
   ------------------------- */

function Badge({
  children,
  variant = "default",
}: {
  children: React.ReactNode;
  variant?: "default" | "warning" | "danger";
}) {
  const colors = {
    default: "bg-emerald-100 text-emerald-800",
    warning: "bg-yellow-100 text-yellow-800",
    danger: "bg-red-100 text-red-800",
  };
  return (
    <span
      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${colors[variant]}`}
    >
      {children}
    </span>
  );
}

function SmallStat({
  label,
  value,
  trend,
}: {
  label: string;
  value: string | number;
  trend?: "up" | "down" | "stable";
}) {
  return (
    <div className="bg-white/60 backdrop-blur rounded-lg p-3 shadow-sm">
      <div className="text-xs text-slate-600 flex items-center justify-between">
        {label}
        {trend && (
          <span
            className={`text-xs ${trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-600"}`}
          >
            {trend === "up" ? "↗" : trend === "down" ? "↘" : "→"}
          </span>
        )}
      </div>
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
    case "Nutrient Stress":
      return "#8B5CF6";
    case "Pest Infestation":
      return "#9B2C2C";
    default:
      return "#4C51BF";
  }
}

function MiniChart({
  data,
  label,
  unit = "",
}: {
  data: number[];
  label: string;
  unit?: string;
}) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;
  const width = 120;
  const height = 40;

  const points = data
    .map((value, i) => {
      const x = (i / (data.length - 1)) * width;
      const y = height - ((value - min) / range) * height;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="bg-white p-3 rounded-lg shadow-sm border border-emerald-50">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-medium text-slate-700">{label}</span>
      </div>
      <svg width={width} height={height} className="w-full">
        <polyline
          fill="none"
          stroke="#10B981"
          strokeWidth="2"
          points={points}
        />
        <circle
          cx={width}
          cy={height - ((data[data.length - 1] - min) / range) * height}
          r="3"
          fill="#10B981"
        />
      </svg>
      <div className="text-xs text-slate-500 mt-1">
        Range: {min.toFixed(1)} - {max.toFixed(1)}
      </div>
    </div>
  );
}

/* Render an SVG field image and place markers */
function AnomalyMapImage({
  src,
  annotatedAt,
}: {
  src: string;
  annotatedAt: string;
}) {
  return (
    <div className="rounded-lg overflow-hidden border border-emerald-100 shadow-sm bg-white">
      <img src={src} alt="Field annotated" className="w-full h-auto block" />
      <div className="px-3 py-2 flex items-center justify-between bg-emerald-50">
        <div className="text-sm text-slate-700">Field image (annotated)</div>
        <div className="text-xs text-slate-500">Annotated: {annotatedAt}</div>
      </div>
    </div>
  );
}

function RiskMapGrid({ matrix }: { matrix: number[][] }) {
  const rows = matrix.length;
  const cols = matrix[0]?.length ?? 0;
  const size = 34;
  const colorFor = (v: number) => {
    if (v === 0) return "#D1FAE5";
    if (v === 1) return "#FEF3C7";
    return "#FEE2E2";
  };
  const labelFor = (v: number) =>
    v === 0 ? "Low" : v === 1 ? "Medium" : "High";
  return (
    <div>
      <div
        className="grid gap-1"
        style={{ gridTemplateColumns: `repeat(${cols}, ${size}px)` }}
      >
        {matrix.flatMap((row) =>
          row.map((cell, j) => (
            <div
              key={`${j}-${Math.random()}`}
              className="flex items-center justify-center text-xs font-medium rounded"
              style={{ width: size, height: size, background: colorFor(cell) }}
              title={labelFor(cell)}
            ></div>
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

export default function ReportPage() {
  const cnn = sampleCNN;
  const lstm = sampleLSTM;
  const historical = historicalData;

  // Calculate trends
  const getAverage = (arr: number[]) =>
    arr.reduce((a, b) => a + b) / arr.length;
  const currentStress =
    historical.stressScore[historical.stressScore.length - 1];
  const avgStress = getAverage(historical.stressScore);

  return (
    <div className="min-h-screen p-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <header className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl md:text-3xl font-extrabold text-emerald-900">
              AgroAI - Field Report
            </h1>
            <p className="text-sm text-slate-600 mt-1">
              Historical trends & future predictions • Plant Health:{" "}
              {historical.plantHealthStatus}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              variant={
                historical.plantHealthStatus.includes("Stressed")
                  ? "warning"
                  : "default"
              }
            >
              {historical.plantHealthStatus}
            </Badge>
            <button className="px-3 py-2 rounded-md bg-emerald-600 text-white text-sm font-medium shadow-sm">
              Export Data
            </button>
          </div>
        </header>

        {/* Current Status Overview */}
        <section className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <SmallStat
            label="Avg Stress Score"
            value={avgStress.toFixed(2)}
            trend={currentStress > avgStress ? "up" : "down"}
          />
          <SmallStat
            label="Current Soil Moisture"
            value={`${historical.soilMoisture[historical.soilMoisture.length - 1]}%`}
            trend="stable"
          />
          <SmallStat
            label="Chlorophyll Content"
            value={historical.chlorophyllContent[
              historical.chlorophyllContent.length - 1
            ].toFixed(1)}
            trend="up"
          />
          <SmallStat
            label="Pest Risk"
            value={`${(historical.pestRiskScore[historical.pestRiskScore.length - 1] * 100).toFixed(0)}%`}
            trend="stable"
          />
          <SmallStat
            label="Anomalies Detected"
            value={
              historical.anomalyDetected.reduce((a, b) => a + b, 0) === 0
                ? "None"
                : "Present"
            }
          />
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left: Annotated image + anomalies list */}
          <div className="lg:col-span-2 space-y-4">
            <AnomalyMapImage
              src="/Anomalies-report.jpg"
              annotatedAt={sampleCNN.annotatedAt}
            />

            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-50">
              <h3 className="font-semibold text-emerald-800">
                LSTM Future Predictions
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Based on 7-day historical sensor data and growth patterns.
              </p>

              {/* Images */}
              <div className="mt-4 space-y-3">
                <div>
                  <h4 className="text-sm font-medium text-slate-700">
                    Disease Risk Index vs Day
                  </h4>
                  <img
                    src="/disease.png"
                    alt="Disease Risk Index vs Day"
                    className="rounded-lg border border-slate-100 mt-1"
                  />
                </div>

                <div>
                  <h4 className="text-sm font-medium text-slate-700">
                    Risk Index vs Day
                  </h4>
                  <img
                    src="/insects.png"
                    alt="Risk Index vs Day"
                    className="rounded-lg border border-slate-100 mt-1"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Right column: LSTM forecasts */}
          <aside className="space-y-4">
            <h2 className="text-xl font-bold text-emerald-900 mb-4">
              7-Day Historical Trends
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
              <MiniChart
                data={historical.soilMoisture}
                label="Soil Moisture"
                unit="%"
              />
              <MiniChart
                data={historical.ambientTemperature}
                label="Temperature"
                unit="°C"
              />
              <MiniChart data={historical.humidity} label="Humidity" unit="%" />
              <MiniChart
                data={historical.chlorophyllContent}
                label="Chlorophyll"
              />
              <MiniChart data={historical.stressScore} label="Stress Score" />
              <MiniChart
                data={historical.pestRiskScore.map((x) => x * 100)}
                label="Pest Risk"
                unit="%"
              />
              <MiniChart
                data={historical.soilTemperature}
                label="Soil Temp"
                unit="°C"
              />
              <div className="bg-white p-3 rounded-lg shadow-sm border border-emerald-50">
                <div className="text-sm font-medium text-slate-700 mb-2">
                  Data Period
                </div>
                <div className="text-xs text-slate-600">
                  From: {historical.recordedFrom}
                  <br />
                  To: {historical.recordedTo}
                </div>
                <div className="mt-2 text-xs text-emerald-600 font-medium">
                  ✓ 7 days of clean data
                </div>
              </div>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm border border-emerald-50">
              <h2 className="font-semibold text-lg text-emerald-800 mb-3">
                Current Field Analysis
              </h2>
              {cnn.anomalies.length > 0 ? (
                <div className="grid gap-3">
                  {cnn.anomalies.map((a) => (
                    <div
                      key={a.id}
                      className="flex items-center justify-between"
                    >
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
                            Location: ({(a.x * 100).toFixed(0)}%,{" "}
                            {(a.y * 100).toFixed(0)}%) • Confidence:{" "}
                            {(a.confidence * 100).toFixed(0)}%
                          </div>
                        </div>
                      </div>
                      <div className="text-xs text-slate-600">
                        <span className="font-medium">Monitor closely</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-slate-500">
                  <div className="text-sm">
                    ✓ No critical anomalies detected in recent scans
                  </div>
                  <div className="text-xs mt-1">
                    Continue regular monitoring
                  </div>
                </div>
              )}
            </div>
          </aside>
        </div>

        <footer className="mt-8 p-4 bg-white/50 backdrop-blur rounded-lg text-sm text-slate-600">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <strong>Data Summary:</strong> Analysis based on 7 days of sensor
              readings ({historical.recordedFrom} to {historical.recordedTo}).
              Current plant health status shows{" "}
              {historical.plantHealthStatus.toLowerCase()} condition with
              average stress score of {avgStress.toFixed(2)}.
            </div>
            <div>
              <strong>Recommendations:</strong> Monitor soil moisture levels
              closely, maintain current pest management protocols, and consider
              nutrient supplementation for stressed areas identified in the
              field scan.
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
