import React from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight,
    Play,
    Zap,
    Globe,
    Layers,
    ArrowUpRight,
    Headphones,
    Mic,
    Disc,
    Sparkles,
    Star,
    MessageCircle,
    Shield,
    TrendingUp
} from 'lucide-react';
import Button from "@/components/Button";
import AudioLinkLogo from '@/svg/AudioLinkLogo';
import { ROUTES } from "@/constants/routes";

const LandingPage = () => {
    const logoColor = "#3C83F6";

    return (
        <div className="min-h-screen bg-[#060608] text-light overflow-x-hidden font-sans">

            <nav className="fixed top-0 w-full z-50 bg-[#060608]/90 backdrop-blur-xl border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-3 group">
                        <AudioLinkLogo color={logoColor} size={42} />
                        <span className="text-sm font-black uppercase tracking-[0.3em] bg-gradient-to-r from-white to-white/60 bg-clip-text text-transparent group-hover:text-artist transition-colors">
                            AudioLink
                        </span>
                    </Link>

                    <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-subtitle/50">
                        <a href="#features" className="hover:text-artist transition-colors">Características</a>
                        <a href="#network" className="hover:text-artist transition-colors">Productores</a>
                        <a href="#how-it-works" className="hover:text-artist transition-colors">Cómo funciona</a>
                    </div>

                    <Link to={ROUTES.LOGIN}>
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-artist/50 text-artist text-[10px]">
                            INICIAR SESIÓN
                        </Button>
                    </Link>
                </div>
            </nav>

            <section className="relative pt-32 pb-20 px-6 overflow-hidden">
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-artist/10 rounded-full blur-[120px] -z-10" />
                <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-producer/5 rounded-full blur-[100px] -z-10" />
                <div className="absolute top-40 left-10 w-64 h-64 bg-artist/5 rounded-full blur-[80px] -z-10" />

                <div className="max-w-6xl mx-auto">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 mb-8 animate-pulse">
                                <Sparkles size={12} className="text-artist" />
                                <span className="text-[8px] font-black uppercase tracking-[0.2em] text-artist">Plataforma Profesional</span>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-tighter mb-6 leading-[1.1]">
                                Conecta con la
                                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-artist via-artist/80 to-producer/60 mt-2">
                                    élite del sonido
                                </span>
                            </h1>

                            <p className="text-base text-subtitle/60 max-w-lg mb-10 leading-relaxed">
                                La plataforma definitiva para artistas y productores. Gestiona tus sesiones,
                                contrata servicios profesionales y lleva tu música al siguiente nivel.
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Link to={ROUTES.LOGIN}>
                                    <Button variant="artist" size="lg" className="group w-full sm:w-auto shadow-xl shadow-artist/20">
                                        COMENZAR AHORA
                                        <ChevronRight size={16} className="ml-2 group-hover:translate-x-1 transition-transform" />
                                    </Button>
                                </Link>
                                <Button variant="outline" size="lg" className="group border-white/10">
                                    <Play size={14} className="mr-2" />
                                    VER DEMO
                                </Button>
                            </div>

                            <div className="flex gap-8 mt-12 pt-8 border-t border-white/5">
                                <div>
                                    <p className="text-2xl font-black text-artist">500+</p>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-subtitle/40">Productores</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-artist">2K+</p>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-subtitle/40">Proyectos</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-black text-artist">98%</p>
                                    <p className="text-[9px] font-black uppercase tracking-wider text-subtitle/40">Satisfacción</p>
                                </div>
                            </div>
                        </div>

                        <div className="relative group">
                            <div className="absolute inset-0 bg-artist/20 blur-[60px] rounded-3xl opacity-0 group-hover:opacity-30 transition-opacity duration-700" />
                            <div className="relative bg-[#0b0b0d] rounded-2xl border border-white/10 p-5 shadow-2xl transform group-hover:scale-[1.02] transition-transform duration-500">
                                <div className="flex items-center gap-2 mb-5 px-2">
                                    <div className="w-3 h-3 rounded-full bg-red-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-yellow-500/60" />
                                    <div className="w-3 h-3 rounded-full bg-green-500/60" />
                                    <div className="flex-1 text-center">
                                        <span className="text-[8px] font-black text-subtitle/30 uppercase tracking-widest">AudioLink Studio</span>
                                    </div>
                                </div>
                                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                                    <div className="flex items-center gap-3 mb-4">
                                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-artist/20 to-transparent border border-artist/30 flex items-center justify-center">
                                            <Headphones size={20} className="text-artist" />
                                        </div>
                                        <div>
                                            <p className="text-xs font-black uppercase">Sesión Activa</p>
                                            <p className="text-[9px] text-subtitle/40">Mezcla en progreso</p>
                                        </div>
                                    </div>
                                    <div className="space-y-3">
                                        <div className="flex justify-between text-[8px] font-black">
                                            <span className="text-subtitle/40">Progreso</span>
                                            <span className="text-artist">65%</span>
                                        </div>
                                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-artist to-artist/60 rounded-full w-[65%]" />
                                        </div>
                                    </div>
                                    <div className="flex gap-2 mt-4">
                                        <div className="flex-1 h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                            <Mic size={12} className="text-subtitle/40" />
                                        </div>
                                        <div className="flex-1 h-8 bg-white/5 rounded-lg border border-white/10 flex items-center justify-center">
                                            <Disc size={12} className="text-subtitle/40" />
                                        </div>
                                        <div className="flex-1 h-8 bg-artist rounded-lg flex items-center justify-center">
                                            <Play size={12} className="text-black" />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="features" className="py-28 px-6 max-w-7xl mx-auto">
                <div className="text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                        <Star size={10} className="text-artist" />
                        <span className="text-[8px] font-black uppercase tracking-[0.2em] text-artist">Características</span>
                    </div>
                    <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                        Todo lo que necesitas
                        <span className="block text-subtitle/30">para crear música profesional</span>
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {[
                        {
                            icon: <Layers size={20} />,
                            title: "Gestión de Sesiones",
                            desc: "Centraliza tus archivos multitrack, revisiones y feedback en un flujo de trabajo profesional.",
                            color: "from-artist/20 to-transparent"
                        },
                        {
                            icon: <MessageCircle size={20} />,
                            title: "Comunicación Directa",
                            desc: "Chat integrado para coordinar detalles, compartir archivos y seguimiento en tiempo real.",
                            color: "from-blue-500/20 to-transparent"
                        },
                        {
                            icon: <Globe size={20} />,
                            title: "Red Global",
                            desc: "Accede a productores certificados filtrados por género y equipo técnico.",
                            color: "from-green-500/20 to-transparent"
                        }
                    ].map((feat, i) => (
                        <div key={i} className="group p-8 rounded-2xl bg-gradient-to-br from-white/[0.02] to-transparent border border-white/5 hover:border-artist/30 transition-all hover:-translate-y-2 duration-300">
                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feat.color} border border-white/10 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}>
                                {feat.icon}
                            </div>
                            <h3 className="text-base font-black uppercase tracking-tight mb-3">{feat.title}</h3>
                            <p className="text-[11px] text-subtitle/50 leading-relaxed">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            <section id="how-it-works" className="py-28 px-6 bg-gradient-to-b from-white/[0.01] to-transparent border-y border-white/5">
                <div className="max-w-7xl mx-auto">
                    <div className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                            <TrendingUp size={10} className="text-artist" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-artist">Workflow</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                            Cómo funciona
                            <span className="block text-subtitle/30">en 3 pasos simples</span>
                        </h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                        {[
                            { step: "01", title: "Explora", desc: "Descubre productores, escucha sus beats y revisa sus servicios", icon: <Headphones size={24} /> },
                            { step: "02", title: "Solicita", desc: "Envía una solicitud, chatea y comparte los detalles de tu proyecto", icon: <MessageCircle size={24} /> },
                            { step: "03", title: "Recibe", desc: "Obtén tu master final y libera tu música al mundo", icon: <Shield size={24} /> }
                        ].map((step, i) => (
                            <div key={i} className="text-center group">
                                <div className="relative w-20 h-20 mx-auto rounded-2xl bg-gradient-to-br from-artist/20 to-transparent border border-artist/30 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-artist text-black text-[10px] font-black flex items-center justify-center">
                                        {step.step}
                                    </span>
                                    <div className="text-artist">
                                        {step.icon}
                                    </div>
                                </div>
                                <h3 className="text-lg font-black uppercase mb-2">{step.title}</h3>
                                <p className="text-[11px] text-subtitle/50 max-w-xs mx-auto">{step.desc}</p>
                            </div>
                        ))}
                    </div>

                    <div className="hidden md:block relative mt-8">
                        <div className="absolute left-1/3 right-1/3 top-1/2 h-px bg-gradient-to-r from-transparent via-artist/30 to-transparent" />
                    </div>
                </div>
            </section>

            <section id="network" className="py-28 px-6 max-w-7xl mx-auto">
                <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
                    <div>
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-4">
                            <Zap size={10} className="text-artist" />
                            <span className="text-[8px] font-black uppercase tracking-[0.2em] text-artist">Top Productores</span>
                        </div>
                        <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">
                            Profesionales destacados
                        </h2>
                        <p className="text-subtitle/40 text-sm mt-2">Los mejores productores, listos para trabajar contigo</p>
                    </div>
                    <Link to={ROUTES.SEARCH}>
                        <Button variant="ghost" size="sm" className="text-[9px] group border border-white/10 hover:border-artist/30">
                            VER CATÁLOGO COMPLETO
                            <ArrowUpRight size={12} className="ml-1 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {[
                        { name: "Kael Beats", genre: "Trap / Hip Hop", price: "Desde 50€", level: "Premium" },
                        { name: "Darkko", genre: "Dembow / Reggaeton", price: "Desde 45€", level: "Destacado" },
                        { name: "Elena Rose", genre: "R&B / Pop", price: "Desde 65€", level: "Top Rated" },
                        { name: "Dímelo Flow", genre: "Urbano / Latin", price: "Desde 55€", level: "Premium" }
                    ].map((producer, i) => (
                        <div key={i} className="group bg-white/[0.02] border border-white/5 rounded-xl p-5 hover:border-artist/40 transition-all hover:-translate-y-1 duration-300">
                            <div className="w-full h-32 bg-gradient-to-br from-artist/10 to-producer/5 rounded-lg mb-4 flex items-center justify-center relative overflow-hidden">
                                <Headphones size={36} className="text-subtitle/30 group-hover:text-artist/40 transition-colors z-10" />
                                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                {producer.level === "Premium" && (
                                    <span className="absolute top-2 right-2 text-[7px] font-black bg-artist/20 text-artist px-1.5 py-0.5 rounded">
                                        {producer.level}
                                    </span>
                                )}
                            </div>
                            <p className="text-xs font-black uppercase mb-0.5 group-hover:text-artist transition-colors">{producer.name}</p>
                            <p className="text-[8px] text-subtitle/40 uppercase tracking-wider">{producer.genre}</p>
                            <div className="flex items-center justify-between mt-3 pt-2 border-t border-white/5">
                                <p className="text-[10px] font-black text-artist">{producer.price}</p>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, s) => (
                                        <Star key={s} size={8} className="fill-artist/40 text-artist/40" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            <section className="py-32 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-artist/5 via-transparent to-producer/5 -z-10" />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-artist/10 rounded-full blur-[100px] -z-10" />

                <div className="max-w-3xl mx-auto">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-6">
                        <Sparkles size={10} className="text-artist" />
                        <span className="text-[7px] font-black uppercase tracking-[0.2em] text-artist">Comienza hoy</span>
                    </div>
                    <h2 className="text-4xl md:text-5xl font-black uppercase tracking-tighter mb-6 leading-tight">
                        ¿Listo para llevar
                        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-artist to-artist/60">
                            tu sonido al siguiente nivel?
                        </span>
                    </h2>
                    <p className="text-subtitle/50 mb-10 max-w-md mx-auto">
                        Únete a cientos de artistas que ya están produciendo con los mejores profesionales.
                    </p>
                    <Link to={ROUTES.LOGIN}>
                        <Button variant="artist" size="xl" className="px-12 shadow-2xl shadow-artist/20 group text-base">
                            COMENZAR AHORA
                            <ArrowUpRight size={18} className="ml-2 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </Button>
                    </Link>
                </div>
            </section>

            <footer className="py-8 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                        <AudioLinkLogo color={logoColor} size={28} />
                        <span className="text-[9px] font-black uppercase tracking-[0.3em] text-subtitle/30">
                            AudioLink
                        </span>
                    </div>

                    <p className="text-[7px] font-black text-subtitle/20 uppercase tracking-[0.3em]">
                        © 2024 AudioLink • Donde la música cobra vida
                    </p>

                    <div className="flex gap-4">
                        <a href="#" className="text-[7px] font-black text-subtitle/30 hover:text-artist transition-colors uppercase tracking-wider">
                            Términos
                        </a>
                        <a href="#" className="text-[7px] font-black text-subtitle/30 hover:text-artist transition-colors uppercase tracking-wider">
                            Privacidad
                        </a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;