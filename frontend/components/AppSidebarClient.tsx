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
import LogoutButton from "./LogoutButton";

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
    const [fieldsOpen, setFieldsOpen] = useState(true);

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
                                <SidebarMenuButton size='lg'
                                    onClick={() => setActivePage("home")}
                                    className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                                >
                                    <span className="font-medium text-green-900">Overview</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton size='lg'
                                    onClick={() => setActivePage("report")}
                                    className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                                >
                                    <span className="font-medium text-green-900">Report</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <SidebarMenuButton size='lg'
                                    onClick={() => setActivePage("profile")}
                                    className="w-full text-left px-3 py-2 rounded-lg transition-colors hover:bg-green-50 focus:outline-none focus:ring-2 focus:ring-green-200"
                                >
                                    <span className="font-medium text-green-900">Profile</span>
                                </SidebarMenuButton>
                            </SidebarMenuItem>

                            <SidebarMenuItem>
                                <div className="flex items-center justify-between">
                                    <button
                                        onClick={() => setFieldsOpen((v) => !v)}
                                        aria-expanded={fieldsOpen}
                                        aria-controls="fields-panel"
                                        className="w-full flex items-center justify-between px-3 py-2 rounded-lg hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200"
                                    >
                                        <div className="flex items-center gap-2">
                                            <span className="font-medium text-green-800">Fields</span>
                                            <span className="text-xs text-green-700/70">({fields?.length ?? 0})</span>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            {fieldsOpen ? <ChevronUp className="w-4 h-4 text-green-600" /> : <ChevronDown className="w-4 h-4 text-green-600" />}
                                        </div>
                                    </button>
                                </div>
                            </SidebarMenuItem>

                            {/* collapsible panel */}
                            <div
                                id="fields-panel"
                                className={`overflow-hidden transition-[max-height,opacity] duration-300 ${fieldsOpen ? "max-h-[1500px] opacity-100" : "max-h-0 opacity-0"
                                    }`}
                            >
                                {fields && fields.length > 0 ? (
                                    fields.map((field) => {
                                        const days = field.daywiseData ?? [];
                                        const isOpen = openFieldIds.includes(field.id);
                                        return (
                                            <div key={field.id} className="mb-3">
                                                <SidebarMenuItem>
                                                    <button
                                                        className={
                                                            "w-full flex items-center justify-between px-3 py-2 rounded-lg " +
                                                            "hover:bg-green-50 transition-colors focus:outline-none focus:ring-2 focus:ring-green-200 " +
                                                            (isOpen ? "bg-green-50" : "bg-transparent")
                                                        }
                                                        onClick={() => toggleField(field.id)}
                                                        aria-expanded={isOpen}
                                                        aria-controls={`field-days-${field.id}`}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <span className="inline-block w-1 h-1 rounded-full bg-green-400/90" />
                                                            <strong className="text-green-900">{field.name}</strong>
                                                            <span className="text-xs text-green-700/70">({field.location ?? "—"})</span>
                                                        </span>

                                                        <span className="ml-4 text-green-600">
                                                            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                                        </span>
                                                    </button>
                                                </SidebarMenuItem>

                                                {isOpen && (
                                                    <div id={`field-days-${field.id}`} className="pl-4 mt-2 space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <Button
                                                                size="sm"
                                                                onClick={() => {
                                                                    setActivePage("add-day");
                                                                    setSelectedFieldId(`${field.id}`);
                                                                }}
                                                                className="px-3 py-1 rounded-md bg-green-100 hover:bg-green-200 text-green-800"
                                                            >
                                                                Add data
                                                            </Button>
                                                            <span className="text-xs text-green-700/70">
                                                                {days.length} day{days.length !== 1 ? "s" : ""}
                                                            </span>
                                                        </div>

                                                        {days.length > 0 ? (
                                                            days.map((_, idx) => {
                                                                const dayIndex = idx + 1;
                                                                return (
                                                                    <SidebarMenuItem key={dayIndex}>
                                                                        <SidebarMenuButton
                                                                            onClick={() => {
                                                                                setActivePage(`field/${field.id}/day/${dayIndex}`);
                                                                                setSelectedFieldId(`${field.id}`);
                                                                            }}
                                                                            className="w-full text-left px-3 py-2 rounded-md hover:bg-green-50 text-green-800 transition-colors"
                                                                        >
                                                                            Day {dayIndex}
                                                                        </SidebarMenuButton>
                                                                    </SidebarMenuItem>
                                                                );
                                                            })
                                                        ) : (
                                                            <div className="px-3 py-2 text-sm text-green-700/60">No days yet</div>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        );
                                    })
                                ) : (
                                    <div className="px-3 py-2 text-sm text-green-700/60">No fields found</div>
                                )}
                            </div>
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>

            <SidebarFooter>
                <LogoutButton/>
            </SidebarFooter>
        </Sidebar >
    );
}
