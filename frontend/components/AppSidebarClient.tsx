"use client";

import React, { useState } from "react";
import Link from "next/link";
// Replace these imports with your actual Sidebar components or keep using your own primitives
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import FieldModal from "./FieldModal";

type DaywiseItem = {
  // adjust fields to match your schema
  id: number;
  date?: string;
};

type Field = {
  id: number;
  name: string;
  location?: string;
  daywiseData?: DaywiseItem[]; // if empty or undefined -> no days
  daywiseResults?: any[];
  finalResults?: any[];
};

type Props = {
  fields: Field[];
  // optional: baseUrl pattern for day links, you can pass it or change below
  dayLink?: (fieldId: number, dayIndex: number) => string;
};

export function AppSidebarClient({ fields, dayLink }: Props) {
  // single hook at top-level: safe
  const [openFieldIds, setOpenFieldIds] = useState<number[]>([]);

  const toggleField = (id: number) => {
    setOpenFieldIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const defaultDayLink = (fieldId: number, dayIndex: number) =>
    `/fields/${fieldId}/days/${dayIndex}`;

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>AGRO AI</SidebarGroupLabel>

          <SidebarHeader>
            <FieldModal />
          </SidebarHeader>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link href="/dashboard">Dashboard</Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Dynamically render fields */}
              {fields && fields.length > 0 ? (
                fields.map((field) => {
                  const days = field.daywiseData ?? [];
                  const isOpen = openFieldIds.includes(field.id);
                  return (
                    <div key={field.id} className="mb-2">
                      <SidebarMenuItem>
                        <button
                          className="w-full flex items-center justify-between px-3 py-2 rounded hover:bg-gray-100"
                          onClick={() => toggleField(field.id)}
                          aria-expanded={isOpen}
                          aria-controls={`field-days-${field.id}`}
                        >
                          <span className="flex items-center gap-2">
                            <strong>{field.name}</strong>
                            <span className="text-xs text-muted-foreground">
                              ({field.location ?? "—"})
                            </span>
                          </span>
                          <span className="ml-4">
                            {isOpen ? <ChevronUp /> : <ChevronDown />}
                          </span>
                        </button>
                      </SidebarMenuItem>

                      {/* Collapsible day list */}
                      {isOpen && (
                        <div
                          id={`field-days-${field.id}`}
                          className="pl-4 mt-1 space-y-1"
                        >
                          {days.length > 0 ? (
                            days.map((_, idx) => {
                              const dayIndex = idx + 1;
                              const href = (dayLink ?? defaultDayLink)(
                                field.id,
                                dayIndex
                              );
                              return (
                                <SidebarMenuItem key={dayIndex}>
                                  <SidebarMenuButton asChild>
                                    <a href={href} className="block px-3 py-1 rounded hover:bg-gray-100 text-sm">
                                      Day {dayIndex}
                                    </a>
                                  </SidebarMenuButton>
                                </SidebarMenuItem>
                              );
                            })
                          ) : (
                            <div className="px-3 py-2 text-sm text-muted-foreground">
                              No days yet
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })
              ) : (
                <div className="px-3 py-2 text-sm text-muted-foreground">
                  No fields found
                </div>
              )}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
