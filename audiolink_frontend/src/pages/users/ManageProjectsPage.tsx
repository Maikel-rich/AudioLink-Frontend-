import { useState, useMemo, useEffect } from 'react';
import Sidebar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Button";
import ProjectRow from "@/components/project/ProjectRow";
import ProjectCardGrid from "@/components/project/ProjectCardGrid";
import ProjectInspector from "@/components/project/ProjectInspector";
import { Plus, LayoutGrid, List as ListIcon, RefreshCw, AlertTriangle, MonitorX } from 'lucide-react';
import { projectService, ProjectData } from '@/services/projectService';
import { authService } from '@/services/authService';

type ProjectVisualStatus = "active" | "mixing" | "mastering" | "review" | "in_progress";

const ManageProjectsPage = () => {
    const [role, setRole] = useState<'artist' | 'producer'>(() => {
        return authService.getUserRoleLocal() || 'artist';
    });

    const [projects, setProjects] = useState<ProjectData[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    const [search, setSearch] = useState("");
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);
    const [statusFilter, setStatusFilter] = useState<string>("All");

    const fetchProjects = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const data = await projectService.getAllProjects();

            const uniqueProjects = [];
            const seenIds = new Set();

            for (const project of data) {
                if (!seenIds.has(project.id)) {
                    seenIds.add(project.id);
                    uniqueProjects.push(project);
                }
            }

            setProjects(uniqueProjects);
        } catch (err) {
            setError("Error de enlace con el servidor de audio.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        const localRole = authService.getUserRoleLocal();
        if (localRole) setRole(localRole);
        fetchProjects();
    }, []);

    const getVisualStatus = (progress: number): ProjectVisualStatus => {
        if (progress === 0) return 'in_progress';
        if (progress <= 30) return 'in_progress';
        if (progress <= 60) return 'mixing';
        if (progress <= 90) return 'mastering';
        return 'review';
    };

    const filteredProjects = useMemo(() => {
        return projects.filter(project => {
            const collaboratorName = role === 'artist'
                ? (project.producer?.fullName || "Productor Desconocido")
                : (project.artist?.fullName || "Artista Desconocido");

            const matchesSearch = search.trim() === "" ||
                project.title.toLowerCase().includes(search.toLowerCase()) ||
                collaboratorName.toLowerCase().includes(search.toLowerCase());

            const isProjectCompleted = project.progressPercentage === 100;
            let matchesStatus = true;

            if (statusFilter === "Active") {
                matchesStatus = !isProjectCompleted;
            } else if (statusFilter === "Completed") {
                matchesStatus = isProjectCompleted;
            }

            return matchesSearch && matchesStatus;
        });
    }, [projects, search, statusFilter, role]);

    const getLastUpdate = (project: ProjectData): string => {
        if (project.createdAt) {
            return new Date(project.createdAt).toLocaleDateString();
        }
        return 'Reciente';
    };

    return (
        <div className="flex w-screen h-screen bg-[#060608] overflow-hidden text-light">
            <Sidebar userType={role} isCollapsed={false} />

            <main className="flex-1 flex flex-col min-w-0 bg-[#08080a] overflow-y-auto relative px-12 py-10 antialiased font-sans">

                <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12 shrink-0">
                    <div>
                        <h1 className="text-3xl font-black uppercase tracking-tighter">
                            {role === 'artist' ? 'Mis Proyectos' : 'Consola de Producción'}
                        </h1>
                        <p className="text-xs text-subtitle uppercase tracking-[0.2em] font-black mt-1">
                            {role === 'artist'
                                ? 'Seguimiento de tus producciones en curso'
                                : 'Gestiona el progreso y entrega archivos finales'}
                        </p>
                    </div>
                </header>

                <div className="flex flex-col md:flex-row gap-4 items-center justify-between mb-8 shrink-0 bg-dark/40 p-4 border border-white/5 rounded-2xl">
                    <div className="w-full md:w-96">
                        <SearchBar
                            placeholder={role === 'artist' ? "Buscar por tema o productor..." : "Buscar por tema o artista..."}
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>

                    <div className="flex gap-3 w-full md:w-auto justify-end items-center">
                        <div className="flex rounded-xl bg-black/40 p-1 border border-white/5">
                            {['All', 'Active', 'Completed'].map((status) => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all duration-200 ${statusFilter === status
                                        ? (role === 'artist' ? 'bg-artist text-white' : 'bg-producer text-dark font-black')
                                        : 'text-subtitle/60 hover:text-light'
                                        }`}
                                >
                                    {status === 'All' ? 'Todos' : status === 'Active' ? 'Activos' : 'Terminados'}
                                </button>
                            ))}
                        </div>

                        <div className="flex rounded-xl bg-black/40 p-1 border border-white/5 shrink-0">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-white/5 text-light' : 'text-subtitle/40 hover:text-light/60'}`}
                            >
                                <ListIcon size={16} />
                            </button>
                            <button
                                onClick={() => setViewMode('grid')}
                                className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-white/5 text-light' : 'text-subtitle/40 hover:text-light/60'}`}
                            >
                                <LayoutGrid size={16} />
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex-1 min-h-0 relative">
                    {isLoading ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#060608]/50 backdrop-blur-xs rounded-4xl">
                            <RefreshCw size={32} className={role === 'artist' ? 'text-artist animate-spin mb-4' : 'text-producer animate-spin mb-4'} />
                            <p className="text-[10px] font-black text-subtitle uppercase tracking-[0.2em]">Sincronizando pistas de audio...</p>
                        </div>
                    ) : error ? (
                        <div className="flex flex-col items-center justify-center py-24 border border-error/20 bg-error/5 rounded-4xl text-center px-6">
                            <AlertTriangle size={40} className="text-error mb-4" />
                            <p className="text-sm font-black text-error uppercase tracking-wider">{error}</p>
                            <Button variant="outline" size="sm" onClick={fetchProjects} className="mt-4 text-[10px] font-black tracking-widest">
                                REINTENTAR CONEXIÓN
                            </Button>
                        </div>
                    ) : filteredProjects.length > 0 ? (
                        viewMode === 'list' ? (
                            <div className="space-y-3.5 pb-24">
                                {filteredProjects.map((project) => {
                                    const visualStatus = getVisualStatus(project.progressPercentage);

                                    return (
                                        <div key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                                            <ProjectRow
                                                title={project.title}
                                                artist={project.artist ? { id: project.artist.id || 0, fullName: project.artist.fullName ?? "Artista Desconocido", profilePicture: project.artist.profilePicture } : null}
                                                producer={project.producer ? { id: project.producer.id || 0, fullName: project.producer.fullName ?? "Productor Desconocido", profilePicture: project.producer.profilePicture } : null}
                                                status={visualStatus}
                                                progress={project.progressPercentage}
                                                lastUpdate={getLastUpdate(project)}
                                                category="Estudio"
                                                isSelected={selectedProject?.id === project.id}
                                                userRole={role}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pb-24">
                                {filteredProjects.map((project) => {
                                    const visualStatus = getVisualStatus(project.progressPercentage);

                                    return (
                                        <div key={project.id} onClick={() => setSelectedProject(project)} className="cursor-pointer">
                                            <ProjectCardGrid
                                                title={project.title}
                                                artist={project.artist ? { id: project.artist.id || 0, fullName: project.artist.fullName ?? "Artista Desconocido", profilePicture: project.artist.profilePicture } : null}
                                                producer={project.producer ? { id: project.producer.id || 0, fullName: project.producer.fullName ?? "Productor Desconocido", profilePicture: project.producer.profilePicture } : null}
                                                status={visualStatus}
                                                progress={project.progressPercentage}
                                                lastUpdate={getLastUpdate(project)}
                                                category="Estudio"
                                                isSelected={selectedProject?.id === project.id}
                                                userRole={role}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                        )
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-4xl bg-white/5">
                            <MonitorX size={40} className="text-subtitle/20 mb-3" />
                            <p className="text-light/60 font-bold text-xs uppercase tracking-tight">
                                No se han encontrado sesiones con los parámetros actuales.
                            </p>
                        </div>
                    )}
                </div>

                <ProjectInspector
                    project={selectedProject ? {
                        id: selectedProject.id,
                        title: selectedProject.title,
                        artist: selectedProject.artist ? {
                            fullName: selectedProject.artist.fullName ?? "Artista Desconocido",
                            email: ""
                        } : null,
                        producer: selectedProject.producer ? {
                            fullName: selectedProject.producer.fullName ?? "Productor Desconocido",
                            email: ""
                        } : null,
                        currentStageName: selectedProject.currentStageName,
                        progressPercentage: selectedProject.progressPercentage,
                        isPaid: selectedProject.isPaid,
                        finalAudioUrl: selectedProject.finalAudioUrl,
                        isFinalAudioAvailable: selectedProject.isFinalAudioAvailable
                    } : null}
                    onClose={() => setSelectedProject(null)}
                    userRole={role}
                    onUpdate={fetchProjects}
                />
            </main>
        </div>
    );
};

export default ManageProjectsPage;