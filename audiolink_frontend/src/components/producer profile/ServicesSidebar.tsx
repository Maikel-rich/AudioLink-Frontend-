import React, { useState } from 'react';
import { Zap, ArrowRight, Package, Mic, Wand2, Radio, MessageCircle } from 'lucide-react';
import Button from '@/components/Button';
import { StudioServiceUI } from '@/services/studioService';
import { ServiceRequestModal } from '@/components/ServiceRequestModal';

interface ServicesSidebarProps {
    services: StudioServiceUI[];
    isOwnProfile?: boolean;
    producerId?: number;
    producerName?: string;
}

const serviceIcons = [Package, Mic, Wand2, Radio, Zap];

const ServicesSidebar = ({ services = [], isOwnProfile = false, producerId, producerName }: ServicesSidebarProps) => {
    const [selectedService, setSelectedService] = useState<StudioServiceUI | null>(null);
    const [showModal, setShowModal] = useState(false);

    const getServiceIcon = (index: number) => {
        const Icon = serviceIcons[index % serviceIcons.length];
        return <Icon size={16} />;
    };

    const handleRequestService = (service: StudioServiceUI) => {
        setSelectedService(service);
        setShowModal(true);
    };

    return (
        <>
            <div className="space-y-3">
                {services && services.length > 0 ? (
                    services.map((service, index) => (
                        <div
                            key={service.id || index}
                            className="group relative p-4 rounded-xl border transition-all duration-300 bg-white/[0.02] border-white/8 hover:border-artist/40 hover:bg-artist/5"
                        >
                            <div className="flex flex-col gap-3">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <div className="p-2 rounded-lg bg-artist/15 text-artist border border-artist/25">
                                            {getServiceIcon(index)}
                                        </div>
                                        <h3 className="text-sm font-black uppercase tracking-wider text-light group-hover:text-artist transition-colors">
                                            {service.title}
                                        </h3>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <div className="text-right">
                                        <div className="text-xl font-mono font-black text-success tracking-tighter">
                                            {service.price}€
                                        </div>
                                        <div className="text-[8px] font-black uppercase text-subtitle/40 tracking-widest">
                                            Tarifa Fija
                                        </div>
                                    </div>
                                </div>

                                {service.description && (
                                    <p className="text-[11px] text-subtitle/60 leading-relaxed font-medium">
                                        {service.description}
                                    </p>
                                )}

                                {!isOwnProfile && (
                                    <div className="pt-1">
                                        <Button
                                            onClick={() => handleRequestService(service)}
                                            variant="artist"
                                            size="sm"
                                            fullWidth
                                            className="group/btn font-black text-[9px] tracking-widest py-2 shadow-md"
                                        >
                                            <MessageCircle size={12} className="mr-2" />
                                            SOLICITAR SERVICIO
                                            <ArrowRight size={12} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="flex flex-col items-center justify-center p-8 border border-dashed border-white/8 rounded-xl bg-white/5 text-center">
                        <Package size={32} className="text-subtitle/30 mb-2" />
                        <p className="text-[10px] font-black text-subtitle/40 uppercase tracking-[0.2em]">
                            Sin servicios configurados
                        </p>
                        <p className="text-[8px] font-medium text-subtitle/30 uppercase tracking-wider mt-1">
                            {isOwnProfile ? "Añade tarifas desde el panel principal" : "Consulta vía mensajería"}
                        </p>
                    </div>
                )}
            </div>

            {selectedService && producerId && (
                <ServiceRequestModal
                    isOpen={showModal}
                    onClose={() => {
                        setShowModal(false);
                        setSelectedService(null);
                    }}
                    producerId={producerId}
                    producerName={producerName}
                    serviceId={parseInt(selectedService.id as string)}
                    serviceName={selectedService.title}
                    servicePrice={parseFloat(selectedService.price)}
                    onSuccess={(requestId) => {
                        setShowModal(false);
                        setSelectedService(null);
                    }}
                />
            )}
        </>
    );
};

export default ServicesSidebar;