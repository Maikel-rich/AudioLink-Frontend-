import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Sidebar from "@/components/SideBar";
import SearchBar from "@/components/SearchBar";
import FilterDropdown from "@/components/FilterDropdown";
import AudioPlayer from "@/components/AudioPlayer";
import { FileText, MonitorX, RefreshCw, Loader2, Check, X, MessageCircle, FolderOpen } from 'lucide-react';
import { serviceRequestService, ServiceRequest } from '@/services/serviceRequestService';
import { ProposalStatusBadge } from "@/components/proposals/ProposalStatusBadge";

export const ProducerProposalsPage = () => {
    const navigate = useNavigate();
    const [proposals, setProposals] = useState<ServiceRequest[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("Todas");
    const [acceptingId, setAcceptingId] = useState<number | null>(null);
    const [rejectingId, setRejectingId] = useState<number | null>(null);

    const statusOptions = ["Todas", "Pendientes", "Activas", "Rechazadas", "Completadas"];

    const getStatusFilterValue = (filter: string): string | null => {
        if (filter === "Pendientes") return "pending";
        if (filter === "Activas") return "accepted";
        if (filter === "Rechazadas") return "rejected";
        if (filter === "Completadas") return "completed";
        return null;
    };

    const loadProposals = async () => {
        try {
            setIsLoading(true);
            const data = await serviceRequestService.getMyRequests();
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

    const filteredProposals = React.useMemo(() => {
        return proposals.filter(p => {
            const matchesSearch = p.service.name.toLowerCase().includes(search.toLowerCase()) ||
                p.artist.name.toLowerCase().includes(search.toLowerCase()) ||
                `#${p.id}`.includes(search);

            const filterValue = getStatusFilterValue(statusFilter);
            const matchesStatus = filterValue === null || p.status === filterValue;

            return matchesSearch && matchesStatus;
        });
    }, [search, statusFilter, proposals]);

    const handleOpenChat = (artistId: number) => {
        navigate(`/messages?chat=${artistId}`);
    };

    const handleOpenProjects = () => {
        navigate('/projects');
    };

    const handleAcceptProposal = async (id: number) => {
        if (!confirm('¿Aceptar esta solicitud? Se creará un proyecto automáticamente.')) return;

        setAcceptingId(id);
        try {
            await serviceRequestService.acceptRequest(id);
            await loadProposals();
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setAcceptingId(null);
        }
    };

    const handleRejectProposal = async (id: number) => {
        if (!confirm('¿Rechazar esta solicitud?')) return;

        setRejectingId(id);
        try {
            await serviceRequestService.rejectRequest(id);
            await loadProposals();
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setRejectingId(null);
        }
    };

    const getStatusBadgeVariant = (status: string): 'pending' | 'active' | 'rejected' | 'completed' => {
        switch (status) {
            case 'pending': return 'pending';
            case 'accepted': return 'active';
            case 'rejected': return 'rejected';
            case 'completed': return 'completed';
            default: return 'pending';
        }
    };

    const counts = {
        total: proposals.length,
        pending: proposals.filter(p => p.status === 'pending').length,
        active: proposals.filter(p => p.status === 'accepted').length,
        rejected: proposals.filter(p => p.status === 'rejected').length,
        completed: proposals.filter(p => p.status === 'completed').length,
    };

    return (
        <div className="flex bg-[#070708] min-h-screen text-light">
            <Sidebar userType="producer" isCollapsed={false} />

            <main className="flex-1 min-w-0 overflow-y-auto px-4 md:px-12 pt-8 pb-32">
                <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12 border-b border-white/5 pb-8">
                    <div>
                        <div className="flex items-center gap-2 text-producer font-black text-[10px] tracking-[0.3em] uppercase mb-1">
                            <FileText size={12} /> Propuestas Recibidas
                        </div>
                        <h1 className="text-3xl md:text-4xl font-black tracking-tighter uppercase">
                            Solicitudes <span className="text-subtitle/30">Entrantes</span>
                        </h1>
                        <p className="text-[11px] text-subtitle/40 mt-2">
                            {counts.total} propuesta{counts.total !== 1 ? 's' : ''} recibida{counts.total !== 1 ? 's' : ''}
                        </p>
                    </div>

                    <div className="flex gap-3">
                        <div className="w-80">
                            <SearchBar
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="BUSCAR POR ARTISTA O SERVICIO..."
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
                            <Loader2 size={32} className="animate-spin text-producer" />
                        </div>
                    ) : filteredProposals.length > 0 ? (
                        filteredProposals.map((proposal) => (
                            <div
                                key={proposal.id}
                                className="group bg-[#0b0b0d] border border-white/5 rounded-2xl p-6 hover:border-producer/30 transition-all hover:bg-white/[0.02]"
                            >
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-3 flex-wrap mb-2">
                                            <h3 className="text-base font-black uppercase tracking-tighter text-light group-hover:text-producer transition-colors">
                                                {proposal.service.name}
                                            </h3>
                                            <ProposalStatusBadge status={getStatusBadgeVariant(proposal.status)} />
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[8px] font-black uppercase tracking-wider border ${proposal.isPaid === 2
                                                ? 'text-success bg-success/10 border-success/20'
                                                : proposal.isPaid === 1
                                                    ? 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20'
                                                    : 'text-error bg-error/10 border-error/20'
                                                }`}>
                                                {proposal.isPaid === 2
                                                    ? 'PAGO COMPLETO'
                                                    : proposal.isPaid === 1
                                                        ? 'ADELANTO PAGADO'
                                                        : 'PENDIENTE PAGO'}
                                            </span>
                                        </div>

                                        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[10px] font-bold text-subtitle/60 uppercase tracking-widest">
                                            <div className="flex items-center gap-2">
                                                <span className="text-subtitle/20">ARTISTA:</span>
                                                <div className="flex items-center gap-2">
                                                    {proposal.artist.avatar ? (
                                                        <img
                                                            src={proposal.artist.avatar}
                                                            alt=""
                                                            className="w-4 h-4 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-4 h-4 rounded-full bg-producer/20 text-producer text-[8px] font-black flex items-center justify-center">
                                                            {proposal.artist.name[0]?.toUpperCase() || 'A'}
                                                        </div>
                                                    )}
                                                    <span className="text-light/80 font-black">{proposal.artist.name}</span>
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-subtitle/20">PROPUESTA_ID:</span>
                                                <span className="text-light/60 font-mono">#{proposal.id}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-subtitle/20">PRESUPUESTO:</span>
                                                <span className="text-success font-black">{parseFloat(proposal.amount).toFixed(2)}€</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-subtitle/20">FECHA:</span>
                                                <span className="text-light/40 font-mono">
                                                    {new Date(proposal.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase()}
                                                </span>
                                            </div>
                                        </div>

                                        {proposal.message && (
                                            <div className="mt-3 p-3 bg-black/30 rounded-lg border border-white/5">
                                                <p className="text-[9px] text-subtitle/50 uppercase tracking-wider mb-1">MENSAJE DEL ARTISTA:</p>
                                                <p className="text-[10px] text-light/80 italic">"{proposal.message}"</p>
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col items-end gap-3">
                                        {proposal.status === 'pending' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRejectProposal(proposal.id)}
                                                    disabled={rejectingId === proposal.id}
                                                    className="px-4 py-2 bg-error/10 border border-error/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-error hover:bg-error hover:text-white transition-all flex items-center gap-1.5 disabled:opacity-50"
                                                >
                                                    {rejectingId === proposal.id ? (
                                                        <Loader2 size={12} className="animate-spin" />
                                                    ) : (
                                                        <X size={12} />
                                                    )}
                                                    RECHAZAR
                                                </button>
                                                <button
                                                    onClick={() => handleAcceptProposal(proposal.id)}
                                                    disabled={acceptingId === proposal.id}
                                                    className="px-4 py-2 bg-producer border border-producer rounded-xl text-black text-[9px] font-black uppercase tracking-widest hover:bg-producer/90 transition-all flex items-center gap-1.5 shadow-lg shadow-producer/10 disabled:opacity-50"
                                                >
                                                    {acceptingId === proposal.id ? (
                                                        <Loader2 size={12} className="animate-spin" />
                                                    ) : (
                                                        <Check size={12} />
                                                    )}
                                                    ACEPTAR
                                                </button>
                                            </div>
                                        ) : proposal.status === 'accepted' ? (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleOpenChat(proposal.artist.id)}
                                                    className="px-4 py-2 bg-white/5 border border-white/10 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-white/10 transition-all flex items-center gap-1.5"
                                                >
                                                    <MessageCircle size={12} />
                                                    CHAT
                                                </button>
                                                <button
                                                    onClick={handleOpenProjects}
                                                    className="px-4 py-2 bg-producer/10 border border-producer/20 rounded-xl text-[9px] font-black uppercase tracking-widest text-producer hover:bg-producer/20 transition-all flex items-center gap-1.5"
                                                >
                                                    <FolderOpen size={12} />
                                                    VER PROYECTOS
                                                </button>
                                            </div>
                                        ) : (
                                            <button
                                                onClick={() => handleOpenChat(proposal.artist.id)}
                                                className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-subtitle/40 hover:text-producer transition-colors"
                                            >
                                                <MessageCircle size={12} />
                                                <span>IR AL CHAT</span>
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="flex flex-col items-center justify-center py-32 border border-dashed border-white/5 rounded-2xl bg-black/10">
                            <MonitorX size={48} className="text-subtitle/20 mb-4" />
                            <p className="text-[10px] font-black text-subtitle/30 uppercase tracking-[0.3em]">
                                {search || statusFilter !== "Todas" ? "NO SE ENCONTRARON PROPUESTAS" : "NO HAY PROPUESTAS RECIBIDAS"}
                            </p>
                            <p className="text-[9px] text-subtitle/20 mt-2">
                                {search || statusFilter !== "Todas"
                                    ? "Ajusta los filtros de búsqueda"
                                    : "Los artistas te enviarán solicitudes aquí"}
                            </p>
                        </div>
                    )}
                </div>

                <AudioPlayer />
            </main>
        </div>
    );
};

export default ProducerProposalsPage;