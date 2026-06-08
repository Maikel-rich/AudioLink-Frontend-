import React from 'react';
import { ChevronRight, MessageCircle } from 'lucide-react';
import { ProposalStatusBadge } from './ProposalStatusBadge';
import { ProposalProgressBar } from './ProposalProgressBar';
import { ProposalData } from '@/services/serviceRequestService';

interface ProposalCardProps {
    proposal: ProposalData;
    onViewDetails: (id: number) => void;
    onStatusChange?: () => void;
}

export const ProposalCard = ({ proposal, onViewDetails }: ProposalCardProps) => {
    const isActive = proposal.status === 'active';

    return (
        <div className="group bg-[#0b0b0d] border border-white/5 rounded-2xl p-6 hover:border-artist/30 transition-all hover:bg-white/[0.02]">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex items-center gap-3 flex-wrap mb-2">
                        <h3 className="text-base font-black uppercase tracking-tighter text-light group-hover:text-artist transition-colors">
                            {proposal.title}
                        </h3>
                        <ProposalStatusBadge status={proposal.status} />
                        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${proposal.is_paid
                            ? 'text-success bg-success/10 border-success/20'
                            : 'text-error bg-error/10 border-error/20'
                            }`}>
                            {proposal.is_paid ? 'PAGADO' : 'PENDIENTE PAGO'}
                        </span>
                    </div>

                    <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold text-subtitle/60 uppercase tracking-widest">
                        <div className="flex items-center gap-2">
                            <span className="text-subtitle/20">PRODUCTOR:</span>
                            <div className="flex items-center gap-2">
                                {proposal.producer.avatar_url ? (
                                    <img
                                        src={proposal.producer.avatar_url}
                                        alt=""
                                        className="w-4 h-4 rounded-full object-cover"
                                    />
                                ) : (
                                    <div className="w-4 h-4 rounded-full bg-artist/20 text-artist text-[8px] font-black flex items-center justify-center">
                                        {proposal.producer.full_name[0]?.toUpperCase() || 'P'}
                                    </div>
                                )}
                                <span className="text-light/80 font-black">{proposal.producer.full_name}</span>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-subtitle/20">SERVICIO:</span>
                            <span className="text-light/60">{proposal.service_name}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-subtitle/20">MONTO:</span>
                            <span className="text-success font-black">{proposal.amount.toFixed(2)}€</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className="text-subtitle/20">FECHA:</span>
                            <span className="text-light/40 font-mono">{proposal.created_at}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-3">
                    {isActive && proposal.progress_percentage > 0 && (
                        <ProposalProgressBar
                            percentage={proposal.progress_percentage}
                            stageName={proposal.current_stage_name}
                        />
                    )}

                    <button
                        onClick={() => onViewDetails(proposal.id)}
                        className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-subtitle/40 hover:text-artist transition-colors group/btn"
                    >
                        <MessageCircle size={12} />
                        <span>VER DETALLES</span>
                        <ChevronRight size={12} className="group-hover/btn:translate-x-0.5 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    );
};