"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Image from "next/image";
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
  X,
  Upload,
} from "lucide-react";
import { getUser } from "@/lib/action/getUser";
type FormState = {
  airTemperature: string | number;
  humidity: string | number;
  rainfall: string | number;
  // ...other fields
};

export default function AddDayPage({
  params,
}: {
  params: { fieldId: string };
}) {
  const fieldId = params.fieldId;
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

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
  });

  const [images, setImages] = useState<string[]>([]);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [loading, setLoading] = useState(false);
  const [load, setLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const [userData, setUserData] = useState<any>(null);
  useEffect(() => {
    async function fetchUser() {
      const res = await getUser();
      setUserData(res.user);
      console.log(res.user);
      setLoad(false);
    }
    fetchUser();
  }, []);
  const idNum = Number(fieldId);
  const field = useMemo(
    () => userData?.Fields?.find((f: any) => f?.id === idNum) ?? null,
    [userData, idNum],
  );

  const fieldName = field?.name ?? null;
  const fieldLocation = field?.location ?? null;

  function onChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setSuccess(null);
  }

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploadingImages(true);

    try {
      const formData = new FormData();
      Array.from(files).forEach((file) => {
        formData.append("files", file);
      });

      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        setImages((prev) => [...prev, ...result.urls]);
        toast.success(`${result.urls.length} image(s) uploaded successfully`);
      } else {
        toast.error("Failed to upload images");
      }
    } catch (error) {
      console.error("Upload error:", error);
      toast.error("Failed to upload images");
    } finally {
      setUploadingImages(false);
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const removeImage = (indexToRemove: number) => {
    setImages((prev) => prev.filter((_, index) => index !== indexToRemove));
  };

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
      imageUrls: images, // Send the uploaded image URLs
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
        router.push(`/dashboard/field/${fieldId}`);
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

  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!fieldLocation) return;

    let cancelled = false;
    async function fetchWeather() {
      try {
        setErr(null);
        setLoading(true);

        const res = await fetch(
          `/api/weather?location=${encodeURIComponent(fieldLocation)}`,
        );
        const payload = await res.json();

        if (!res.ok) {
          // payload may contain an error object from WeatherAPI; show friendly message
          const message =
            payload?.error?.message || payload?.error || "Weather fetch failed";
          throw new Error(message);
        }

        // payload.data is WeatherAPI response (we wrapped it in { data } in the server route)
        const data = payload?.data ?? payload;
        const current = data?.current ?? data;
        const temp_c = current?.temp_c;
        const humidity = current?.humidity;
        const precip_mm = current?.precip_mm ?? 0;

        if (!cancelled) {
          setForm((prev) => {
            const next = {
              ...prev,
              airTemperature:
                prev.airTemperature !== ""
                  ? prev.airTemperature
                  : (temp_c ?? ""),
              humidity: prev.humidity !== "" ? prev.humidity : (humidity ?? ""),
              rainfall:
                prev.rainfall !== "" ? prev.rainfall : (precip_mm ?? ""),
            };
            // onChange?.(next);
            return next;
          });
        }
      } catch (e: any) {
        if (!cancelled) setErr(e.message ?? "failed to fetch weather");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    fetchWeather();
    return () => {
      cancelled = true;
    };
  }, [fieldLocation]);

  if (load) {
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
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <header className="bg-gray-100 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <h1 className="text-lg font-medium">
                Add Daywise Data for Field - "{fieldName}"
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

                {/* Image Upload Section */}
                <div>
                  <label className="block text-sm mb-2 items-center gap-2">
                    <ImageIcon className="w-4 h-4" /> Images
                  </label>

                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                    <div className="text-center">
                      <ImageIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="mt-4">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => fileInputRef.current?.click()}
                          disabled={uploadingImages}
                          className="flex items-center gap-2"
                        >
                          <Upload className="w-4 h-4" />
                          {uploadingImages ? "Uploading..." : "Upload Images"}
                        </Button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          multiple
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </div>
                      <p className="mt-2 text-sm text-gray-500">
                        PNG, JPG, GIF up to 10MB each
                      </p>
                    </div>
                  </div>

                  {/* Image Preview Grid */}
                  {images.length > 0 && (
                    <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {images.map((src, idx) => (
                        <div key={idx} className="relative group">
                          <div className="aspect-square rounded-lg overflow-hidden border bg-white">
                            <Image
                              src={src}
                              alt={`Upload preview ${idx + 1}`}
                              width={200}
                              height={200}
                              className="object-cover w-full h-full"
                              onError={() => {
                                console.error(`Failed to load image: ${src}`);
                              }}
                            />
                          </div>
                          <Button
                            type="button"
                            variant="destructive"
                            size="sm"
                            onClick={() => removeImage(idx)}
                            className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3">
                  <Button
                    type="button"
                    variant="ghost"
                    onClick={() => router.back()}
                    disabled={loading || uploadingImages}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={loading || uploadingImages}>
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
