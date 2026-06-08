import React from 'react';

interface ProgressProps {
    percentage: number;
    stageName: string | null;
}

export const ProposalProgressBar = ({ percentage, stageName }: ProgressProps) => {
    return (
        <div className="w-full md:w-48 space-y-1.5">
            <div className="flex justify-between text-[8px] font-black uppercase tracking-widest">
                <span className="text-subtitle/40">PROGRESO</span>
                <span className="text-artist tabular-nums">{percentage}%</span>
            </div>
            <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                <div
                    className="h-full bg-gradient-to-r from-artist to-artist/60 rounded-full transition-all duration-500"
                    style={{ width: `${percentage}%` }}
                />
            </div>
            {stageName && (
                <p className="text-[7px] font-mono text-subtitle/40 uppercase tracking-wider truncate">
                    {stageName}
                </p>
            )}
        </div>
    );
};