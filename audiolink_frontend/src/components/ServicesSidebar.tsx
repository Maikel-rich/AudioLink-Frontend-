import React from 'react';
import { Calendar, Zap, MessageSquare } from 'lucide-react';
import Button from './Button';

const SERVICES = [
    {
        id: 1,
        title: "Mezcla y Masterización",
        price: "$150+",
        description: "Procesamiento vocal completo y equilibrio de instrumentos profesional.",
        features: ["Stems ilimitados", "3 Revisiones"],
        buttonText: "RESERVAR",
        icon: <Zap size={16} />
    },
    {
        id: 2,
        title: "Producción Personalizada",
        price: "$350+",
        description: "Pista hecha a medida desde cero para tu dirección artística.",
        features: ["Derechos exclusivos", "Licencia comercial"],
        buttonText: "COMENZAR",
        popular: true,
        icon: <Zap size={16} />
    },
    {
        id: 3,
        title: "Mentoría 1 a 1",
        price: "$80/hr",
        description: "Sesión de retroalimentación en vivo sobre tu proyecto o técnica.",
        features: ["Análisis de proyecto", "Tips de industria"],
        buttonText: "PROGRAMAR",
        icon: <MessageSquare size={16} />
    }
];

const ServicesSidebar = () => {
    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-artist rounded-full shadow-[0_0_12px_rgba(var(--artist-rgb),0.5)]" />
                <h3 className="text-xl font-bold text-light tracking-tight">Servicios y Tarifas</h3>
            </div>

            <div className="grid gap-4">
                {SERVICES.map((service) => (
                    <div
                        key={service.id}
                        className="relative group p-6 rounded-2xl transition-all duration-500 bg-white/3 border border-white/5 hover:bg-white/[0.07] hover:border-white/1 shadow-2xl"
                    >
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-artist opacity-40 group-hover:opacity-100 shadow-[4px_0_15px_rgba(var(--artist-rgb),0.4)] transition-all duration-500" />

                        <div className="flex flex-col gap-5">
                            <div className="space-y-3">
                                <div className="flex justify-between items-start gap-4">
                                    <h4 className="font-black text-sm uppercase tracking-widest text-light group-hover:text-artist transition-colors leading-tight">
                                        {service.title}
                                    </h4>
                                    <span className="text-artist font-mono text-sm font-bold whitespace-nowrap">
                                        {service.price}
                                    </span>
                                </div>

                                {service.popular && (
                                    <div className="inline-flex items-center justify-center px-2.5 py-1 rounded-full bg-artist/10 border border-artist/20">
                                        <span className="text-[10px] font-black text-artist uppercase tracking-[0.15em] leading-none">
                                            Popular
                                        </span>
                                    </div>
                                )}
                            </div>

                            <p className="text-subtitle text-[13px] leading-relaxed opacity-70 group-hover:opacity-100 transition-opacity">
                                {service.description}
                            </p>

                            <ul className="space-y-2.5">
                                {service.features.map((feature, i) => (
                                    <li key={i} className="flex items-center gap-3 text-[11px] text-light/60 font-bold uppercase tracking-wider">
                                        <div className="w-1.5 h-1.5 rounded-full bg-artist/40 group-hover:bg-artist shadow-[0_0_8px_rgba(var(--artist-rgb),0.4)] transition-all" />
                                        {feature}
                                    </li>
                                ))}
                            </ul>

                            <Button
                                variant="ghost"
                                fullWidth
                                className="mt-2 py-4 rounded-xl text-[11px] font-black transition-all duration-300 bg-white/5 text-subtitle border border-white/10 hover:bg-artist hover:text-white hover:border-artist hover:shadow-[0_0_25px_rgba(var(--artist-rgb),0.3)] group/btn"
                                onClick={() => console.log("Servicio:", service.title)}
                                rightIcon={<Calendar size={14} className="ml-2 group-hover/btn:scale-110 transition-transform" />}
                            >
                                {service.buttonText}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ServicesSidebar;