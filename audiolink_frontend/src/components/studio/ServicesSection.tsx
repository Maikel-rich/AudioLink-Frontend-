import React from 'react';
import { Layers, Plus, Trash2 } from 'lucide-react';
import { StudioServiceUI } from '@/services/studioService';

interface NewServiceState {
    title: string;
    price: string;
    desc: string;
}

interface ServicesSectionProps {
    services: StudioServiceUI[];
    isEditing: boolean;
    newService: NewServiceState;
    onNewServiceChange: (field: keyof NewServiceState, value: string) => void;
    onAddService: () => void;
    onRemoveService: (id: string | number) => void;
}

export const ServicesSection: React.FC<ServicesSectionProps> = ({
    services,
    isEditing,
    newService,
    onNewServiceChange,
    onAddService,
    onRemoveService
}) => {
    return (
        <div className="bg-[#0b0b0d] border border-white/3 rounded-2xl p-8 space-y-6">
            <div className="flex items-center gap-2 text-subtitle/40 border-b border-white/3 pb-4">
                <Layers size={14} className="text-producer" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Módulos de Servicios Activos</h3>
            </div>

            {isEditing && (
                <div className="p-6 bg-white/2 border border-dashed border-white/10 rounded-xl space-y-4 animate-fade-in">
                    <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-producer">
                        <Plus size={12} /> Añadir tarifa al catálogo público
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                        <div className="md:col-span-5">
                            <input
                                type="text"
                                placeholder="TÍTULO (Ej: Mezcla Premium)"
                                value={newService.title}
                                onChange={(e) => onNewServiceChange('title', e.target.value)}
                                className="w-full bg-[#060608] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-bold text-light focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-3">
                            <input
                                type="number"
                                placeholder="PRECIO EN €"
                                value={newService.price}
                                onChange={(e) => onNewServiceChange('price', e.target.value)}
                                className="w-full bg-[#060608] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-bold text-light font-mono focus:outline-none"
                            />
                        </div>
                        <div className="md:col-span-4">
                            <button
                                onClick={onAddService}
                                className="w-full bg-producer text-black text-[9px] font-black uppercase tracking-widest rounded-lg py-2.5 flex items-center justify-center gap-1.5 h-full font-bold cursor-pointer"
                            >
                                <Plus size={14} /> ACOPLAR BUS TARIFA
                            </button>
                        </div>
                    </div>
                    <input
                        type="text"
                        placeholder="DESCRIPCIÓN DEL PROCESAMIENTO..."
                        value={newService.desc}
                        onChange={(e) => onNewServiceChange('desc', e.target.value)}
                        className="w-full bg-[#060608] border border-white/5 rounded-lg px-4 py-2.5 text-xs font-medium text-light focus:outline-none"
                    />
                </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services && services.length > 0 ? (
                    services.map((service, idx) => (
                        <div key={service.id || idx} className="bg-black/20 border border-white/3 rounded-xl p-5 flex flex-col justify-between relative group/service hover:border-white/10 transition-colors">
                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-4">
                                    <h4 className="text-xs font-black uppercase tracking-wider text-light/90 group-hover/service:text-producer transition-colors">
                                        {service.title}
                                    </h4>
                                    <span className="text-xs font-black text-success font-mono bg-success/5 border border-success/10 px-2.5 py-0.5 rounded-md">
                                        {service.price}€
                                    </span>
                                </div>
                                <p className="text-xs text-subtitle/40 leading-relaxed font-medium">
                                    {service.description || "Sin descripción."}
                                </p>
                            </div>

                            {isEditing && (
                                <div className="mt-4 pt-3 border-t border-white/5 flex justify-end">
                                    <button
                                        onClick={() => onRemoveService(service.id)}
                                        className="px-3 py-1.5 bg-error/5 border border-error/10 rounded-lg text-[8px] font-black uppercase tracking-widest text-error hover:bg-error/10 transition-colors flex items-center gap-1 cursor-pointer"
                                    >
                                        <Trash2 size={10} /> DESACOPLAR
                                    </button>
                                </div>
                            )}
                        </div>
                    ))
                ) : (
                    <div className="col-span-2 text-center py-10 border border-dashed border-white/5 rounded-xl bg-black/10">
                        <p className="text-[9px] font-black text-subtitle/20 uppercase tracking-widest">No hay módulos de servicio cargados en este rack</p>
                    </div>
                )}
            </div>
        </div>
    );
};