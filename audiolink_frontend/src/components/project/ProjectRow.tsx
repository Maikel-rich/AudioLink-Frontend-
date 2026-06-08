import React from 'react';
import { MoreVertical, Layers, CalendarDays, ChevronRight } from 'lucide-react';

interface UserParticipant {
    id: number;
    fullName: string | null;
    profilePicture?: string | null;
}

interface ProjectRowProps {
    title: string;
    artist: UserParticipant | null;
    producer: UserParticipant | null;
    status: 'active' | 'in_progress' | 'mixing' | 'mastering' | 'review';
    progress: number;
    lastUpdate: string;
    category: string;
    isSelected?: boolean;
    userRole?: 'producer' | 'artist';
}

const ProjectRow = ({
    title,
    artist,
    producer,
    status,
    progress,
    lastUpdate,
    category,
    isSelected,
    userRole = 'producer'
}: ProjectRowProps) => {

    const getProgressColor = (progressValue: number) => {
        if (progressValue === 0) return 'bg-gray-500';
        if (progressValue === 100) {
            return userRole === 'artist' ? 'bg-artist' : 'bg-producer';
        }
        return userRole === 'artist' ? 'bg-artist/60' : 'bg-producer/60';
    };

    const getProgressTextColor = (progressValue: number) => {
        if (progressValue === 0) return 'text-gray-400';
        if (progressValue === 100) {
            return userRole === 'artist' ? 'text-artist' : 'text-producer';
        }
        return userRole === 'artist' ? 'text-artist' : 'text-producer';
    };

    const theme: Record<string, { label: string, color: string, bg: string, border: string }> = {
        'active': { label: 'Activo', color: 'text-success', bg: 'bg-success/10', border: 'border-success/20' },
        'in_progress': { label: 'En Progreso', color: 'text-artist', bg: 'bg-artist/10', border: 'border-artist/20' },
        'mixing': { label: 'Mezcla', color: 'text-producer', bg: 'bg-producer/10', border: 'border-producer/20' },
        'mastering': { label: 'Masterización', color: 'text-purple-400', bg: 'bg-purple-400/10', border: 'border-purple-400/20' },
        'review': { label: 'Revisión', color: 'text-warning', bg: 'bg-warning/10', border: 'border-warning/20' },
    };

    const currentTheme = theme[status] || theme['in_progress'];
    const textAccentHover = userRole === 'artist' ? 'group-hover:text-artist' : 'group-hover:text-producer';
    const indicatorColor = userRole === 'artist' ? 'bg-artist' : 'bg-producer';
    const chevronColor = userRole === 'artist' ? 'text-artist' : 'text-producer';
    const progressColor = getProgressColor(progress);
    const progressTextColor = getProgressTextColor(progress);

    const displayName = userRole === 'producer'
        ? (artist?.fullName || 'Artista Desconocido')
        : (producer?.fullName || 'Productor Desconocido');

    return (
        <div className={`group relative flex items-center gap-6 p-4 border transition-all duration-300 rounded-xl mb-3 backdrop-blur-sm overflow-hidden
            ${isSelected
                ? 'bg-light/5 border-light/20 shadow-[0_0_20px_rgba(0,0,0,0.3)]'
                : 'bg-gray-dark/10 border-light/3 hover:border-light/10 hover:bg-light/3'
            }`}>

            {isSelected && <div className={`absolute left-0 top-0 bottom-0 w-1 ${indicatorColor} shadow-[4px_0_15px_rgba(0,0,0,0.5)]`} />}

            <div className="flex items-center gap-5 w-1/3 min-w-75 z-10">
                <div className={`w-1 h-10 rounded-full ${currentTheme.color} bg-current`} />
                <div className="flex flex-col min-w-0">
                    <h3 className={`text-[13px] font-black text-light tracking-wider uppercase truncate transition-colors ${textAccentHover}`}>
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                        <p className="text-[10px] font-bold text-subtitle/40 uppercase tracking-tight">
                            {userRole === 'producer' ? `Artista: ${displayName}` : `Productor: ${displayName}`}
                        </p>
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
                    <span className="text-[8px] font-black text-subtitle/20 uppercase tracking-widest">Progreso</span>
                    <span className={`text-[10px] font-black ${progressTextColor}`}>{progress}%</span>
                </div>
                <div className="h-1.5 w-full bg-gray-800/50 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${progressColor} rounded-full transition-all duration-1000 ease-out`}
                        style={{ width: `${progress}%` }}
                    />
                </div>
            </div>

            <div className="flex items-center gap-8 w-64 shrink-0 justify-end z-10">
                <div className="flex items-center gap-2 text-subtitle/40">
                    <CalendarDays size={12} />
                    <span className="text-[9px] font-black uppercase tracking-widest">{lastUpdate}</span>
                </div>
                <div className="flex items-center gap-2">
                    <button className="p-2 text-subtitle/20 hover:text-light transition-colors"><MoreVertical size={18} /></button>
                    <ChevronRight size={16} className={`transition-all ${isSelected ? `${chevronColor} translate-x-1` : `text-subtitle/10 ${textAccentHover} group-hover:translate-x-1`}`} />
                </div>
            </div>
        </div>
    );
};

export default ProjectRow;