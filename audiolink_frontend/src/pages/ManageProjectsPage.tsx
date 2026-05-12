import { useState, useMemo } from 'react';
import Sidebar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";
import Button from "@/components/Button";
import ProjectRow from "@/components/ProjectRow";
import ProjectCardGrid from "@/components/ProjectCardGrid";
import ProjectInspector from "@/components/ProjectInspector";
import CreateProjectModal from "@/components/CreateProjectModal";
import { Plus, Layers, LayoutGrid, List as ListIcon, ChevronDown, MonitorX } from 'lucide-react';

const ManageProjectsPage = () => {
    const [search, setSearch] = useState("");
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');
    const [selectedProject, setSelectedProject] = useState<any>(null);
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");

    const projects = [
        { title: "Neon Nights - EP", artist: "Kael Beats", status: "Mixing" as const, progress: 65, lastUpdate: "12 MAY 2024", category: "Electronic", participants: ["https://randomuser.me/api/portraits/men/32.jpg", "https://randomuser.me/api/portraits/women/44.jpg"] },
        { title: "Midnight Sessions", artist: "Elena Rose", status: "In Progress" as const, progress: 30, lastUpdate: "11 MAY 2024", category: "R&B / Soul", participants: ["https://randomuser.me/api/portraits/women/44.jpg"] },
        { title: "Urban Rhythm", artist: "Dímelo Flow", status: "Review" as const, progress: 95, lastUpdate: "09 MAY 2024", category: "Reggaeton", participants: ["https://randomuser.me/api/portraits/men/46.jpg"] },
        { title: "Acoustic Dreams", artist: "Mark V", status: "Mastering" as const, progress: 85, lastUpdate: "01 MAY 2024", category: "Indie Pop", participants: ["https://randomuser.me/api/portraits/men/12.jpg"] },
    ];

    const filteredProjects = useMemo(() => {
        return projects.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) || p.artist.toLowerCase().includes(search.toLowerCase());
            const matchesStatus = statusFilter === "All" || p.status === statusFilter;
            const matchesCategory = categoryFilter === "All" || p.category === categoryFilter;
            return matchesSearch && matchesStatus && matchesCategory;
        });
    }, [search, statusFilter, categoryFilter]);

    return (
        <div className="flex h-screen w-full bg-[#08080a] text-light overflow-hidden">
            <Sidebar userType="artist" isCollapsed={false} />

            <main className="flex-1 flex relative overflow-hidden">
                <div className={`flex-1 flex flex-col overflow-y-auto custom-scrollbar transition-all duration-500 ease-in-out ${selectedProject ? 'mr-100' : 'mr-0'}`}>

                    <header className="px-10 py-8 flex justify-between items-end sticky top-0 bg-[#08080a]/80 backdrop-blur-md z-20 shrink-0">
                        <div>
                            <div className="flex items-center gap-3 mb-2 font-black">
                                <Layers size={18} className="text-artist animate-pulse" />
                                <span className="text-[10px] text-artist uppercase tracking-[0.4em]">Gestor de Proyectos</span>
                            </div>
                            <h1 className="text-3xl font-black tracking-tighter uppercase text-light">Tus Sesiones</h1>
                        </div>
                        <div className="flex items-center gap-4">
                            <div className="flex bg-gray-dark/50 p-1 rounded-xl border border-white/5">
                                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg transition-all ${viewMode === 'list' ? 'bg-artist text-white shadow-lg shadow-artist/20' : 'text-subtitle/40'}`}><ListIcon size={18} /></button>
                                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg transition-all ${viewMode === 'grid' ? 'bg-artist text-white shadow-lg shadow-artist/20' : 'text-subtitle/40'}`}><LayoutGrid size={18} /></button>
                            </div>
                            <Button onClick={() => setIsModalOpen(true)} className="h-12 px-8 uppercase font-black tracking-widest text-[11px] rounded-xl"><Plus size={18} className="mr-2" /> Nueva Sesión</Button>
                        </div>
                    </header>

                    <div className="px-10 py-6 mx-10 mb-8 bg-gray-dark/30 border border-white/5 rounded-2xl flex gap-6 items-center sticky top-30 z-10 backdrop-blur-sm shrink-0">
                        <div className="w-96"><SearchBar value={search} onChange={(e) => setSearch(e.target.value)} /></div>
                        <div className="flex items-center gap-6 ml-auto">
                            <div className="relative group">
                                <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="bg-transparent text-[10px] font-black text-subtitle/60 uppercase tracking-widest outline-none cursor-pointer pr-5 appearance-none hover:text-light transition-colors">
                                    <option className="bg-[#0b0b0d]" value="All">TODOS LOS ESTADOS</option>
                                    <option className="bg-[#0b0b0d]" value="In Progress">EN PROGRESO</option>
                                    <option className="bg-[#0b0b0d]" value="Mixing">MEZCLA</option>
                                    <option className="bg-[#0b0b0d]" value="Mastering">MASTERIZACIÓN</option>
                                    <option className="bg-[#0b0b0d]" value="Review">REVISIÓN</option>
                                </select>
                                <ChevronDown size={12} className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none text-subtitle/40" />
                            </div>
                        </div>
                    </div>

                    <div className="px-10 pb-20">
                        {filteredProjects.length > 0 ? (
                            viewMode === 'list' ? (
                                <div className="flex flex-col gap-2">
                                    {filteredProjects.map((p, i) => (
                                        <div key={i} onClick={() => setSelectedProject(p)} className="cursor-pointer">
                                            <ProjectRow {...p} isSelected={selectedProject?.title === p.title} />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredProjects.map((p, i) => (
                                        <div key={i} onClick={() => setSelectedProject(p)} className="cursor-pointer">
                                            <ProjectCardGrid {...p} isSelected={selectedProject?.title === p.title} />
                                        </div>
                                    ))}
                                </div>
                            )
                        ) : (
                            <div className="flex flex-col items-center justify-center py-32 border-2 border-dashed border-white/5 rounded-4xl bg-white/1">
                                <div className="p-6 bg-white/2 rounded-full mb-6 relative">
                                    <MonitorX size={48} className="text-subtitle/20" />
                                    <div className="absolute inset-0 bg-artist/10 blur-3xl rounded-full" />
                                </div>
                                <p className="text-light/60 font-bold text-sm uppercase tracking-tight">
                                    No se han encontrado sesiones con los parámetros actuales.
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                <ProjectInspector project={selectedProject} onClose={() => setSelectedProject(null)} />
            </main>
            <CreateProjectModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
        </div>
    );
};

export default ManageProjectsPage;