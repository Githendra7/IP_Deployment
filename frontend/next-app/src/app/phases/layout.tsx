import React, { Suspense } from "react";
import { Sidebar } from "@/components/Sidebar";

export default function PhasesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <Suspense fallback={<div className="w-72 border-r border-zinc-200 bg-white h-full" />}>
                <Sidebar />
            </Suspense>
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
