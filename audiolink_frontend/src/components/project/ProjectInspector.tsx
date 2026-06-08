import React, { useState, useEffect, useCallback } from 'react';
import { X, Download, CheckCircle, Clock, AlertCircle, Loader2, RefreshCw } from 'lucide-react';
import { projectService } from '@/services/projectService';

interface ProjectInspectorProps {
    project: {
        id?: number;
        title: string;
        artist: { fullName: string; email: string } | null;
        producer: { fullName: string; email: string } | null;
        currentStageName?: string | null;
        progressPercentage?: number;
        isPaid?: boolean;
        finalAudioUrl?: string | null;
        isFinalAudioAvailable?: boolean;
    } | null;
    onClose: () => void;
    userRole?: 'producer' | 'artist';
    onUpdate?: () => void;
}

const ProjectInspector = ({ project, onClose, userRole = 'producer', onUpdate }: ProjectInspectorProps) => {
    const [progress, setProgress] = useState(0);
    const [stageName, setStageName] = useState('');
    const [isUpdating, setIsUpdating] = useState(false);
    const [isDownloadingFinal, setIsDownloadingFinal] = useState(false);
    const [finalAudioUrl, setFinalAudioUrl] = useState<string | null>(null);
    const [isPaid, setIsPaid] = useState(false);
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [localProgress, setLocalProgress] = useState(0);
    const [localStageName, setLocalStageName] = useState('');

    const isProducer = userRole === 'producer';
    const isArtist = userRole === 'artist';
    const isFullyPaid = isPaid;
    const projectId = project?.id;

    const refreshProjectData = useCallback(async () => {
        if (!projectId) return;

        setIsRefreshing(true);
        try {
            const updatedProject = await projectService.getProjectById(projectId);
            const paymentStatus = await projectService.getPaymentStatusByProject(projectId);
            const hasFinalAudio = await projectService.hasFinalAudioFile(projectId);

            setLocalProgress(updatedProject.progressPercentage || 0);
            setLocalStageName(updatedProject.currentStageName || '');
            setProgress(updatedProject.progressPercentage || 0);
            setStageName(updatedProject.currentStageName || '');
            setIsPaid(paymentStatus.isFullyPaid || false);

            const isProgressComplete = updatedProject.progressPercentage === 100;
            const canDownload = paymentStatus.isFullyPaid && isProgressComplete && hasFinalAudio;

            setFinalAudioUrl(canDownload ? 'available' : null);

            if (onUpdate) onUpdate();
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsRefreshing(false);
        }
    }, [projectId, onUpdate]);

    useEffect(() => {
        const loadProjectData = async () => {
            if (!projectId) return;

            try {
                const updatedProject = await projectService.getProjectById(projectId);
                setLocalProgress(updatedProject.progressPercentage || 0);
                setLocalStageName(updatedProject.currentStageName || '');
                setProgress(updatedProject.progressPercentage || 0);
                setStageName(updatedProject.currentStageName || '');
                setFinalAudioUrl(updatedProject.finalAudioUrl || null);
                setIsPaid(updatedProject.isPaid || false);
            } catch (error) {
                // Error silencioso en producción
            }
        };

        if (project) {
            loadProjectData();
        }
    }, [projectId, project]);

    useEffect(() => {
        setLocalProgress(progress);
    }, [progress]);

    useEffect(() => {
        setLocalStageName(stageName);
    }, [stageName]);

    const handleUpdateProgress = async () => {
        if (!projectId) return;
        setIsUpdating(true);

        try {
            await projectService.updateProgress(projectId, {
                progressPercentage: localProgress,
                currentStageName: localStageName,
                status: localProgress === 100 ? 'completed' : 'active'
            });

            await refreshProjectData();
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsUpdating(false);
        }
    };

    const handleUploadFinalAudio = () => {
        // Función reservada para futura implementación
    };

    const handleDownloadFinalAudio = async () => {
        if (!projectId || !isArtist) return;

        if (!isFullyPaid) return;

        if (!finalAudioUrl) return;

        setIsDownloadingFinal(true);
        try {
            const { downloadUrl, fileName } = await projectService.downloadFinalAudio(projectId);

            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsDownloadingFinal(false);
        }
    };

    if (!project) return null;

    const displayParticipant = userRole === 'producer'
        ? (project.artist?.fullName || 'Artista no asignado')
        : (project.producer?.fullName || 'Productor no asignado');

    const accentText = userRole === 'artist' ? 'text-artist' : 'text-producer';
    const accentBg = userRole === 'artist' ? 'bg-artist shadow-artist/20' : 'bg-producer shadow-producer/20';
    const progressColor = localProgress === 0 ? 'bg-gray-500' : (localProgress === 100 ? accentBg : `${accentBg}/60`);
    const progressTextColor = localProgress === 0 ? 'text-gray-400' : (localProgress === 100 ? accentText : `${accentText}`);

    const getArtistStatusMessage = () => {
        if (!isFullyPaid) {
            return {
                type: 'payment',
                title: 'Pendiente de pago',
                message: 'Para descargar el audio final, necesitas completar el pago total del proyecto.',
                showButton: false
            };
        }

        if (!finalAudioUrl) {
            return {
                type: 'waiting',
                title: 'Audio final en preparación',
                message: 'El productor está preparando el audio final. Recibirás una notificación cuando esté listo.',
                showButton: false
            };
        }

        return {
            type: 'ready',
            title: 'Audio final listo',
            message: 'El audio final está disponible para descargar.',
            showButton: true
        };
    };

    const artistStatus = isArtist ? getArtistStatusMessage() : null;

    return (
        <div className="fixed top-0 right-0 h-screen w-[450px] bg-[#0b0b0d]/95 backdrop-blur-2xl border-l border-white/10 z-50 shadow-2xl flex flex-col">
            <div className="p-6 border-b border-white/10 flex justify-between items-center bg-white/2">
                <span className="text-[10px] font-black uppercase tracking-[0.3em] text-subtitle/40">Inspector de Sesión</span>
                <div className="flex items-center gap-2">
                    <button
                        onClick={refreshProjectData}
                        disabled={isRefreshing}
                        className="p-2 hover:bg-white/5 rounded-full text-subtitle/60 hover:text-light transition-colors"
                        title="Refrescar"
                    >
                        <RefreshCw size={16} className={isRefreshing ? 'animate-spin' : ''} />
                    </button>
                    <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-subtitle/60 hover:text-light transition-colors">
                        <X size={20} />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 custom-scrollbar space-y-8">
                <section>
                    <h2 className="text-2xl font-black uppercase tracking-tighter mb-1">{project.title}</h2>
                    <p className={`font-bold text-xs uppercase tracking-[0.2em] ${accentText}`}>
                        {userRole === 'producer' ? `Artista: ${displayParticipant}` : `Productor: ${displayParticipant}`}
                    </p>
                </section>

                <section className="space-y-4">
                    <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black uppercase text-subtitle/40">Progreso del Proyecto</span>
                        <span className={`text-lg font-black ${progressTextColor}`}>{localProgress}%</span>
                    </div>
                    <div className="h-2 bg-gray-800/50 rounded-full overflow-hidden">
                        <div
                            className={`h-full ${progressColor} rounded-full transition-all duration-500 ease-out`}
                            style={{ width: `${localProgress}%` }}
                        />
                    </div>

                    {isProducer && (
                        <div className="space-y-3 mt-4">
                            <div className="flex items-center gap-3">
                                <input
                                    type="range"
                                    min="0"
                                    max="100"
                                    step="5"
                                    value={localProgress}
                                    onChange={(e) => setLocalProgress(parseInt(e.target.value))}
                                    className="flex-1 h-2 bg-gray-800/50 rounded-lg appearance-none cursor-pointer"
                                />
                                <span className={`text-xs font-bold min-w-[40px] ${progressTextColor}`}>{localProgress}%</span>
                            </div>
                            <input
                                type="text"
                                value={localStageName}
                                onChange={(e) => setLocalStageName(e.target.value)}
                                placeholder="Nombre de la etapa actual"
                                className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-light focus:outline-none focus:border-artist/40"
                            />
                            <button
                                onClick={handleUpdateProgress}
                                disabled={isUpdating}
                                className={`w-full px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50 ${accentBg} text-black`}
                            >
                                {isUpdating ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Actualizar Progreso'}
                            </button>
                        </div>
                    )}

                    {!isProducer && (
                        <div className="bg-black/30 rounded-lg p-3 mt-2">
                            <p className="text-[11px] text-subtitle/60">Etapa actual: <span className="text-light font-bold">{localStageName || 'Iniciado'}</span></p>
                            <p className={`text-[10px] mt-1 ${progressTextColor}`}>Progreso: {localProgress}%</p>
                        </div>
                    )}
                </section>

                <section className={`border rounded-xl p-4 transition-all duration-300 ${finalAudioUrl && isFullyPaid ? 'border-success/30 bg-success/5' :
                    !isFullyPaid ? 'border-warning/20 bg-warning/5' : 'border-white/10'
                    }`}>
                    <div className="flex justify-between items-center mb-3">
                        <h4 className={`text-[10px] font-black uppercase tracking-[0.2em] ${finalAudioUrl && isFullyPaid ? 'text-success' :
                            !isFullyPaid ? 'text-warning' : 'text-subtitle/40'
                            }`}>
                            {finalAudioUrl && isFullyPaid ? '✓ Audio Final Listo' :
                                !isFullyPaid ? '⚠️ Pago Pendiente' : 'Audio Final'}
                        </h4>
                        {finalAudioUrl && isFullyPaid && (
                            <span className="text-[8px] bg-success/20 text-success px-2 py-0.5 rounded-full">Disponible</span>
                        )}
                        {!isFullyPaid && (
                            <span className="text-[8px] bg-warning/20 text-warning px-2 py-0.5 rounded-full">Requiere pago</span>
                        )}
                    </div>

                    {isArtist && artistStatus && (
                        <div className="space-y-3">
                            <div className={`rounded-lg p-3 ${artistStatus.type === 'ready' ? 'bg-success/10' :
                                artistStatus.type === 'payment' ? 'bg-warning/10' : 'bg-white/5'
                                }`}>
                                <div className="flex items-center gap-2 mb-2">
                                    {artistStatus.type === 'ready' && <CheckCircle size={18} className="text-success" />}
                                    {artistStatus.type === 'payment' && <AlertCircle size={18} className="text-warning" />}
                                    {artistStatus.type === 'waiting' && <Clock size={18} className="text-subtitle/40" />}
                                    <span className={`text-[10px] font-black uppercase tracking-wider ${artistStatus.type === 'ready' ? 'text-success' :
                                        artistStatus.type === 'payment' ? 'text-warning' : 'text-subtitle/40'
                                        }`}>
                                        {artistStatus.title}
                                    </span>
                                </div>
                                <p className="text-[9px] text-subtitle/60 leading-relaxed">
                                    {artistStatus.message}
                                </p>
                            </div>

                            {artistStatus.showButton && finalAudioUrl && (
                                <button
                                    onClick={handleDownloadFinalAudio}
                                    disabled={isDownloadingFinal}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-artist text-black rounded-lg text-[9px] font-black uppercase tracking-widest hover:bg-artist/90 transition-all disabled:opacity-50"
                                >
                                    {isDownloadingFinal ? <Loader2 size={14} className="animate-spin" /> : <Download size={14} />}
                                    {isDownloadingFinal ? 'Preparando descarga...' : 'Descargar Audio Final (Máster)'}
                                </button>
                            )}
                        </div>
                    )}

                    {isProducer && (
                        <div className="space-y-3">
                            <div className="bg-white/5 rounded-lg p-3 text-center">
                                <div className="flex items-center justify-center gap-2 mb-2">
                                    {finalAudioUrl ? (
                                        <CheckCircle size={18} className="text-success" />
                                    ) : (
                                        <Clock size={18} className="text-subtitle/40" />
                                    )}
                                    <span className={`text-[9px] font-black uppercase tracking-wider ${finalAudioUrl ? 'text-success' : 'text-subtitle/40'}`}>
                                        {finalAudioUrl ? 'Audio final entregado' : 'Audio final pendiente'}
                                    </span>
                                </div>
                                <p className="text-[8px] text-subtitle/60">
                                    {finalAudioUrl
                                        ? 'El artista ya puede descargar el archivo final'
                                        : localProgress === 100
                                            ? 'Sube el audio final usando el botón de "Subir Archivo" en la sección de archivos'
                                            : 'Primero completa el progreso del proyecto al 100%'}
                                </p>
                            </div>
                        </div>
                    )}
                </section>

                {isArtist && (
                    <section className={`rounded-xl p-4 ${isFullyPaid ? 'bg-success/5 border border-success/20' : 'bg-warning/5 border border-warning/20'}`}>
                        <div className="flex items-center gap-2 mb-2">
                            {isFullyPaid ? (
                                <CheckCircle size={14} className="text-success" />
                            ) : (
                                <AlertCircle size={14} className="text-warning" />
                            )}
                            <span className={`text-[9px] font-black uppercase tracking-wider ${isFullyPaid ? 'text-success' : 'text-warning'}`}>
                                {isFullyPaid ? 'Pago completado' : 'Pendiente de pago'}
                            </span>
                        </div>
                        <p className="text-[9px] text-subtitle/60">
                            {isFullyPaid
                                ? 'El pago total del proyecto ha sido completado.'
                                : 'Para acceder al audio final, necesitas completar el pago total del proyecto.'}
                        </p>
                    </section>
                )}

                {isProducer && localProgress === 100 && finalAudioUrl && (
                    <section className="bg-success/5 border border-success/20 rounded-xl p-4">
                        <div className="flex items-center gap-2">
                            <CheckCircle size={14} className="text-success" />
                            <span className="text-[9px] font-black text-success uppercase tracking-wider">Proyecto Completado</span>
                        </div>
                        <p className="text-[10px] text-subtitle/60 mt-1">El artista ya puede descargar el audio final.</p>
                    </section>
                )}

                <div className="text-center pt-4">
                    <p className="text-[7px] text-subtitle/30">
                        Última actualización: {new Date().toLocaleTimeString()}
                    </p>
                </div>
            </div>
        </div>
    );
};

export default ProjectInspector;