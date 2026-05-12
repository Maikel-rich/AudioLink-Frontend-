import React from 'react';
import Sidebar from "@/components/SideBar";
import ProfileHero from "@/components/ProfileHero";
import AudioPlayer from "@/components/AudioPlayer";
import RecentProductions from "@/components/RecentProductions";
import ServicesSidebar from '@/components/ServicesSidebar';
import { Activity, ShieldCheck } from 'lucide-react';

function ProducerProfilePage() {
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

                <div className="flex-1 overflow-y-auto custom-scrollbar">
                    <div className="p-10 w-full max-w-7xl mx-auto space-y-16">
                        <ProfileHero />

                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                            <div className="lg:col-span-8 space-y-12">
                                <header className="flex items-center gap-4 mb-8">
                                    <Activity size={20} className="text-artist" />
                                    <h2 className="text-xl font-black uppercase tracking-tighter">Producciones <span className="text-subtitle/20">Recientes</span></h2>
                                    <div className="h-px flex-1 bg-white/5 ml-4" />
                                </header>
                                <RecentProductions />
                            </div>

                            <div className="lg:col-span-4 space-y-8">
                                <header className="flex items-center gap-4 mb-8">
                                    <h2 className="text-xl font-black uppercase tracking-tighter text-right w-full">Especificaciones <span className="text-subtitle/20">& Costes</span></h2>
                                </header>
                                <ServicesSidebar />
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