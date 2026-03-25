"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
    Plus, 
    FileText, 
    Settings, 
    User, 
    ChevronUp, 
    ChevronDown,
    LayoutDashboard,
    LogOut
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getRecentProjects } from '@/lib/api';
import { useAuth } from '@/context/AuthContext';

type Project = {
    id: string;
    problem_statement: string;
    created_at: string;
};

export function Sidebar() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const currentProjectId = searchParams.get('projectId');
    
    const [projects, setProjects] = useState<Project[]>([]);
    const [fetchingProjects, setFetchingProjects] = useState(true);
    const { user, loading: authLoading, signOut } = useAuth();

    useEffect(() => {
        async function fetchProjects() {
            if (!user) {
                setFetchingProjects(false);
                return;
            }
            
            try {
                const data = await getRecentProjects(15);
                setProjects(data);
            } catch (err) {
                console.error("Failed to load projects", err);
            } finally {
                setFetchingProjects(false);
            }
        }
        
        if (!authLoading) {
            fetchProjects();
        }
    }, [user, authLoading]);

    const handleLogout = () => {
        signOut();
        router.push('/login');
    };


    const handleNewProject = () => {
        router.push('/');
    };

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    };

    return (
        <aside className="w-72 border-r border-zinc-200 bg-white flex flex-col h-full shadow-sm">
            {/* Logo */}
            <div className="p-6 flex items-center gap-3">
                <div className="bg-zinc-900 rounded-lg p-2">
                    <FileText className="h-6 w-6 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-zinc-900 tracking-tight">ProtoStruc</h1>
            </div>

            <div className="px-5 mb-6">
                <Button 
                    onClick={handleNewProject}
                    className="w-full bg-zinc-900 hover:bg-zinc-800 text-white font-bold py-6 rounded-xl flex items-center justify-center gap-2 text-lg shadow-lg shadow-zinc-200 transition-all active:scale-[0.98]"
                >
                    <Plus className="h-5 w-5 stroke-[3px]" />
                    New Project
                </Button>
            </div>

            {/* Recent Projects Section */}
            <div className="flex-1 flex flex-col min-h-0">
                <div className="px-6 py-2 flex items-center justify-between">
                    <h3 className="text-[11px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                        Recent Projects
                    </h3>
                    <ChevronUp className="h-4 w-4 text-zinc-300" />
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar px-3 space-y-1 py-2">
                    {fetchingProjects ? (
                        <div className="px-4 py-3 text-sm text-zinc-400 font-medium animate-pulse">Loading...</div>
                    ) : projects.length === 0 ? (
                        <div className="px-4 py-3 text-sm text-zinc-400 font-medium italic">No projects yet</div>
                    ) : (
                        projects.map((project) => {
                            const isActive = currentProjectId === project.id;
                            return (
                                <Link
                                    key={project.id}
                                    href={`/phases/all?projectId=${project.id}`}
                                    className={`flex items-start gap-3 p-3 rounded-xl transition-all group ${
                                        isActive 
                                            ? 'bg-zinc-100' 
                                            : 'hover:bg-zinc-50'
                                    }`}
                                >
                                    <div className={`mt-0.5 p-1.5 rounded-lg transition-colors ${
                                        isActive ? 'bg-zinc-900 text-white' : 'bg-transparent text-zinc-400 group-hover:text-zinc-600'
                                    }`}>
                                        <FileText className="h-4 w-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`text-sm font-bold truncate leading-tight mb-0.5 ${
                                            isActive ? 'text-zinc-900' : 'text-zinc-600 group-hover:text-zinc-900'
                                        }`}>
                                            {project.problem_statement || 'Untitled Project'}
                                        </div>
                                        <div className="text-[10px] font-bold text-zinc-400 tracking-wider">
                                            {formatDate(project.created_at)}
                                        </div>
                                    </div>
                                </Link>
                            );
                        })
                    )}
                </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-zinc-100 mt-auto bg-zinc-50/50">
                <div className="space-y-1">
                    <button className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-zinc-600 hover:text-zinc-900 hover:bg-zinc-100/80 rounded-xl transition-all group">
                        <Settings className="h-5 w-5 text-zinc-400 group-hover:text-zinc-900" />
                        Settings
                    </button>
                    <button 
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-600 hover:text-red-700 hover:bg-red-50 rounded-xl transition-all group"
                    >
                        <LogOut className="h-5 w-5 text-red-400 group-hover:text-red-600" />
                        Log out
                    </button>
                    <div className="flex items-center gap-3 px-4 py-3 border-t border-zinc-100 pt-4 mt-2">
                        <div className="h-9 w-9 rounded-full bg-zinc-900 text-white flex items-center justify-center font-black text-xs shrink-0 shadow-sm border border-zinc-700 uppercase">
                            {user?.email?.substring(0, 2) || '??'}
                        </div>
                        <div className="flex-1 min-w-0">
                            <div className="text-sm font-bold text-zinc-900 truncate">{user?.email || 'N/A'}</div>
                            <div className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest leading-none mt-0.5">
                                {user ? 'User' : 'Guest'}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #e4e4e7;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #d4d4d8;
                }
            `}</style>
        </aside>
    );
}
