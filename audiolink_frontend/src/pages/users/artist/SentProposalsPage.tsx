import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";
import AudioPlayer from "@/components/AudioPlayer";
import FilterDropdown from "@/components/FilterDropdown";
import { MonitorX, RefreshCw, Loader2, Send, CheckCircle, Clock, XCircle, MessageCircle, CreditCard } from 'lucide-react';
import { serviceRequestService, ProposalData, getPaymentStatusLabel, getPaymentStatusColor, getPaymentStatusIcon } from '@/services/serviceRequestService';
import { PaymentModal } from '@/components/PaymentModal';

export const SentProposalsPage = () => {
    const navigate = useNavigate();
    const [proposals, setProposals] = useState<ProposalData[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todas");
    const [selectedProposal, setSelectedProposal] = useState<ProposalData | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [paymentType, setPaymentType] = useState<'deposit' | 'remaining'>('deposit');

    const loadProposals = async () => {
        try {
            setIsLoading(true);
            const data = await serviceRequestService.getMyProposals();
            setProposals(data);
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadProposals();
    }, []);

    const statusOptions = ["Todas", "Pendientes", "Activas", "Rechazadas", "Completadas"];

    const getStatusFilterValue = (filter: string): string | null => {
        if (filter === "Pendientes") return "pending";
        if (filter === "Activas") return "active";
        if (filter === "Rechazadas") return "rejected";
        if (filter === "Completadas") return "completed";
        return null;
    };

    const filteredProposals = React.useMemo(() => {
        return proposals.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(search.toLowerCase()) ||
                p.producer.full_name.toLowerCase().includes(search.toLowerCase());

            const filterValue = getStatusFilterValue(statusFilter);
            const matchesStatus = filterValue === null || p.status === filterValue;

            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter, proposals]);

    const handleOpenChat = (producerId: number) => {
        navigate(`/messages?chat=${producerId}`);
    };

    const handleMakeDepositPayment = (proposal: ProposalData) => {
        setSelectedProposal(proposal);
        setPaymentType('deposit');
        setShowPaymentModal(true);
    };

    const handleMakeRemainingPayment = (proposal: ProposalData) => {
        setSelectedProposal(proposal);
        setPaymentType('remaining');
        setShowPaymentModal(true);
    };

    const handlePaymentSuccess = async (proposalId: number) => {
        await loadProposals();
        setShowPaymentModal(false);
        setSelectedProposal(null);
    };

    const counts = {
        total: proposals.length,
        pending: proposals.filter(p => p.status === 'pending').length,
        active: proposals.filter(p => p.status === 'active').length,
        rejected: proposals.filter(p => p.status === 'rejected').length,
        completed: proposals.filter(p => p.status === 'completed').length,
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'pending': return <Clock size={12} className="text-yellow-400" />;
            case 'active': return <CheckCircle size={12} className="text-artist" />;
            case 'rejected': return <XCircle size={12} className="text-error" />;
            case 'completed': return <CheckCircle size={12} className="text-success" />;
            default: return <Clock size={12} className="text-subtitle/40" />;
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'active': return 'En Proceso';
            case 'rejected': return 'Rechazada';
            case 'completed': return 'Completada';
            default: return status;
        }
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
            case 'active': return 'text-artist bg-artist/10 border-artist/20';
            case 'rejected': return 'text-error bg-error/10 border-error/20';
            case 'completed': return 'text-success bg-success/10 border-success/20';
            default: return 'text-subtitle/40 bg-white/5 border-white/10';
        }
    };

    return (
        <div className="flex bg-[#070708] min-h-screen text-light">
            <Sidebar userType="artist" isCollapsed={false} />

            <main className="flex-1 min-w-0 overflow-y-auto px-4 md:px-12 pt-8 pb-32">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-artist font-black text-[10px] tracking-[0.3em] uppercase mb-1">
                            <Send size={12} /> Propuestas Enviadas
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
                            Mis <span className="text-subtitle/30">Propuestas</span>
                        </h1>
                        <p className="text-[11px] text-subtitle/40 mt-2">
                            {counts.total} propuesta{counts.total !== 1 ? 's' : ''} enviada{counts.total !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="w-80">
                            <SearchBar
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="BUSCAR PROPUESTA O PRODUCTOR..."
                            />
                        </div>
                        <FilterDropdown
                            label="Estado"
                            value={statusFilter}
                            options={statusOptions}
                            onChange={(val) => setStatusFilter(val)}
                        />
                        <button
                            onClick={loadProposals}
                            disabled={isLoading}
                            className="px-4 py-2 bg-white/2 border border-white/5 rounded-xl text-[10px] font-black uppercase tracking-widest text-subtitle/60 hover:text-light hover:border-white/20 transition-all flex items-center gap-2 disabled:opacity-40"
                        >
                            <RefreshCw size={12} className={isLoading ? "animate-spin" : ""} />
                            Actualizar
                        </button>
                    </div>
                </header>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="flex justify-center py-32">
                            <Loader2 size={32} className="animate-spin text-artist" />
                        </div>
                    ) : filteredProposals.length > 0 ? (
                        filteredProposals.map((proposal) => (
                            <div
                                key={proposal.id}
                                className="group bg-[#0b0b0d] border border-white/5 rounded-2xl p-6 hover:border-artist/30 transition-all hover:bg-white/[0.02]"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1 cursor-pointer" onClick={() => handleOpenChat(proposal.id)}>
                                        <div className="flex items-center gap-3 flex-wrap mb-2">
                                            <h3 className="text-base font-black uppercase tracking-tighter text-light group-hover:text-artist transition-colors">
                                                {proposal.title}
                                            </h3>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${getStatusColor(proposal.status)}`}>
                                                {getStatusIcon(proposal.status)}
                                                {getStatusText(proposal.status)}
                                            </span>
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${getPaymentStatusColor(proposal.is_paid)}`}>
                                                <span>{getPaymentStatusIcon(proposal.is_paid)}</span>
                                                {getPaymentStatusLabel(proposal.is_paid)}
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

                                    <div className="flex items-center gap-2">
                                        {proposal.status === 'active' && proposal.is_paid === 0 && (
                                            <button
                                                onClick={() => handleMakeDepositPayment(proposal)}
                                                className="flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-success hover:bg-success/20 transition-all"
                                            >
                                                <CreditCard size={14} />
                                                Pagar 50%
                                            </button>
                                        )}
                                        {proposal.status === 'active' && proposal.is_paid === 1 && (
                                            <button
                                                onClick={() => handleMakeRemainingPayment(proposal)}
                                                className="flex items-center gap-2 px-4 py-2 bg-artist/10 border border-artist/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-artist hover:bg-artist/20 transition-all"
                                            >
                                                <CreditCard size={14} />
                                                Pagar Restante (50%)
                                            </button>
                                        )}
                                        <button
                                            onClick={() => handleOpenChat(proposal.id)}
                                            className="flex items-center gap-2 text-[9px] font-black uppercase tracking-widest text-subtitle/40 hover:text-artist transition-all"
                                        >
                                            <MessageCircle size={16} />
                                            Chat
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/5 rounded-2xl bg-black/10">
                            <MonitorX size={48} className="text-subtitle/20 mb-4" />
                            <p className="text-[10px] font-black text-subtitle/30 uppercase tracking-[0.3em]">
                                {search || statusFilter !== "Todas" ? "NO SE ENCONTRARON PROPUESTAS" : "NO HAY PROPUESTAS ENVIADAS"}
                            </p>
                            <p className="text-[9px] text-subtitle/20 mt-2">
                                {search || statusFilter !== "Todas"
                                    ? "Ajusta los filtros de búsqueda"
                                    : "Solicita servicios desde el perfil de un productor"}
                            </p>
                        </div>
                    )}
                </div>

                <AudioPlayer />
            </main>

            {selectedProposal && (
                <PaymentModal
                    isOpen={showPaymentModal}
                    onClose={() => setShowPaymentModal(false)}
                    proposal={selectedProposal}
                    paymentType={paymentType}
                    onSuccess={handlePaymentSuccess}
                />
            )}
        </div>
    );
};

export default SentProposalsPage;