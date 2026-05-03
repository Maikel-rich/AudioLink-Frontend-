import React from 'react';
import {
    Play, SkipBack, SkipForward, Repeat, Shuffle,
    Volume2, ListMusic, Maximize2
} from 'lucide-react';

const AudioPlayer = () => {
    return (
        <div className="fixed bottom-0 left-0 right-0 lg:left-72 bg-dark/80 backdrop-blur-lg border-t border-gray-light/20 p-4 z-50">
            <div className="max-w-screen-2xl mx-auto flex items-center justify-between gap-8">

                {/* Info del Track */}
                <div className="flex items-center gap-4 min-w-60">
                    <div className="w-14 h-14 bg-gray-light/20 rounded-lg overflow-hidden shrink-0">
                        <img
                            src="/api/placeholder/56/56"
                            alt="Cover"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-col">
                        <h4 className="text-light font-bold text-sm truncate">Midnight Session_Mix_...</h4>
                        <p className="text-subtitle text-[10px] uppercase font-bold tracking-wider">
                            PRODBYDEX • WAV DE 24 BI...
                        </p>
                    </div>
                </div>

                {/* Controles Centrales */}
                <div className="flex-1 flex flex-col items-center max-w-2xl gap-2">
                    <div className="flex items-center gap-6">
                        <button className="text-subtitle hover:text-artist transition-colors">
                            <Shuffle size={18} />
                        </button>
                        <button className="text-light hover:scale-110 transition-transform">
                            <SkipBack size={20} fill="currentColor" />
                        </button>
                        <button className="w-10 h-10 bg-artist rounded-full flex items-center justify-center text-white hover:scale-105 transition-transform shadow-lg shadow-artist/20">
                            <Play size={20} fill="currentColor" className="ml-1" />
                        </button>
                        <button className="text-light hover:scale-110 transition-transform">
                            <SkipForward size={20} fill="currentColor" />
                        </button>
                        <button className="text-subtitle hover:text-artist transition-colors">
                            <Repeat size={18} />
                        </button>
                    </div>

                    {/* Barra de Progreso */}
                    <div className="w-full flex items-center gap-3">
                        <span className="text-[10px] text-subtitle font-bold tabular-nums">1:45</span>
                        <div className="relative flex-1 h-1 bg-gray-light/20 rounded-full group cursor-pointer">
                            <div className="absolute h-full bg-artist rounded-full w-[40%] group-hover:bg-artist/80" />
                            <div className="absolute top-1/2 -translate-y-1/2 left-[40%] w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                        <span className="text-[10px] text-subtitle font-bold tabular-nums">4:12</span>
                    </div>
                </div>

                {/* Controles Volumen/Lista */}
                <div className="flex items-center gap-4 min-w-50 justify-end">
                    <button className="text-subtitle hover:text-light transition-colors">
                        <ListMusic size={20} />
                    </button>
                    <div className="flex items-center gap-2 group">
                        <Volume2 size={20} className="text-subtitle group-hover:text-light" />
                        <div className="w-24 h-1 bg-gray-light/20 rounded-full">
                            <div className="h-full bg-artist rounded-full w-2/3" />
                        </div>
                    </div>
                    <button className="text-subtitle hover:text-light transition-colors">
                        <Maximize2 size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AudioPlayer;