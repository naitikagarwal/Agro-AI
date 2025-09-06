"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";

export default function AddDayPage({ params }: { params: { fieldId: string } }) {
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
        imageUrls: ""
    });

    function onChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
        setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();

        if (!form.date) {
            toast.error("Please select a date");
            return;
        }

        const payload: any = {
            fieldId,
            date: form.date,
            soilMoisture: form.soilMoisture ? parseFloat(form.soilMoisture) : null,
            soilTemperature: form.soilTemperature ? parseFloat(form.soilTemperature) : null,
            soilPH: form.soilPH ? parseFloat(form.soilPH) : null,
            nutrientN: form.nutrientN ? parseFloat(form.nutrientN) : null,
            nutrientP: form.nutrientP ? parseFloat(form.nutrientP) : null,
            nutrientK: form.nutrientK ? parseFloat(form.nutrientK) : null,
            soilEC: form.soilEC ? parseFloat(form.soilEC) : null,
            airTemperature: form.airTemperature ? parseFloat(form.airTemperature) : null,
            humidity: form.humidity ? parseFloat(form.humidity) : null,
            rainfall: form.rainfall ? parseFloat(form.rainfall) : null,
            leafWetness: form.leafWetness ? parseFloat(form.leafWetness) : null,
            canopyTemperature: form.canopyTemperature ? parseFloat(form.canopyTemperature) : null,
            evapotranspiration: form.evapotranspiration ? parseFloat(form.evapotranspiration) : null,
            solarPAR: form.solarPAR ? parseFloat(form.solarPAR) : null,
            notes: form.notes || null,
            imageUrls: form.imageUrls ? form.imageUrls.split(",").map(s => s.trim()).filter(Boolean) : []
        };

        try {
            const res = await fetch("/api/daywise-data", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (res.ok) {
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
        }
    }

    return (
        <div className="max-w-3xl mx-auto py-8">
            <h1 className="text-xl font-bold mb-6">Add Daywise Data for field {fieldId}</h1>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                    <div>
                        <label className="block text-sm">Date</label>
                        <Input name="date" type="date" value={form.date} onChange={onChange} required />
                    </div>

                    <div>
                        <label className="block text-sm">Soil Moisture</label>
                        <Input name="soilMoisture" type="number" step="0.01" value={form.soilMoisture} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">Soil Temp (°C)</label>
                        <Input name="soilTemperature" type="number" step="0.1" value={form.soilTemperature} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">Soil pH</label>
                        <Input name="soilPH" type="number" step="0.01" value={form.soilPH} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">N (ppm)</label>
                        <Input name="nutrientN" type="number" step="0.1" value={form.nutrientN} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">P (ppm)</label>
                        <Input name="nutrientP" type="number" step="0.1" value={form.nutrientP} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">K (ppm)</label>
                        <Input name="nutrientK" type="number" step="0.1" value={form.nutrientK} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">Soil EC</label>
                        <Input name="soilEC" type="number" step="0.01" value={form.soilEC} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">Air Temp (°C)</label>
                        <Input name="airTemperature" type="number" step="0.1" value={form.airTemperature} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">Humidity (%)</label>
                        <Input name="humidity" type="number" step="0.1" value={form.humidity} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">Rainfall (mm)</label>
                        <Input name="rainfall" type="number" step="0.1" value={form.rainfall} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">Leaf Wetness</label>
                        <Input name="leafWetness" type="number" step="0.1" value={form.leafWetness} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">Canopy Temp (°C)</label>
                        <Input name="canopyTemperature" type="number" step="0.1" value={form.canopyTemperature} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">Evapotranspiration (mm)</label>
                        <Input name="evapotranspiration" type="number" step="0.01" value={form.evapotranspiration} onChange={onChange} />
                    </div>

                    <div>
                        <label className="block text-sm">Solar PAR</label>
                        <Input name="solarPAR" type="number" step="0.01" value={form.solarPAR} onChange={onChange} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm">Notes</label>
                    <Textarea name="notes" value={form.notes} onChange={onChange} />
                </div>

                <div>
                    <label className="block text-sm">Image URLs (comma separated)</label>
                    <Input name="imageUrls" value={form.imageUrls} onChange={onChange} />
                </div>

                <div className="flex justify-end gap-2">
                    <Button type="submit">Save</Button>
                    <Button type="button" variant="ghost" onClick={() => router.back()}>
                        Cancel
                    </Button>
                </div>
            </form>
        </div>
    );
}
