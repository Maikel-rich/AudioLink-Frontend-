import React from 'react';
import { X, FileAudio, Clock, Share2, Download, ExternalLink } from 'lucide-react';

const ProjectInspector = ({ project, onClose }: { project: any, onClose: () => void }) => {
    if (!project) return null;

    return (
        <div className="fixed top-0 right-0 h-screen w-100 bg-[#0b0b0d]/90 backdrop-blur-2xl border-l border-white/5 z-50 shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/5 flex justify-between items-center bg-white/2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-subtitle/40">Inspector de Sesión</span>
                <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-subtitle/60 hover:text-light transition-colors">
                    <X size={20} />
                </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 custom-scrollbar space-y-10">
                <section>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">{project.title}</h2>
                    <p className="text-artist font-bold text-xs uppercase tracking-[0.2em]">{project.artist}</p>
                </section>

                <div className="grid grid-cols-2 gap-3">
                    <button className="flex items-center justify-center gap-2 bg-artist p-3 rounded-xl text-[10px] font-black uppercase tracking-widest text-white shadow-lg shadow-artist/20">
                        <Download size={14} /> Descargar
                    </button>
                    <button className="flex items-center justify-center gap-2 bg-white/5 p-3 rounded-xl text-[10px] font-black uppercase tracking-widest border border-white/10">
                        <Share2 size={14} /> Compartir
                    </button>
                </div>

                <section>
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-subtitle/40 mb-4">Archivos Recientes</h4>
                    <div className="space-y-2">
                        {['Master_Final_V2.wav', 'Stems_Drums.zip', 'Rec_Vocals_Session.wav'].map((file, i) => (
                            <div key={i} className="flex items-center justify-between p-3 bg-white/2 border border-white/5 rounded-xl group hover:border-artist/30 transition-colors cursor-pointer">
                                <div className="flex items-center gap-3">
                                    <FileAudio size={16} className="text-subtitle/30 group-hover:text-artist" />
                                    <span className="text-[11px] font-bold text-subtitle/80 group-hover:text-light truncate w-40">{file}</span>
                                </div>
                                <ExternalLink size={12} className="text-subtitle/20" />
                            </div>
                        ))}
                    </div>
                </section>

                <section className="bg-artist/5 border border-artist/10 p-5 rounded-2xl">
                    <div className="flex items-center gap-2 mb-3 text-artist">
                        <Clock size={14} />
                        <span className="text-[9px] font-black uppercase tracking-[0.2em]">Próxima Entrega</span>
                    </div>
                    <p className="text-xs text-subtitle/80 leading-relaxed font-medium">
                        Finalizar la mezcla de los bajos y ajustar la compresión de la voz líder para la revisión del viernes.
                    </p>
                </section>
            </div>
        </div>
    );
};

export default ProjectInspector;