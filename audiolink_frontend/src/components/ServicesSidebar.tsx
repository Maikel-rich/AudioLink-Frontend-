import React from 'react';
import { Calendar, Zap, MessageSquare, ArrowRight } from 'lucide-react';
import Button from './Button';

const SERVICES = [
    {
        id: 1,
        title: "Full Mixing & Mastering",
        price: "$150",
        description: "CADENA DE PROCESAMIENTO ANALÓGICO + DIGITAL.",
        features: ["STEMS ILIMITADOS", "3 REVISIONES HQ"],
        icon: <Zap size={16} className="text-artist" />
    },
    {
        id: 2,
        title: "Producción Exclusiva",
        price: "$350",
        description: "DISEÑO SONORO DESDE CERO A MEDIDA.",
        features: ["DERECHOS TOTALES", "MULTITRACKS"],
        popular: true,
        icon: <Zap size={16} className="text-artist" />
    }
];

const ServicesSidebar = () => {
    return (
        <div className="space-y-4">
            {SERVICES.map((service) => (
                <div
                    key={service.id}
                    className={`group relative p-6 rounded-2xl border transition-all duration-500 ${service.popular ? 'bg-artist/5 border-artist/30' : 'bg-white/2 border-white/5'
                        }`}
                >
                    <div className="flex justify-between items-start mb-6">
                        <div className="p-2 bg-black/40 rounded-lg border border-white/10">{service.icon}</div>
                        <div className="text-right">
                            <span className="text-[9px] font-black text-subtitle/20 uppercase tracking-widest block mb-1">Desde</span>
                            <span className="text-xl font-black text-light tracking-tighter">{service.price}</span>
                        </div>
                    </div>

                    <h3 className="text-xs font-black uppercase tracking-widest text-light mb-2">{service.title}</h3>
                    <p className="text-[10px] font-bold text-subtitle/40 uppercase mb-6 leading-relaxed">{service.description}</p>

                    <ul className="space-y-2 mb-8">
                        {service.features.map((f, i) => (
                            <li key={i} className="flex items-center gap-2 text-[9px] font-black text-subtitle/60 uppercase">
                                <div className="w-1 h-1 bg-artist/40 rounded-full" /> {f}
                            </li>
                        ))}
                    </ul>

                    <Button
                        variant={service.popular ? "artist" : "outline"}
                        fullWidth
                        className="group/btn h-12 rounded-xl text-[10px] font-black"
                    >
                        CONTRATAR SERVICIO <ArrowRight size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
                    </Button>

                    {service.popular && (
                        <div className="absolute -top-3 left-6 px-3 py-1 bg-artist text-white text-[8px] font-black uppercase tracking-widest rounded-full shadow-lg shadow-artist/20">
                            Recomendado
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default ServicesSidebar;