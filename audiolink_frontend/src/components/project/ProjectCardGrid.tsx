import React from 'react';
import { CalendarDays, ExternalLink } from 'lucide-react';

interface UserParticipant {
    id: number;
    fullName: string | null;
    profilePicture?: string | null;
}

interface ProjectCardProps {
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

const ProjectCardGrid = ({
    title,
    artist,
    producer,
    status,
    progress,
    lastUpdate,
    category,
    isSelected,
    userRole = 'producer'
}: ProjectCardProps) => {

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
    const progressColor = getProgressColor(progress);
    const progressTextColor = getProgressTextColor(progress);

    const displayName = userRole === 'producer'
        ? (artist?.fullName || 'Artista Desconocido')
        : (producer?.fullName || 'Productor Desconocido');

    return (
        <div className={`group relative bg-gray-dark/20 border rounded-2xl p-6 transition-all duration-300 overflow-hidden
            ${isSelected
                ? (userRole === 'artist' ? 'border-artist/50 bg-white/5 shadow-[0_0_30px_rgba(59,130,246,0.15)]' : 'border-producer/50 bg-white/5 shadow-[0_0_30px_rgba(234,179,8,0.15)]')
                : 'border-white/5 hover:border-white/15'}`}>

            <div className="flex justify-between items-start mb-6">
                <div className={`px-2.5 py-1 rounded-lg border text-[8px] font-black uppercase tracking-widest ${currentTheme.bg} ${currentTheme.border} ${currentTheme.color}`}>
                    {currentTheme.label}
                </div>
                <div className="text-[9px] font-bold text-subtitle/20 uppercase tracking-widest">{category}</div>
            </div>

            <div className="mb-8">
                <h3 className={`text-sm font-black uppercase tracking-wider text-light mb-1 truncate transition-colors ${textAccentHover}`}>{title}</h3>
                <p className="text-[10px] font-bold text-subtitle/40 uppercase tracking-tight">
                    {userRole === 'producer' ? `Artista: ${displayName}` : `Productor: ${displayName}`}
                </p>
            </div>

            <div className="space-y-3 mb-6">
                <div className="flex justify-between items-end">
                    <span className="text-[9px] font-black uppercase text-subtitle/20 tracking-tighter">Progreso</span>
                    <span className={`text-[11px] font-black ${progressTextColor}`}>{progress}%</span>
                </div>
                <div className="h-1.5 bg-gray-800/50 rounded-full overflow-hidden">
                    <div
                        className={`h-full ${progressColor} rounded-full transition-all duration-1000`}
                        style={{ width: `${progress}%` }}
                    />
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