import { Sidebar } from "@/components/Sidebar";

export default function PhasesLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <div className="flex h-screen bg-background text-foreground">
            <Sidebar />
            <main className="flex-1 overflow-auto">
                {children}
            </main>
        </div>
    );
}
