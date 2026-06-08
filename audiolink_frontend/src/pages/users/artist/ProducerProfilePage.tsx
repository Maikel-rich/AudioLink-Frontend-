import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Sidebar from "@/components/SideBar";
import ProfileHero from "@/components/producer profile/ProfileHero";
import AudioPlayer from "@/components/AudioPlayer";
import ServicesSidebar from '@/components/producer profile/ServicesSidebar';
import { BeatsCatalog } from '@/components/producer profile/BeatCatalog';
import { ShieldCheck, RefreshCw, Music } from 'lucide-react';
import { producerService, ProducerData } from '@/services/producerService';
import { studioService } from '@/services/studioService';

function ProducerProfilePage() {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [producer, setProducer] = useState<ProducerData | null>(null);
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchProducerProfile = async () => {
            if (!id) return;

            try {
                setIsLoading(true);
                setError(null);

                const [producerData, officialServices] = await Promise.all([
                    producerService.getProducerById(id),
                    studioService.getServicesByProducer(id)
                ]);

                setProducer({
                    ...producerData,
                    services: officialServices
                });

            } catch (err) {
                setError("No se pudo inicializar el perfil de este productor.");
            } finally {
                setIsLoading(false);
            }
        };

        fetchProducerProfile();
    }, [id]);

    if (isLoading) {
        return (
            <div className="flex h-screen bg-[#08080a] items-center justify-center text-light">
                <div className="flex flex-col items-center gap-3">
                    <RefreshCw className="animate-spin text-artist" size={32} />
                    <p className="text-[10px] font-black uppercase tracking-widest text-subtitle/60">Cargando consola de perfil...</p>
                </div>
            </div>
        );
    }

    if (error || !producer) {
        return (
            <div className="flex h-screen bg-[#08080a] items-center justify-center text-light p-6">
                <div className="text-center space-y-4">
                    <p className="text-sm font-bold text-error uppercase tracking-wider">{error || "Perfil vacío"}</p>
                    <button
                        onClick={() => navigate(-1)}
                        className="text-[10px] font-black uppercase tracking-wider px-4 py-2 bg-white/5 border border-white/10 rounded-xl hover:bg-white/10 transition-colors"
                    >
                        Volver Atrás
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex h-screen bg-[#08080a] text-light overflow-hidden">
            <Sidebar userType="artist" isCollapsed={false} />

            <main className="flex-1 flex flex-col relative overflow-hidden">
                <div className="absolute top-8 right-10 z-20 flex items-center gap-4">
                    <div className="flex items-center gap-2 px-3 py-1 bg-success/10 border border-success/20 rounded-full">
                        <div className="w-1.5 h-1.5 bg-success rounded-full animate-pulse" />
                        <span className="text-[9px] font-black text-success uppercase tracking-widest">Disponibilidad Inmediata</span>
                    </div>
                    <div className="flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-full">
                        <ShieldCheck size={12} className="text-subtitle/40" />
                        <span className="text-[9px] font-black text-subtitle/40 uppercase tracking-widest">Verificado</span>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto pt-24 px-10">
                    <div className="max-w-7xl mx-auto space-y-16">

                        <ProfileHero
                            producer={producer}
                            isOwnProfile={false}
                        />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8 space-y-12">
                                <div>
                                    <header className="flex items-center gap-4 mb-8">
                                        <Music size={20} className="text-artist" />
                                        <h2 className="text-xl font-black uppercase tracking-tighter">Catálogo <span className="text-subtitle/20">de Beats</span></h2>
                                        <div className="h-px flex-1 bg-white/5 ml-4" />
                                    </header>
                                    <BeatsCatalog producerId={producer.id} isOwnProfile={false} />
                                </div>
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <header className="flex items-center gap-4 mb-8">
                                    <h2 className="text-xl font-black uppercase tracking-tighter text-right w-full">Especificaciones <span className="text-subtitle/20">& Costes</span></h2>
                                </header>
                                <ServicesSidebar
                                    services={producer.services || []}
                                    isOwnProfile={false}
                                    producerId={producer.id}
                                    producerName={producer.fullName || producer.email}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="h-32" />
                </div>

                <AudioPlayer />
            </main>
        </div>
    );
}

export default ProducerProfilePage;