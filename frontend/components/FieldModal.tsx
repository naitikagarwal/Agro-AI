// components/FieldModal.tsx
"use client";

import { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { getUser } from "@/lib/action/getUser";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
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
    router.refresh();
  };




  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">+ Add Field</Button>
      </DialogTrigger>

      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Field</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Name</label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="e.g. North Farm"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Location</label>
            <Input
              name="location"
              value={formData.location}
              onChange={handleChange}
              placeholder="e.g. Bangalore"
            />
          </div>

          <div>
            <label className="block text-sm font-medium">Description</label>
            <Textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Notes about the field..."
            />
          </div>

          <div className="flex justify-end gap-2">
            <Button type="submit">Save Field</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
