import React from 'react';
import { Link } from 'react-router-dom';
import {
    ChevronRight,
    Play,
    ShieldCheck,
    Zap,
    Globe,
    Layers,
    ArrowUpRight,
    Activity
} from 'lucide-react';
import Button from "@/components/Button";
import { ROUTES } from "@/constants/routes";

const LandingPage = () => {
    return (
        <div className="min-h-screen bg-[#08080a] text-light overflow-x-hidden">

            {/* --- NAV BAR --- */}
            <nav className="fixed top-0 w-full z-50 bg-[#08080a]/80 backdrop-blur-md border-b border-white/5">
                <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-artist rounded-lg flex items-center justify-center">
                            <Activity size={18} className="text-white" />
                        </div>
                        <span className="text-sm font-black uppercase tracking-[0.3em]">AudioLink</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8 text-[10px] font-black uppercase tracking-widest text-subtitle/60">
                        <a href="#features" className="hover:text-artist transition-colors">Características</a>
                        <a href="#network" className="hover:text-artist transition-colors">Red de Productores</a>
                        <a href="#security" className="hover:text-artist transition-colors">Seguridad</a>
                    </div>

                    <Link to={ROUTES.LOGIN}>
                        <Button variant="outline" size="sm" className="border-white/10 hover:border-artist text-artist">
                            ACCESO CLIENTES
                        </Button>
                    </Link>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-20 px-6">
                {/* Fondo Decorativo */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[600px] bg-artist/5 blur-[120px] rounded-full -z-10" />

                <div className="max-w-5xl mx-auto text-center">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/5 border border-white/10 mb-8">
                        <span className="relative flex h-2 w-2">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-artist opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-2 w-2 bg-artist"></span>
                        </span>
                        <span className="text-[9px] font-black uppercase tracking-widest text-subtitle/60">V2.0 Lanzamiento Oficial</span>
                    </div>

                    <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter mb-8 leading-[0.9]">
                        CONECTA CON LA <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-artist to-blue-400">ELITE DEL SONIDO</span>
                    </h1>

                    <p className="text-lg md:text-xl text-subtitle/60 max-w-2xl mx-auto mb-12 font-medium leading-relaxed">
                        La plataforma definitiva para artistas y productores. Gestiona tus sesiones,
                        contrata servicios de mezcla y escala tu carrera musical con herramientas de grado industrial.
                    </p>

                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                        <Link to={ROUTES.LOGIN} className="w-full sm:w-auto">
                            <Button variant="artist" size="lg" className="w-full sm:w-80 group">
                                COMENZAR AHORA <ChevronRight className="ml-2 group-hover:translate-x-1 transition-transform" />
                            </Button>
                        </Link>
                        <Button variant="ghost" size="lg" className="group">
                            <Play size={16} className="mr-2 fill-current" /> VER DEMO
                        </Button>
                    </div>
                </div>

                {/* Dashboard Preview (Visual) */}
                <div className="mt-24 max-w-6xl mx-auto relative group">
                    <div className="absolute inset-0 bg-artist/20 blur-[100px] rounded-[3rem] opacity-0 group-hover:opacity-30 transition-opacity duration-1000" />
                    <div className="relative bg-[#0b0b0d] rounded-[2rem] border border-white/10 p-4 shadow-2xl overflow-hidden">
                        <div className="flex items-center gap-2 mb-4 px-4">
                            <div className="w-2 h-2 rounded-full bg-red-500/50" />
                            <div className="w-2 h-2 rounded-full bg-yellow-500/50" />
                            <div className="w-2 h-2 rounded-full bg-green-500/50" />
                        </div>
                        <img
                            src="https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=2070"
                            alt="Interface Preview"
                            className="rounded-xl grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                        />
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section id="features" className="py-32 px-6 max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    {[
                        {
                            icon: <Layers className="text-artist" />,
                            title: "Gestión de Sesiones",
                            desc: "Centraliza tus archivos multitrack, revisiones y feedback en un solo flujo de trabajo DAW-like."
                        },
                        {
                            icon: <ShieldCheck className="text-green-400" />,
                            title: "Contratos Seguros",
                            desc: "Pagos protegidos y transferencia automática de derechos comerciales al finalizar el proyecto."
                        },
                        {
                            icon: <Globe className="text-blue-400" />,
                            title: "Red Global",
                            desc: "Accede a productores certificados de todo el mundo, filtrados por género y equipo técnico."
                        }
                    ].map((feat, i) => (
                        <div key={i} className="p-10 rounded-3xl bg-white/[0.02] border border-white/[0.05] hover:border-white/10 transition-colors">
                            <div className="mb-6">{feat.icon}</div>
                            <h3 className="text-xl font-black uppercase tracking-tight mb-4">{feat.title}</h3>
                            <p className="text-subtitle/40 text-sm leading-relaxed font-bold">{feat.desc}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- CTA FINAL --- */}
            <section className="py-40 px-6 text-center relative overflow-hidden">
                <div className="absolute inset-0 bg-artist/5 -z-10" />
                <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter mb-10">
                    ¿LISTO PARA LLEVAR TU SONIDO <br /> AL SIGUIENTE NIVEL?
                </h2>
                <Link to={ROUTES.LOGIN}>
                    <Button variant="artist" size="xl" className="px-20 shadow-2xl shadow-artist/20">
                        ENTRAR AL SISTEMA <ArrowUpRight size={20} className="ml-2" />
                    </Button>
                </Link>

                <div className="mt-20 flex justify-center items-center gap-10 opacity-20 grayscale">
                    <span className="font-black tracking-[0.5em] text-[10px]">ABLETON</span>
                    <span className="font-black tracking-[0.5em] text-[10px]">WAVES</span>
                    <span className="font-black tracking-[0.5em] text-[10px]">NEVE</span>
                    <span className="font-black tracking-[0.5em] text-[10px]">SSL</span>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="py-10 border-t border-white/5 px-6">
                <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-6">
                    <p className="text-[9px] font-black text-subtitle/20 uppercase tracking-[0.3em]">
                        © 2024 AudioLink Technologies // Todos los derechos reservados
                    </p>
                    <div className="flex gap-6">
                        <a href="#" className="text-[9px] font-black text-subtitle/20 hover:text-artist transition-colors uppercase">Términos</a>
                        <a href="#" className="text-[9px] font-black text-subtitle/20 hover:text-artist transition-colors uppercase">Privacidad</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;