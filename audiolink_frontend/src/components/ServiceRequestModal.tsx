import React, { useState } from 'react';
import { X, Send, Loader2, CheckCircle, AlertCircle } from 'lucide-react';
import { serviceRequestService } from '@/services/serviceRequestService';

interface ServiceRequestModalProps {
    isOpen: boolean;
    onClose: () => void;
    producerId: number;
    producerName?: string;
    serviceId: number;
    serviceName: string;
    servicePrice: number;
    onSuccess: (requestId: number) => void;
}

export const ServiceRequestModal: React.FC<ServiceRequestModalProps> = ({
    isOpen,
    onClose,
    producerId,
    producerName,
    serviceId,
    serviceName,
    servicePrice,
    onSuccess
}) => {
    const [message, setMessage] = useState('');
    const [projectDetails, setProjectDetails] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!message.trim()) {
            setError('Por favor, escribe un mensaje para el productor');
            return;
        }

        setIsLoading(true);
        setError(null);

        try {
            const result = await serviceRequestService.createRequest({
                producerId,
                serviceId,
                message: message.trim(),
                projectDetails: projectDetails.trim() || undefined
            });

            setSuccess(true);
            setTimeout(() => {
                onSuccess(result.requestId);
                resetForm();
            }, 1500);
        } catch (err: any) {
            setError(err.response?.data?.error || 'Error al enviar la solicitud');
        } finally {
            setIsLoading(false);
        }
    };

    const resetForm = () => {
        setMessage('');
        setProjectDetails('');
        setError(null);
        setSuccess(false);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0b0b0d] border border-white/10 rounded-2xl max-w-lg w-full">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <div>
                        <h2 className="text-lg font-black uppercase tracking-tighter">Solicitar Servicio</h2>
                        <div className="flex items-center gap-2 mt-1">
                            <span className="text-[10px] text-subtitle/40">{producerName || 'Productor'}</span>
                            <span className="text-[8px] text-subtitle/30">•</span>
                            <span className="text-[10px] text-artist">{serviceName}</span>
                        </div>
                        <p className="text-xl font-black text-success mt-1">{servicePrice.toFixed(2)}€</p>
                    </div>
                    <button onClick={onClose} className="text-subtitle/40 hover:text-light">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div>
                        <label className="text-[8px] font-black uppercase text-subtitle/40 block mb-1">
                            Mensaje para el productor *
                        </label>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-light focus:outline-none focus:border-artist/40 resize-none"
                            placeholder="Hola, me interesa tu servicio... ¿Podemos hablar sobre los detalles?"
                        />
                        <p className="text-[7px] text-subtitle/40 mt-1">
                            Este mensaje se enviará al productor junto con tu solicitud
                        </p>
                    </div>

                    <div>
                        <label className="text-[8px] font-black uppercase text-subtitle/40 block mb-1">
                            Detalles adicionales (opcional)
                        </label>
                        <textarea
                            value={projectDetails}
                            onChange={(e) => setProjectDetails(e.target.value)}
                            rows={3}
                            className="w-full bg-black/40 border border-white/10 rounded-lg px-4 py-2 text-sm text-light focus:outline-none focus:border-artist/40 resize-none"
                            placeholder="Especificaciones técnicas, referencias, plazos deseados, etc..."
                        />
                    </div>

                    <div className="bg-black/30 rounded-lg p-3 border border-white/5">
                        <p className="text-[8px] font-black uppercase text-subtitle/40 mb-2">Resumen de la solicitud</p>
                        <div className="flex justify-between text-[10px]">
                            <span className="text-subtitle/50">Servicio:</span>
                            <span className="text-light font-bold">{serviceName}</span>
                        </div>
                        <div className="flex justify-between text-[10px] mt-1">
                            <span className="text-subtitle/50">Precio:</span>
                            <span className="text-success font-bold">{servicePrice.toFixed(2)}€</span>
                        </div>
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 p-3 bg-error/10 border border-error/20 rounded-lg">
                            <AlertCircle size={14} className="text-error" />
                            <span className="text-[10px] text-error">{error}</span>
                        </div>
                    )}

                    {success && (
                        <div className="flex items-center gap-2 p-3 bg-success/10 border border-success/20 rounded-lg">
                            <CheckCircle size={14} className="text-success" />
                            <span className="text-[10px] text-success">¡Solicitud enviada con éxito!</span>
                        </div>
                    )}

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-colors"
                        >
                            Cancelar
                        </button>
                        <button
                            type="submit"
                            disabled={isLoading || success}
                            className="flex-1 px-4 py-2 bg-artist text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-artist/90 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                        >
                            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                            {isLoading ? 'Enviando...' : 'Enviar Solicitud'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};