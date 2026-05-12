import React from 'react';
import { Play, SkipBack, SkipForward, Volume2, ListMusic, Maximize2, Activity } from 'lucide-react';

const AudioPlayer = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-dark/95 backdrop-blur-2xl border-t border-light/10 p-5 z-50 shadow-[0_-20px_50px_rgba(0,0,0,0.5)]">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-12">

                {/* Track Info */}
                <div className="flex items-center gap-5 min-w-75">
                    <div className="w-14 h-14 bg-artist/20 rounded-lg border border-artist/30 overflow-hidden shrink-0 group relative">
                        <img src="https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=100" alt="Cover" className="w-full h-full object-cover opacity-60 group-hover:opacity-100 transition-opacity" />
                        <div className="absolute inset-0 flex items-center justify-center">
                            <Activity size={16} className="text-artist animate-pulse" />
                        </div>
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-light font-black text-xs uppercase tracking-widest truncate">preview_mix_master_v2.wav</h4>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[8px] font-black bg-artist/10 text-artist px-1.5 py-0.5 rounded border border-artist/20">48kHz / 24bit</span>
                            <span className="text-[9px] font-bold text-subtitle/40 uppercase">Kael Beats</span>
                        </div>
                    </div>
                </div>

                {/* Controles */}
                <div className="flex-1 flex flex-col items-center gap-3">
                    <div className="flex items-center gap-8">
                        <button className="text-subtitle/30 hover:text-light transition-colors"><SkipBack size={20} /></button>
                        <button className="w-12 h-12 bg-artist rounded-full flex items-center justify-center text-white shadow-lg shadow-artist/20 hover:scale-105 active:scale-95 transition-all">
                            <Play size={24} fill="white" />
                        </button>
                        <button className="text-subtitle/30 hover:text-light transition-colors"><SkipForward size={20} /></button>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="w-full flex items-center gap-4 px-10">
                        <span className="text-[9px] font-black text-subtitle/40 tabular-nums">01:24</span>
                        <div className="flex-1 h-1 bg-white/5 rounded-full relative group cursor-pointer">
                            <div className="absolute h-full bg-linear-to-r from-artist to-blue-400 rounded-full w-[45%]" />
                            <div className="absolute top-1/2 -translate-y-1/2 left-[45%] w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-all shadow-[0_0_10px_white]" />
                        </div>
                        <span className="text-[9px] font-black text-subtitle/40 tabular-nums">03:45</span>
                    </div>
                </div>

                {/* Mixer Tools */}
                <div className="flex items-center gap-6 min-w-75 justify-end">
                    <div className="flex items-center gap-3 group">
                        <Volume2 size={16} className="text-subtitle/40 group-hover:text-artist transition-colors" />
                        <div className="w-20 h-1 bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full bg-subtitle/40 w-2/3 group-hover:bg-artist transition-all" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;