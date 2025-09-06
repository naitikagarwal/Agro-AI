"use client";

import React, { useState } from "react";
import Link from "next/link";
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
    SidebarFooter,
} from "@/components/ui/sidebar";
import { ChevronDown, ChevronUp } from "lucide-react";
import FieldModal from "./FieldModal";
import { Button } from "./ui/button";

type DaywiseItem = {
    id: number;
    date?: string;
};

type Field = {
    id: number;
    name: string;
    location?: string;
    daywiseData?: DaywiseItem[];
    daywiseResults?: any[];
    finalResults?: any[];
};

type Props = {
    fields: Field[];
    setActivePage: (page: string) => void;
    setSelectedFieldId: (fieldId: string) => void;
};

export function AppSidebarClient({ fields, setActivePage, setSelectedFieldId }: Props) {
    const [openFieldIds, setOpenFieldIds] = useState<number[]>([]);

    const toggleField = (id: number) => {
        setOpenFieldIds((prev) =>
            prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
        );
    };

    return (
        <Sidebar>
            <SidebarHeader className="px-3 py-3">
                <SidebarMenu className="text-lg font-semibold tracking-wide text-slate-900 dark:text-slate-100">
                    <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-lg bg-emerald-600 flex items-center justify-center text-white font-bold">
                            AI
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">AgroAI</h1>
                            <p className="text-xs text-slate-500 -mt-0.5">
                                Precision crop intelligence
                            </p>
                        </div>
                    </div>
                </SidebarMenu>
                <FieldModal />
            </SidebarHeader>

            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {/* Static Menu Items */}
                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => setActivePage("home")}>
                                    Overview
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => setActivePage("report")}>
                                    Report
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton onClick={() => setActivePage("profile")}>
                                    Profile
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton asChild>
                                    <Link href="/upload">Upload</Link>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            {/* Fields Section */}
                            <SidebarGroupLabel className="mt-4">Fields</SidebarGroupLabel>

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

                                            {isOpen && (
                                                <div
                                                    id={`field-days-${field.id}`}
                                                    className="pl-4 mt-1 space-y-1"
                                                >
                                                    <Button
                                                        onClick={() => {
                                                            setActivePage("add-day");
                                                            setSelectedFieldId(`${field.id}`);
                                                        }}
                                                    >add data</Button>
                                                    {days.length > 0 ? (
                                                        days.map((_, idx) => {
                                                            const dayIndex = idx + 1;
                                                            return (
                                                                <SidebarMenuItem key={dayIndex}>
                                                                    <SidebarMenuButton >
                                                                        Day {dayIndex}
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

            <SidebarFooter>
                <Button variant={"destructive"} className="w-full">
                    Logout
                </Button>
            </SidebarFooter>
        </Sidebar >
    );
}
