"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import {
  ArrowLeft,
  Calendar,
  CheckCircle,
  CloudRain,
  Droplet,
  ImageIcon,
  Leaf,
  Thermometer,
  XCircle,
} from "lucide-react";

export default function AddDayPage({
  params,
}: {
  params: { fieldId: string };
}) {
  const fieldId = params.fieldId;
  const router = useRouter();

  const [form, setForm] = useState({
    date: "",
    soilMoisture: "",
    soilTemperature: "",
    soilPH: "",
    nutrientN: "",
    nutrientP: "",
    nutrientK: "",
    soilEC: "",
    airTemperature: "",
    humidity: "",
    rainfall: "",
    leafWetness: "",
    canopyTemperature: "",
    evapotranspiration: "",
    solarPAR: "",
    notes: "",
    imageUrls: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(null);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!form.date) {
      toast.error("Please select a date");
      return;
    }

    const payload: any = {
      fieldId,
      date: form.date,
      soilMoisture: form.soilMoisture ? parseFloat(form.soilMoisture) : null,
      soilTemperature: form.soilTemperature
        ? parseFloat(form.soilTemperature)
        : null,
      soilPH: form.soilPH ? parseFloat(form.soilPH) : null,
      nutrientN: form.nutrientN ? parseFloat(form.nutrientN) : null,
      nutrientP: form.nutrientP ? parseFloat(form.nutrientP) : null,
      nutrientK: form.nutrientK ? parseFloat(form.nutrientK) : null,
      soilEC: form.soilEC ? parseFloat(form.soilEC) : null,
      airTemperature: form.airTemperature
        ? parseFloat(form.airTemperature)
        : null,
      humidity: form.humidity ? parseFloat(form.humidity) : null,
      rainfall: form.rainfall ? parseFloat(form.rainfall) : null,
      leafWetness: form.leafWetness ? parseFloat(form.leafWetness) : null,
      canopyTemperature: form.canopyTemperature
        ? parseFloat(form.canopyTemperature)
        : null,
      evapotranspiration: form.evapotranspiration
        ? parseFloat(form.evapotranspiration)
        : null,
      solarPAR: form.solarPAR ? parseFloat(form.solarPAR) : null,
      notes: form.notes || null,
      imageUrls: form.imageUrls
        ? form.imageUrls
            .split(",")
            .map((s) => s.trim())
            .filter(Boolean)
        : [],
    };

    try {
      const res = await fetch("/api/daywise-data", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setLoading(true);
        const data = await res.json();
        toast.success(`Daywise data added for ${data.date}`);
        router.push(`/dashboard/field/${fieldId}`); // 👈 go back to field details
        router.refresh();
      } else if (res.status === 409) {
        toast.error("Day entry for this date already exists for this field.");
      } else {
        const err = await res.json().catch(() => ({}));
        toast.error(err?.error || "Failed to add daywise data");
      }
    } catch (error) {
      console.error(error);
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <header className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium">
                Field {fieldId} - Add Daywise Data
              </h1>
            </div>

            <div className="flex items-center gap-3">
              {success && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-50 text-green-700">
                  <CheckCircle className="w-4 h-4" /> {success}
                </div>
              )}
              {error && (
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700">
                  <XCircle className="w-4 h-4" /> {error}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form column (wide) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow p-6">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="sm:col-span-2">
                    <label className=" text-sm mb-2 flex items-center gap-2">
                      <Calendar className="w-4 h-4" /> Date
                    </label>
                    <Input
                      name="date"
                      type="date"
                      value={form.date}
                      onChange={onChange}
                      required
                    />
                  </div>

                  <div>
                    <label className=" text-sm mb-2 flex items-center gap-2">
                      <Droplet className="w-4 h-4" /> Soil Moisture (%)
                    </label>
                    <Input
                      name="soilMoisture"
                      type="number"
                      step="0.01"
                      value={form.soilMoisture}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className=" text-sm mb-2 flex items-center gap-2">
                      <Thermometer className="w-4 h-4" /> Soil Temp (°C)
                    </label>
                    <Input
                      name="soilTemperature"
                      type="number"
                      step="0.1"
                      value={form.soilTemperature}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className=" text-sm mb-2">Soil pH</label>
                    <Input
                      name="soilPH"
                      type="number"
                      step="0.01"
                      value={form.soilPH}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="flex text-sm mb-2 items-center gap-2">
                      <Leaf className="w-4 h-4" /> N (ppm)
                    </label>
                    <Input
                      name="nutrientN"
                      type="number"
                      step="0.1"
                      value={form.nutrientN}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">P (ppm)</label>
                    <Input
                      name="nutrientP"
                      type="number"
                      step="0.1"
                      value={form.nutrientP}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">K (ppm)</label>
                    <Input
                      name="nutrientK"
                      type="number"
                      step="0.1"
                      value={form.nutrientK}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Soil EC</label>
                    <Input
                      name="soilEC"
                      type="number"
                      step="0.01"
                      value={form.soilEC}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="flex text-sm mb-2 items-center gap-2">
                      <Thermometer className="w-4 h-4" /> Air Temp (°C)
                    </label>
                    <Input
                      name="airTemperature"
                      type="number"
                      step="0.1"
                      value={form.airTemperature}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Humidity (%)</label>
                    <Input
                      name="humidity"
                      type="number"
                      step="0.1"
                      value={form.humidity}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="flex text-sm mb-2 items-center gap-2">
                      <CloudRain className="w-4 h-4" /> Rainfall (mm)
                    </label>
                    <Input
                      name="rainfall"
                      type="number"
                      step="0.1"
                      value={form.rainfall}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="flex text-sm mb-2">Leaf Wetness</label>
                    <Input
                      name="leafWetness"
                      type="number"
                      step="0.1"
                      value={form.leafWetness}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Canopy Temp (°C)
                    </label>
                    <Input
                      name="canopyTemperature"
                      type="number"
                      step="0.1"
                      value={form.canopyTemperature}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">
                      Evapotranspiration (mm)
                    </label>
                    <Input
                      name="evapotranspiration"
                      type="number"
                      step="0.01"
                      value={form.evapotranspiration}
                      onChange={onChange}
                    />
                  </div>

                  <div>
                    <label className="block text-sm mb-2">Solar PAR</label>
                    <Input
                      name="solarPAR"
                      type="number"
                      step="0.01"
                      value={form.solarPAR}
                      onChange={onChange}
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm mb-2">Notes</label>
                  <Textarea
                    name="notes"
                    value={form.notes}
                    onChange={onChange}
                  />
                </div>

                {/* <div>
                  <label className="block text-sm mb-2 flex items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Image URLs (comma separated)
                  </label>
                  <Input name="imageUrls" value={form.imageUrls} onChange={onChange} placeholder="https://... , https://..." />

                  {images.length > 0 && (
                    <div className="mt-3 grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {images.map((src, idx) => (
                        <div key={idx} className="w-full h-28 rounded overflow-hidden border bg-white flex items-center justify-center">
                          <img
                            src={src}
                            alt={`preview-${idx}`}
                            onError={(e) => {
                              (e.target as HTMLImageElement).src =
                                "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='140'/%3E";
                            }}
                            className="object-cover w-full h-full"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div> */}

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading}>
                    {loading ? "Saving..." : "Save"}
                  </Button>
                </div>
              </form>
            </div>
          </div>

          {/* Right column: live preview / quick stats */}
        </div>
      </main>
    </div>
  );
}
