import React, { useState, useEffect } from 'react';
import Sidebar from "@/components/SideBar";
import { Download, Music, Calendar, User, Loader2, Headphones, CheckCircle, Disc, FileAudio, Star, Clock, Library, RefreshCw } from 'lucide-react';
import api from '@/services/api';
import { projectService, ProjectData } from '@/services/projectService';

interface PurchasedBeat {
    id: number;
    beatId: number;
    title: string;
    genre: string;
    bpm: number;
    keySignature: string;
    pricePaid: string;
    licenseType: string;
    purchaseDate: string;
    downloadUrl: string;
    taggedAudioUrl: string;
    coverUrl: string;
    producer: {
        id: number;
        name: string;
    };
}

const FinishedProjectsPage = () => {
    const [beats, setBeats] = useState<PurchasedBeat[]>([]);
    const [finishedProjects, setFinishedProjects] = useState<ProjectData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState<number | null>(null);
    const [activeTab, setActiveTab] = useState<'beats' | 'projects'>('beats');

    const loadLibrary = async () => {
        try {
            setIsLoading(true);

            try {
                const beatsResponse = await api.get('/beat-purchases/my-library');
                setBeats(beatsResponse.data);
            } catch (error) {
                setBeats([]);
            }

            try {
                const projectsResponse = await projectService.getAllProjects();
                const completed = projectsResponse.filter(p => p.progressPercentage === 100);
                setFinishedProjects(completed);
            } catch (error) {
                setFinishedProjects([]);
            }

        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsLoading(false);
        }
    };

    const handleDownload = async (beat: PurchasedBeat) => {
        setDownloadingId(beat.id);
        try {
            const response = await api.get(`/beat-purchases/${beat.id}/download`);
            const { downloadUrl, fileName } = response.data;

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setDownloadingId(null);
        }
    };

    useEffect(() => {
        loadLibrary();
    }, []);

    const formatDate = (dateStr: string) => {
        return new Date(dateStr).toLocaleDateString('es-ES', {
            day: '2-digit',
            month: 'long',
            year: 'numeric'
        });
    };

    const totalItems = beats.length + finishedProjects.length;

    return (
        <div className="flex bg-[#070708] min-h-screen text-light">
            <Sidebar userType="artist" isCollapsed={false} />

            <main className="flex-1 min-w-0 overflow-y-auto px-4 md:px-12 pt-8 pb-32">
                <header className="mb-8 border-b border-white/5 pb-6">
                    <div className="flex items-center gap-2 text-artist font-black text-[10px] tracking-[0.3em] uppercase mb-1">
                        <Library size={12} /> Mi Biblioteca
                    </div>
                    <div className="flex justify-between items-end flex-wrap gap-4">
                        <div>
                            <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
                                Colección <span className="text-subtitle/30">Musical</span>
                            </h1>
                            <p className="text-[11px] text-subtitle/40 mt-2">
                                {totalItems} elemento{totalItems !== 1 ? 's' : ''} en tu biblioteca
                            </p>
                        </div>
                        <button
                            onClick={loadLibrary}
                            className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                        >
                            <RefreshCw size={12} />
                            Actualizar
                        </button>
                    </div>
                </header>

                <div className="flex gap-1 mb-8 border-b border-white/5">
                    <button
                        onClick={() => setActiveTab('beats')}
                        className={`px-6 py-3 text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === 'beats'
                            ? 'text-artist border-b-2 border-artist'
                            : 'text-subtitle/40 hover:text-light'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <Music size={14} />
                            Beats Adquiridos ({beats.length})
                        </div>
                    </button>
                    <button
                        onClick={() => setActiveTab('projects')}
                        className={`px-6 py-3 text-[11px] font-black uppercase tracking-wider transition-all ${activeTab === 'projects'
                            ? 'text-artist border-b-2 border-artist'
                            : 'text-subtitle/40 hover:text-light'
                            }`}
                    >
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} />
                            Proyectos Terminados ({finishedProjects.length})
                        </div>
                    </button>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-32">
                        <Loader2 size={32} className="animate-spin text-artist" />
                    </div>
                ) : activeTab === 'beats' ? (
                    beats.length === 0 ? (
                        <div className="text-center py-32 border border-dashed border-white/5 rounded-2xl bg-black/10">
                            <Headphones size={48} className="mx-auto text-subtitle/20 mb-4" />
                            <p className="text-[11px] font-black text-subtitle/30 uppercase tracking-widest">
                                No tienes beats en tu biblioteca
                            </p>
                            <p className="text-[9px] text-subtitle/20 mt-2">
                                Explora el catálogo y compra beats para verlos aquí
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                            {beats.map((beat) => (
                                <div
                                    key={beat.id}
                                    className="bg-[#0b0b0d] border border-white/5 rounded-xl overflow-hidden hover:border-artist/30 transition-all group"
                                >
                                    <div className="relative h-36 overflow-hidden bg-gradient-to-br from-artist/10 to-transparent">
                                        {beat.coverUrl ? (
                                            <img
                                                src={beat.coverUrl}
                                                alt={beat.title}
                                                className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Disc size={40} className="text-subtitle/20" />
                                            </div>
                                        )}
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
                                        <div className="absolute bottom-3 left-3 right-3">
                                            <h3 className="text-sm font-black uppercase text-white truncate">
                                                {beat.title}
                                            </h3>
                                            <p className="text-[7px] text-subtitle/30 uppercase">
                                                {beat.genre || 'Sin género'} • {beat.bpm || '?'} BPM • {beat.keySignature || '?'}
                                            </p>
                                        </div>
                                        <div className="absolute top-3 right-3">
                                            <span className="text-[7px] bg-success/20 text-success px-2 py-0.5 rounded-full">
                                                {beat.licenseType}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="p-4 space-y-3">
                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <User size={12} className="text-subtitle/40" />
                                                <span className="text-[8px] text-subtitle/60">{beat.producer.name}</span>
                                            </div>
                                            <div className="flex items-center gap-1">
                                                <Star size={10} className="fill-artist/40 text-artist/40" />
                                                <span className="text-[8px] text-subtitle/50">Comprado</span>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex items-center gap-2">
                                                <Calendar size={12} className="text-subtitle/40" />
                                                <span className="text-[7px] text-subtitle/50">{formatDate(beat.purchaseDate)}</span>
                                            </div>
                                            <span className="text-xs font-black text-artist">{beat.pricePaid}€</span>
                                        </div>

                                        {beat.taggedAudioUrl && (
                                            <div className="pt-2">
                                                <audio controls className="w-full h-8">
                                                    <source src={beat.taggedAudioUrl} type="audio/mpeg" />
                                                </audio>
                                            </div>
                                        )}

                                        <button
                                            onClick={() => handleDownload(beat)}
                                            disabled={downloadingId === beat.id}
                                            className="w-full mt-2 py-2 bg-artist/10 border border-artist/20 rounded-lg text-[8px] font-black uppercase tracking-widest text-artist hover:bg-artist/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50"
                                        >
                                            {downloadingId === beat.id ? (
                                                <Loader2 size={12} className="animate-spin" />
                                            ) : (
                                                <Download size={12} />
                                            )}
                                            Descargar Máster
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                ) : (
                    finishedProjects.length === 0 ? (
                        <div className="text-center py-32 border border-dashed border-white/5 rounded-2xl bg-black/10">
                            <CheckCircle size={48} className="mx-auto text-subtitle/20 mb-4" />
                            <p className="text-[11px] font-black text-subtitle/30 uppercase tracking-widest">
                                No hay proyectos terminados
                            </p>
                            <p className="text-[9px] text-subtitle/20 mt-2">
                                Tus proyectos finalizados aparecerán aquí
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-3">
                            {finishedProjects.map((project) => (
                                <div
                                    key={project.id}
                                    className="bg-[#0b0b0d] border border-white/5 rounded-xl p-5 hover:border-artist/30 transition-all group"
                                >
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 flex-wrap mb-2">
                                                <h3 className="text-base font-black uppercase tracking-tighter text-light group-hover:text-artist transition-colors">
                                                    {project.title}
                                                </h3>
                                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-wider border bg-success/10 border-success/20 text-success">
                                                    <CheckCircle size={10} /> COMPLETADO
                                                </span>
                                            </div>

                                            <div className="flex flex-wrap gap-x-6 gap-y-2 text-[9px] font-bold text-subtitle/60 uppercase tracking-widest">
                                                <div className="flex items-center gap-2">
                                                    <span className="text-subtitle/20">PRODUCTOR:</span>
                                                    <div className="flex items-center gap-2">
                                                        <div className="w-4 h-4 rounded-full bg-producer/20 text-producer text-[8px] font-black flex items-center justify-center">
                                                            {project.producer?.fullName?.[0]?.toUpperCase() || 'P'}
                                                        </div>
                                                        <span className="text-light/80 font-black">{project.producer?.fullName || 'Productor'}</span>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-subtitle/20">FECHA:</span>
                                                    <span className="text-light/40 font-mono">
                                                        {formatDate(project.createdAt || new Date().toISOString())}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-subtitle/20">ETAPA FINAL:</span>
                                                    <span className="text-light/60">{project.currentStageName || 'Completado'}</span>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => window.open(`/projects/${project.id}`, '_blank')}
                                                className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[8px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-2"
                                            >
                                                <FileAudio size={12} />
                                                Ver Detalles
                                            </button>
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <div className="flex justify-between text-[7px] font-black mb-1">
                                            <span className="text-subtitle/40">Progreso</span>
                                            <span className="text-success">100%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-artist to-artist/60 rounded-full w-full" />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )
                )}
            </main>
        </div>
    );
};

export default FinishedProjectsPage;