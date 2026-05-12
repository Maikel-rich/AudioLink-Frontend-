import React from 'react';
import { MoreVertical, Layers, CalendarDays, ChevronRight } from 'lucide-react';

interface ProjectRowProps {
    title: string;
    artist: string;
    status: 'In Progress' | 'Mixing' | 'Mastering' | 'Review';
    progress: number;
    lastUpdate: string;
    category: string;
    participants: string[];
    isSelected?: boolean;
}

const ProjectRow = ({ title, artist, status, progress, lastUpdate, category, isSelected }: ProjectRowProps) => {
    const theme = {
        'In Progress': { label: 'En Progreso', color: 'text-artist', bg: 'bg-artist/10', border: 'border-artist/20' },
        'Mixing': { label: 'Mezcla', color: 'text-producer', bg: 'bg-producer/10', border: 'border-producer/20' },
        'Mastering': { label: 'Masterización', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
        'Review': { label: 'Revisión', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
    };

    const currentTheme = theme[status];

    return (
        <div className={`group relative flex items-center gap-6 p-4 border transition-all duration-300 rounded-xl mb-3 backdrop-blur-sm overflow-hidden
            ${isSelected
                ? 'bg-light/5 border-light/20 shadow-[0_0_20px_rgba(0,0,0,0.3)]'
                : 'bg-gray-dark/10 border-light/3 hover:border-light/10 hover:bg-light/3'
            }`}>

            {isSelected && <div className="absolute left-0 top-0 bottom-0 w-1 bg-artist shadow-[4px_0_15px_rgba(60,131,246,0.5)]" />}

            <div className="flex items-center gap-5 w-1/3 min-w-75 z-10">
                <div className={`w-1 h-10 rounded-full ${currentTheme.color} bg-current`} />
                <div className="flex flex-col min-w-0">
                    <h3 className="text-[13px] font-black text-light tracking-wider uppercase truncate group-hover:text-artist transition-colors">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] font-bold text-subtitle/40 uppercase tracking-tight">{artist}</p>
                        <span className="text-[8px] text-subtitle/20">•</span>
                        <div className="flex items-center gap-1 text-[9px] font-bold text-subtitle/30 uppercase">
                            <Layers size={10} />
                            {category}
                        </div>
                    </div>
                </div>
            </div>

            <div className="w-40 shrink-0 z-10">
                <div className={`inline-flex items-center justify-center px-3 py-1 rounded-full border ${currentTheme.bg} ${currentTheme.border} ${currentTheme.color} text-[8px] font-black uppercase tracking-[0.15em]`}>
                    {currentTheme.label}
                </div>
            </div>

            <div className="flex-1 flex flex-col gap-2 min-w-37.5 z-10 px-4">
                <div className="flex justify-between items-end">
                    <span className="text-[8px] font-black text-subtitle/20 uppercase tracking-widest">Nivel de Señal</span>
                    <span className={`text-[10px] font-black ${currentTheme.color}`}>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-black/40 rounded-full border border-light/5 overflow-hidden">
                    <div className={`h-full ${currentTheme.color} bg-current transition-all duration-1000 ease-out`} style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="flex items-center gap-8 w-64 shrink-0 justify-end z-10">
                <div className="flex items-center gap-2 text-subtitle/40">
                    <CalendarDays size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{lastUpdate}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-subtitle/20 hover:text-light transition-colors"><MoreVertical size={18} /></button>
                    <ChevronRight size={16} className={`transition-all ${isSelected ? 'text-artist translate-x-1' : 'text-subtitle/10 group-hover:text-artist group-hover:translate-x-1'}`} />
                </div>
            </div>
        </div>
    );
};

export default ProjectRow;