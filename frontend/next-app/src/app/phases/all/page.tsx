"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { Suspense, useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ChevronDown,
    Layers,
    Target,
    Settings2,
    ShieldAlert,
    FileText,
    CheckCircle2,
    Clock,
    ArrowRight,
    Download,
    Lightbulb,
    AlertCircle,
    RotateCcw,
    Play,
    Lock
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { getProject, getPhase, runPhase } from "@/lib/api";
import { toPng } from 'html-to-image';
import jsPDF from 'jspdf';
import { ProtectedRoute } from "@/components/ProtectedRoute";

function PhasesContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const projectId = searchParams.get("projectId");
    const reportRef = useRef<HTMLDivElement>(null);

    const [project, setProject] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [generating, setGenerating] = useState(false);
    const [downloading, setDownloading] = useState(false);

    // Phase Data States
    const [p1Data, setP1Data] = useState<any>(null);
    const [p2Data, setP2Data] = useState<any>(null);
    const [p3Data, setP3Data] = useState<any>(null);

    const [expandedSections, setExpandedSections] = useState<string[]>(["phase1"]);

    useEffect(() => {
        if (projectId) {
            fetchAllData();
        }
    }, [projectId]);

    const fetchAllData = async () => {
        setLoading(true);
        try {
            const [projRes, r1, r2, r3] = await Promise.all([
                getProject(projectId!).catch(() => null),
                getPhase(projectId!, 'functional_decomposition').catch(() => null),
                getPhase(projectId!, 'morphological_chart').catch(() => null),
                getPhase(projectId!, 'risk_analysis').catch(() => null)
            ]);

            setProject(projRes);

            const parseData = (res: any) => {
                if (res?.human_approved_data && Object.keys(res.human_approved_data).length > 0) {
                    return res.human_approved_data;
                }
                return res?.ai_generated_data || null;
            };

            const getP1Array = (data: any) => {
                if (!data) return null;
                const state = data?.state || data;
                const tree = state?.functional_tree || state;
                if (tree?.main_functions) return tree.main_functions;
                if (tree?.root_function?.children) return tree.root_function.children;
                if (Array.isArray(tree)) return tree;
                if (tree?.root_function && typeof tree.root_function === 'object') return [tree.root_function];
                if (tree?.root_function && typeof tree.root_function === 'string') return [tree]; // Return the whole tree object so it prints something if there's no main_functions
                return [tree];
            };

            const getP2Array = (data: any) => {
                if (!data) return null;
                const state = data?.state || data;
                const alt = state?.morphological_alternatives || state?.mappings || state?.options || state;
                if (Array.isArray(alt)) return alt;
                return [alt];
            };

            const getP3Array = (data: any) => {
                if (!data) return null;
                const state = data?.state || data;
                const risks = state?.analysis || state?.swot || state?.risks || state;
                if (Array.isArray(risks)) return risks;
                return [risks];
            };

            setP1Data(getP1Array(parseData(r1)));
            setP2Data(getP2Array(parseData(r2)));
            setP3Data(getP3Array(parseData(r3)));
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateAll = async () => {
        if (!projectId) return;
        setGenerating(true);
        try {
            await runPhase(projectId, 'functional_decomposition');
            await fetchAllData();

            await runPhase(projectId, 'morphological_chart');
            await fetchAllData();

            await runPhase(projectId, 'risk_analysis');
            await fetchAllData();
        } catch (err: any) {
            alert(err.message || "Failed to generate analysis");
        } finally {
            setGenerating(false);
        }
    };

    const handleDownloadReport = async () => {
        if (!reportRef.current) return;
        setDownloading(true);

        const previousState = [...expandedSections];
        setExpandedSections(["phase1", "phase2", "phase3"]);

        // Wait for expanded sections to animate and render fully
        await new Promise(resolve => setTimeout(resolve, 800));

        try {
            const filter = (node: HTMLElement) => {
                if (node.classList && node.classList.contains('no-print')) {
                    return false;
                }
                return true;
            };

            const imgData = await toPng(reportRef.current, {
                quality: 1,
                backgroundColor: '#ffffff', // Force white background for the PDF report
                pixelRatio: 2,
                filter: filter
            });
            
            const pdf = new jsPDF('p', 'mm', 'a4');
            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();
            const imgProps = pdf.getImageProperties(imgData);
            const imgHeight = (imgProps.height * pdfWidth) / imgProps.width;
            
            let heightLeft = imgHeight;
            let position = 0;

            // Add the first page
            pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
            heightLeft -= pdfHeight;

            // Add subsequent pages
            while (heightLeft > 0) {
                position = heightLeft - imgHeight;
                pdf.addPage();
                // Add a small white rectangle at the top to cover edge artifacts (like the black line)
                pdf.setFillColor(255, 255, 255);
                pdf.rect(0, 0, pdfWidth, 2, 'F');
                pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, imgHeight, undefined, 'FAST');
                heightLeft -= pdfHeight;
            }

            pdf.save(`ProtoStruc_Report_${projectId?.substring(0, 8)}.pdf`);
        } catch (error) {
            console.error('Failed to generate PDF:', error);
            alert('Error generating PDF report.');
        } finally {
            setExpandedSections(previousState);
            setDownloading(false);
        }
    };

    const handleRefreshPhase = async (phaseName: string) => {
        if (!projectId) return;
        setGenerating(true);
        try {
            await runPhase(projectId, phaseName);
            await fetchAllData();
        } catch (err: any) {
            alert(err.message || "Failed to rerun phase");
        } finally {
            setGenerating(false);
        }
    };

    const toggleSection = (id: string) => {
        if (id === "phase2" && !p1Data) return;
        if (id === "phase3" && !p2Data) return;

        setExpandedSections(prev =>
            prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]
        );
    };

    if (!projectId) {
        return (
            <div className="flex flex-col items-center justify-center h-[80vh] text-center p-12">
                <div className="w-20 h-20 bg-muted/20 rounded-full flex items-center justify-center mb-8 border border-border shadow-sm">
                    <Layers className="w-10 h-10 text-muted-foreground/40" />
                </div>
                <h1 className="text-2xl font-bold text-foreground mb-2">No Project Selected</h1>
                <p className="max-w-md text-muted-foreground text-lg">
                    Select a project from the sidebar to view its decomposition phases.
                </p>
            </div>
        );
    }

    const formatDate = (dateString: string) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    const isAllGenerated = p1Data && p2Data && p3Data;

    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background text-foreground pb-24 transition-colors duration-300" ref={reportRef}>
                {/* Status Cards */}
                <div className="px-12 py-8 grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-card p-6 rounded-3xl border border-border shadow-sm"
                    >
                        <div className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-widest mb-4">Status</div>
                        <div className="flex items-center gap-3">
                            <div className={`h-2 w-2 rounded-full ${isAllGenerated ? 'bg-emerald-500' : 'bg-amber-500'} animate-pulse`} />
                            <span className="text-lg font-bold text-foreground">
                                {isAllGenerated ? "Verified" : "Under Analysis"}
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        className="bg-card p-6 rounded-3xl border border-border shadow-sm"
                    >
                        <div className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-widest mb-4">Milestones</div>
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-foreground">
                                {[p1Data, p2Data, p3Data].filter(Boolean).length}/3 Completed
                            </span>
                        </div>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="bg-card p-6 rounded-3xl border border-border shadow-sm"
                    >
                        <div className="text-[11px] font-black text-muted-foreground/40 uppercase tracking-widest mb-4">Created</div>
                        <div className="flex items-center gap-3">
                            <span className="text-lg font-bold text-foreground">{project ? formatDate(project.created_at) : "--/--/----"}</span>
                        </div>
                    </motion.div>
                </div>

                {/* Main Content Sections */}
                <div className="px-12 space-y-4">

                    {/* Phase 1 Accordion */}
                    <AccordionSection
                        id="phase1"
                        name="Product Breakdown"
                        status={p1Data ? "APPROVED" : "PENDING"}
                        isExpanded={expandedSections.includes("phase1")}
                        onToggle={() => toggleSection("phase1")}
                        onRerun={() => handleRefreshPhase('functional_decomposition')}
                        running={generating}
                        idx={0}
                    >
                        {p1Data ? (
                            <div className="space-y-4">
                                <div className="grid grid-cols-[80px_1fr] border-b border-border text-[10px] font-bold uppercase tracking-widest text-muted-foreground pb-4">
                                    <div className="text-center">#</div>
                                    <div>Functional Requirement</div>
                                </div>
                                <div className="divide-y divide-border/50">
                                    {p1Data.map((item: any, i: number) => (
                                        <div key={i} className="grid grid-cols-[80px_1fr] py-6 group">
                                            <div className="text-center text-muted-foreground/30 font-bold">{i + 1}</div>
                                            <div>
                                                <h4 className="font-bold text-foreground mb-2">{item.function || item.title}</h4>
                                                {(item.sub_functions || item.children) && (
                                                    <div className="pl-4 border-l-2 border-border/40 space-y-1">
                                                        {(item.sub_functions || item.children).map((c: any, ci: number) => (
                                                            <div key={ci} className="text-sm text-muted-foreground flex items-center gap-2">
                                                                <div className="h-1 w-1 rounded-full bg-muted-foreground/30" />
                                                                {c.function || c.title}
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        ) : <NoDataPlaceholder onGenerate={() => handleRefreshPhase('functional_decomposition')} loading={generating} />}
                    </AccordionSection>

                    {/* Phase 2 Accordion */}
                    <AccordionSection
                        id="phase2"
                        name="Solution Alternatives Matrix"
                        status={p2Data ? "APPROVED" : (p1Data ? "PENDING" : "LOCKED")}
                        isLocked={!p1Data}
                        isExpanded={expandedSections.includes("phase2")}
                        onToggle={() => toggleSection("phase2")}
                        onRerun={() => handleRefreshPhase('morphological_chart')}
                        running={generating}
                        idx={1}
                    >
                        {p2Data ? (
                            <div className="divide-y divide-border/30">
                                {p2Data.map((item: any, index: number) => (
                                    <div key={index} className="grid grid-cols-1 md:grid-cols-[240px_1fr] py-8 gap-8">
                                        <div className="flex items-center gap-4">
                                            <div className="h-10 w-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center">
                                                <Lightbulb className="h-5 w-5" />
                                            </div>
                                            <h4 className="font-bold text-foreground">{item.function || `Block ${index + 1}`}</h4>
                                        </div>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                            {(item.solutions || item.options || []).map((sol: any, sIdx: number) => (
                                                <div key={sIdx} className="p-4 rounded-2xl border border-border bg-muted/20 hover:border-primary transition-colors group">
                                                    <div className="text-sm font-bold text-foreground mb-1">{typeof sol === 'string' ? sol : (sol.principle || sol.name)}</div>
                                                    <div className="text-[11px] text-muted-foreground leading-relaxed truncate group-hover:whitespace-normal">
                                                        {typeof sol === 'object' && (sol.description || sol.rationale)}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : <NoDataPlaceholder onGenerate={() => handleRefreshPhase('morphological_chart')} loading={generating} />}
                    </AccordionSection>

                    {/* Phase 3 Accordion */}
                    <AccordionSection
                        id="phase3"
                        name="Design Evaluation"
                        status={p3Data ? "APPROVED" : (p2Data ? "PENDING" : "LOCKED")}
                        isLocked={!p2Data}
                        isExpanded={expandedSections.includes("phase3")}
                        onToggle={() => toggleSection("phase3")}
                        onRerun={() => handleRefreshPhase('risk_analysis')}
                        running={generating}
                        idx={2}
                    >
                        {p3Data ? (
                            <div className="space-y-6 overflow-x-auto">
                                <div className="min-w-[1240px]">
                                    <div className="grid grid-cols-[140px_160px_1fr_1fr_1fr_1fr_1.5fr] text-[10px] font-bold uppercase tracking-widest text-muted-foreground/40 border-b border-border pb-4 mb-4 px-2">
                                        <div>Function</div>
                                        <div>Alternative</div>
                                        <div>Strength</div>
                                        <div>Weakness</div>
                                        <div>Opportunity</div>
                                        <div>Threat</div>
                                        <div>Working Plan</div>
                                    </div>
                                    <div className="space-y-4">
                                        {p3Data.map((item: any, i: number) => (
                                            <div key={i} className="grid grid-cols-[140px_160px_1fr_1fr_1fr_1fr_1.5fr] gap-4 py-4 border-b border-border last:border-0 hover:bg-muted/10 transition-colors rounded-xl px-2">
                                                <div className="text-sm font-bold text-foreground pr-2">{item.function_name || "-"}</div>
                                                <div className="text-sm font-bold text-muted-foreground pr-2 italic">{item.solution_name || "-"}</div>
                                                <div className="text-xs text-foreground/80 leading-relaxed bg-emerald-500/10 p-3 rounded-xl border border-emerald-500/20">{item.strength || "-"}</div>
                                                <div className="text-xs text-foreground/80 leading-relaxed bg-rose-500/10 p-3 rounded-xl border border-rose-500/20">{item.weakness || "-"}</div>
                                                <div className="text-xs text-foreground/80 leading-relaxed bg-blue-500/10 p-3 rounded-xl border border-blue-500/20">{item.opportunity || "-"}</div>
                                                <div className="text-xs text-foreground/80 leading-relaxed bg-amber-500/10 p-3 rounded-xl border border-amber-500/20">{item.threat || "-"}</div>
                                                <div className="text-xs text-foreground/80 leading-relaxed bg-muted/20 p-3 rounded-xl border border-border/50">{item.working_plan || "-"}</div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ) : <NoDataPlaceholder onGenerate={() => handleRefreshPhase('risk_analysis')} loading={generating} />}
                    </AccordionSection>

                    {/* Final Design Report Section */}
                    {!isAllGenerated ? (
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-sm no-print"
                        >
                            <div className="p-12 flex flex-col items-center text-center">
                                <div className="h-16 w-16 rounded-full bg-muted/10 border border-border flex items-center justify-center mb-6 text-muted-foreground/60 font-bold text-xl">
                                    4
                                </div>
                                <h2 className="text-2xl font-extrabold text-foreground mb-8">Final Design Report</h2>

                                <div className="w-full max-w-4xl p-12 rounded-[2rem] border-2 border-dashed border-border/30 bg-muted/5 flex flex-col items-center">
                                    <FileText className="h-10 w-10 text-muted-foreground/20 mb-4" />
                                    <p className="text-muted-foreground font-medium mb-8">
                                        Complete all design phases above to generate the final engineering report.
                                    </p>
                                    <Button
                                        disabled={true}
                                        className="bg-primary/20 cursor-not-allowed text-primary-foreground/50 font-bold px-8 py-6 rounded-xl flex items-center gap-3 shadow-lg"
                                    >
                                        <Lock className="h-4 w-4" />
                                        Generate PDF Report
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    ) : (
                         <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="bg-card rounded-[2rem] border border-border overflow-hidden shadow-xl mt-8 no-print"
                        >
                            <div className="p-12 flex flex-col items-center text-center">
                                <h2 className="text-3xl font-extrabold text-foreground mb-6 tracking-tight">Final Report</h2>
                                <p className="text-muted-foreground max-w-xl mx-auto mb-10 font-medium">
                                    Your comprehensive engineering dossier has been compiled and is ready for high-fidelity export.
                                </p>

                                <div className="w-full max-w-4xl p-12 rounded-[2rem] border-2 border-dashed border-border/30 bg-muted/5 flex flex-col items-center transition-all hover:bg-muted/10">
                                    <FileText className="h-12 w-12 text-muted-foreground/20 mb-6" />
                                    <Button
                                        onClick={handleDownloadReport}
                                        disabled={downloading}
                                        className="bg-primary hover:bg-primary/90 text-primary-foreground font-black px-12 py-8 rounded-2xl flex items-center gap-4 shadow-xl transition-all active:scale-95 disabled:opacity-50 text-xl"
                                    >
                                        {downloading ? <Clock className="h-6 w-6 animate-spin" /> : <Download className="h-6 w-6" />}
                                        {downloading ? "Formatting PDF..." : "Generate Final Report"}
                                    </Button>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
}

function AccordionSection({ id, name, status, isExpanded, isLocked, onToggle, onRerun, running, children, idx }: any) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 + (idx * 0.1) }}
            className={`bg-card rounded-[2rem] border overflow-hidden shadow-sm transition-all duration-300 ${isLocked ? 'border-border/20 opacity-40 grayscale pointer-events-none' : 'border-border hover:shadow-md'
                }`}
        >
            <div className="w-full px-8 py-7 flex items-center justify-between group">
                <button
                    onClick={onToggle}
                    disabled={isLocked}
                    className="flex-1 flex items-center gap-6 text-left"
                >
                    <div className={`h-12 w-12 rounded-2xl flex items-center justify-center border transition-colors ${isLocked ? 'bg-muted/10 text-muted-foreground/20 border-border/20' :
                            status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                "bg-muted/10 text-muted-foreground/30 border-border"
                        }`}>
                        {isLocked ? <Lock className="h-5 w-5" /> : <CheckCircle2 className="h-6 w-6" />}
                    </div>
                    <div className="flex items-center gap-4">
                        <h2 className="text-xl font-extrabold text-foreground tracking-tight">{name}</h2>
                        <div className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest rounded-full border no-print ${isLocked ? 'bg-muted/10 text-muted-foreground/20 border-border/20' :
                                status === "APPROVED" ? "bg-emerald-500/10 text-emerald-600 border-emerald-500/20" :
                                    "bg-muted/20 text-muted-foreground/40 border-border/50"
                            }`}>
                            {status}
                        </div>
                    </div>
                </button>

                {!isLocked && (
                    <div className="flex items-center gap-6 no-print">
                        {status === "APPROVED" && (
                            <Button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    onRerun();
                                }}
                                disabled={running}
                                variant="outline"
                                className="bg-muted/20 border-border text-foreground font-bold px-4 py-2 h-9 rounded-xl flex items-center gap-2 hover:bg-muted/40 transition-all active:scale-95 disabled:opacity-50"
                            >
                                {running ? <Clock className="h-3.5 w-3.5 animate-spin" /> : <Play className="h-3.5 w-3.5 fill-current" />}
                                <span className="text-[12px]">{running ? "Processing..." : "Re-run Analysis"}</span>
                            </Button>
                        )}
                        <button onClick={onToggle}>
                            <ChevronDown className={`h-5 w-5 text-muted-foreground/40 transition-transform duration-500 ${isExpanded ? 'rotate-180' : ''}`} />
                        </button>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isExpanded && !isLocked && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                    >
                        <div className="px-8 pb-10 pt-2 border-t border-border/30">
                            {children}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
}


function NoDataPlaceholder({ onGenerate, loading }: any) {
    return (
        <div className="py-20 flex flex-col items-center text-center">
            <div className="h-16 w-16 bg-muted/10 rounded-full flex items-center justify-center mb-6 border border-border text-muted-foreground/20">
                <AlertCircle className="h-8 w-8" />
            </div>
            <h3 className="text-lg font-bold text-foreground mb-2">No data generated yet</h3>
            <p className="text-muted-foreground text-sm max-w-xs mb-8">
                Initiate the unified analysis to populate this section with engineering data.
            </p>
            <Button
                onClick={onGenerate}
                disabled={loading}
                className="bg-primary text-primary-foreground rounded-xl px-8 h-12 font-bold gap-2"
            >
                {loading ? <Clock className="h-4 w-4 animate-spin" /> : <Target className="h-4 w-4" />}
                {loading ? "Generating..." : "Initiate Full Analysis"}
            </Button>
        </div>
    );
}

export default function AllPhasesPage() {
    return (
        <Suspense fallback={
            <div className="flex items-center justify-center h-screen bg-background text-foreground">
                <div className="flex flex-col items-center">
                    <div className="relative w-16 h-16 mb-6">
                        <motion.div className="absolute inset-0 border-4 border-zinc-100 rounded-full" />
                        <motion.div
                            className="absolute inset-0 border-4 border-zinc-900 rounded-full border-t-transparent"
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        />
                    </div>
                    <span className="text-sm font-bold text-zinc-400 tracking-[0.2em] uppercase text-center ml-2">Assembling Dashboard...</span>
                </div>
            </div>
        }>
            <PhasesContent />
        </Suspense>
    );
}