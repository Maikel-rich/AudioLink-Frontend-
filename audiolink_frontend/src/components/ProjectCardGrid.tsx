import React from 'react';
import { CalendarDays, ExternalLink } from 'lucide-react';

interface ProjectCardProps {
    title: string;
    artist: string;
    status: 'In Progress' | 'Mixing' | 'Mastering' | 'Review';
    progress: number;
    lastUpdate: string;
    category: string;
    isSelected?: boolean;
}

const ProjectCardGrid = ({ title, artist, status, progress, lastUpdate, category, isSelected }: ProjectCardProps) => {
    const theme = {
        'In Progress': { label: 'En Progreso', color: 'text-artist', bg: 'bg-artist/10', border: 'border-artist/20' },
        'Mixing': { label: 'Mezcla', color: 'text-producer', bg: 'bg-producer/10', border: 'border-producer/20' },
        'Mastering': { label: 'Masterización', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
        'Review': { label: 'Revisión', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
    };

    const currentTheme = theme[status];

    return (
        <div className={`group relative bg-gray-dark/20 border rounded-2xl p-6 transition-all duration-300 overflow-hidden
            ${isSelected ? 'border-artist/50 bg-white/5 shadow-[0_0_30px_rgba(60,131,246,0.15)]' : 'border-white/5 hover:border-white/15'}`}>

            <div className="flex justify-between items-start mb-6">
                <div className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${currentTheme.bg} ${currentTheme.border} ${currentTheme.color}`}>
                    {currentTheme.label}
                </div>
                <div className="text-[9px] font-bold text-subtitle/20 uppercase tracking-widest">{category}</div>
            </div>

            <div className="mb-8">
                <h3 className="text-sm font-black uppercase tracking-wider text-light mb-1 truncate group-hover:text-artist transition-colors">{title}</h3>
                <p className="text-[10px] font-bold text-subtitle/40 uppercase tracking-tight">{artist}</p>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black uppercase text-subtitle/20 tracking-tighter">Progreso</span>
                    <span className={`text-[11px] font-black ${currentTheme.color}`}>{progress}%</span>
                </div>
                <div className="h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/3">
                    <div className={`h-full bg-current ${currentTheme.color} transition-all duration-1000`} style={{ width: `${progress}%` }} />
                </div>
            </div>

            <div className="flex justify-between items-center pt-4 border-t border-white/5">
                <div className="flex items-center gap-2 text-subtitle/30 font-black">
                    <CalendarDays size={12} />
                    <span className="text-[9px] uppercase">{lastUpdate}</span>
                </div>
                <button className={`flex items-center gap-2 text-[9px] font-black uppercase tracking-widest ${currentTheme.color} hover:text-light transition-colors`}>
                    Abrir <ExternalLink size={10} />
                </button>
            </div>
        </div>
    );
};

export default ProjectCardGrid;