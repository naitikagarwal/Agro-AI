// components/FieldModal.tsx
"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUser } from "@/lib/action/getUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { DialogDescription } from "@radix-ui/react-dialog";

export default function FieldModal() {
  const [open, setOpen] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    async function fetchUser() {
      const res = await getUser();
      setUserData(res.user);
      setLoading(false);
    }
    fetchUser();
  }, []);
  const [formData, setFormData] = useState({
    name: "",
    location: "",
    description: "",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = userData?.id;

    const res = await fetch("/api/fields", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...formData, userId }),
    });

    if (res.ok) {
      toast.success(`Field created successfully 🌱`);
      setFormData({ name: "", location: "", description: "" });
    } else {
      console.error("Error creating field");
    }

    setFormData({ name: "", location: "", description: "" });
    setOpen(false);
    // router.refresh();
    window.location.reload();
  };

  const [loadig, setLoadig] = useState(false);

  const getLocation = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    setLoadig(true);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;

        try {
          // reverse geocode for city name
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`,
          );
          const data = await res.json();
          const city =
            data.address.city ||
            data.address.town ||
            data.address.village ||
            "Unknown";

          setFormData((prev: any) => ({ ...prev, location: city }));
        } catch (err) {
          console.error("Error fetching location:", err);
          setFormData((prev: any) => ({
            ...prev,
            location: `${latitude}, ${longitude}`,
          }));
        }

        setLoadig(false);
      },
      (error) => {
        console.error(error);
        setLoadig(false);
      },
    );
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg cursor-pointer shadow-md">
          + Add New Field
        </Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg rounded-2xl p-6 bg-white backdrop-blur-md  shadow-xl text-black">
        <DialogHeader className="mb-2">
          <div className="flex items-start justify-between gap-4">
            <div>
              <DialogTitle className="text-lg font-semibold flex items-center gap-2">
                Add New Field
              </DialogTitle>
              <DialogDescription className="text-sm text-muted-foreground">
                Create a field to start tracking its sensors & data.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="mt-4 grid grid-cols-1 gap-4">
          <div>
            <label className="block text-sm font-medium mb-2">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. North Farm"
              className="rounded-sm"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div className="sm:col-span-2">
              <label className="block text-sm font-medium mb-2">Location</label>
              <Input
                name="location"
                value={formData.location}
                onChange={handleChange}
                placeholder="e.g. Bangalore"
                className="rounded-sm"
              />
              <p className="text-xs text-muted-foreground mt-1">
                You can enter a city or click Get Location to auto-fill.
              </p>
            </div>

            <div className="flex sm:items-end items-center">
              <Button
                type="button"
                onClick={getLocation}
                disabled={loadig}
                className="w-full sm:w-auto min-w-[120px] flex items-center justify-center gap-2 rounded-sm border mt-2 cursor-pointer"
                aria-busy={loadig}
              >
                {loadig ? (
                  <>
                    {/* spinner */}
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span className="text-sm">Getting...</span>
                  </>
                ) : (
                  <>
                    {/* location icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M12 11.5a2.5 2.5 0 100-5 2.5 2.5 0 000 5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19.5 10.5C19.5 16 12 21 12 21s-7.5-5-7.5-10.5A7.5 7.5 0 0112 3a7.5 7.5 0 017.5 7.5z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <span className="text-sm">Get Location</span>
                  </>
                )}
              </Button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">
              Description
            </label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Notes about the field..."
              rows={4}
              className="rounded-sm"
            />
          </div>

          <DialogFooter className="pt-2">
            <div className="flex justify-end items-center gap-2">
              <Button
                variant="ghost"
                type="button"
                onClick={() => {
                  setOpen(false);
                  setFormData({ name: "", location: "", description: "" });
                }}
                className="rounded-sm cursor-pointer"
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                className="rounded-sm cursor-pointer bg-emerald-600 hover:bg-emerald-700 text-white flex items-center gap-2 min-w-[120px]"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <svg
                      className="animate-spin h-4 w-4"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    <span>Saving...</span>
                  </>
                ) : (
                  "Save Field"
                )}
              </Button>
            </div>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
