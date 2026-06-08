import React from 'react';
import { Clock, Activity, XCircle, CheckCircle2 } from 'lucide-react';

interface BadgeProps {
    status: 'active' | 'pending' | 'rejected' | 'completed' | string;
}

export const ProposalStatusBadge = ({ status }: BadgeProps) => {
    const config = {
        pending: {
            bg: 'bg-yellow-400/10 border-yellow-400/20 text-yellow-400',
            icon: <Clock size={10} />,
            label: 'PENDIENTE'
        },
        active: {
            bg: 'bg-artist/10 border-artist/20 text-artist',
            icon: <Activity size={10} />,
            label: 'EN PROCESO'
        },
        rejected: {
            bg: 'bg-error/10 border-error/20 text-error',
            icon: <XCircle size={10} />,
            label: 'RECHAZADA'
        },
        completed: {
            bg: 'bg-success/10 border-success/20 text-success',
            icon: <CheckCircle2 size={10} />,
            label: 'COMPLETADA'
        },
    }[status] || {
        bg: 'bg-white/5 border-white/10 text-subtitle',
        icon: <Clock size={10} />,
        label: status
    };

    return (
        <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border ${config.bg} text-[8px] font-black uppercase tracking-wider`}>
            {config.icon}
            <span>{config.label}</span>
        </div>
    );
};