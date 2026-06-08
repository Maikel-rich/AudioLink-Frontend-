import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Sparkles, Music, Mic, Headphones } from 'lucide-react';
import Button from '@/components/Button';
import AudioLinkLogo from '@/svg/AudioLinkLogo';
import { ROUTES } from "@/constants/routes";
import { authService } from '@/services/authService';

const LoginPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState<'artist' | 'producer'>('artist');
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);

    const logoColor = role === 'artist' ? '#3b82f6' : '#eab308';
    const roleColor = role === 'artist' ? 'text-artist' : 'text-producer';
    const roleBgColor = role === 'artist' ? 'bg-artist/20' : 'bg-producer/20';
    const roleBorderColor = role === 'artist' ? 'focus:border-artist/40' : 'focus:border-producer/40';
    const roleGradient = role === 'artist'
        ? 'from-artist to-artist/60'
        : 'from-producer to-producer/60';

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setIsLoading(true);

        try {
            await authService.login({
                email: formData.email,
                password: formData.password
            });

            const userProfile = await authService.getMe();

            const isUserProducerInDB = userProfile.role === 0;
            const isUserArtistInDB = userProfile.role === 1;

            if (role === 'artist' && !isUserArtistInDB) {
                authService.logout();
                setErrorMsg("Esta cuenta no está registrada como artista. Selecciona productor.");
                setIsLoading(false);
                return;
            }

            if (role === 'producer' && !isUserProducerInDB) {
                authService.logout();
                setErrorMsg("Esta cuenta no está registrada como productor. Selecciona artista.");
                setIsLoading(false);
                return;
            }

            localStorage.setItem('user_role', role);
            navigate(ROUTES.SEARCH || '/search');
        } catch (error: any) {
            authService.logout();

            if (error.response && error.response.status === 401) {
                setErrorMsg("Correo o contraseña incorrectos");
            } else {
                setErrorMsg("Error de conexión. Intenta de nuevo.");
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#060608] flex items-center justify-center p-6 relative overflow-hidden">
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] rounded-full blur-[120px] -z-10 transition-all duration-500"
                style={{ backgroundColor: role === 'artist' ? '#3b82f680' : '#eab30880' }} />
            <div className="absolute bottom-0 right-0 w-[400px] h-[400px] rounded-full blur-[100px] -z-10 transition-all duration-500"
                style={{ backgroundColor: role === 'artist' ? '#3b82f640' : '#eab30840' }} />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">

                <div className="hidden lg:block space-y-8">
                    <div className="flex items-center gap-3">
                        <AudioLinkLogo color={logoColor} size={48} />
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter">AudioLink</h1>
                            <p className="text-[10px] font-black text-subtitle/40 uppercase tracking-wider">Plataforma de producción musical</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">
                            Conecta con los<br />
                            mejores <span className={`text-transparent bg-clip-text bg-gradient-to-r ${roleGradient}`}>profesionales</span>
                        </h2>
                        <p className="text-subtitle/50 leading-relaxed">
                            Accede a tu cuenta y comienza a gestionar tus proyectos musicales,
                            colaborar con productores y llevar tu música al siguiente nivel.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8">
                        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${role === 'artist'
                            ? 'bg-artist/5 border-artist/20 hover:border-artist/40'
                            : 'bg-producer/5 border-producer/20 hover:border-producer/40'
                            }`}>
                            <div className={`w-8 h-8 rounded-lg ${roleBgColor} flex items-center justify-center`}>
                                <Music size={14} className={roleColor} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase">+500</p>
                                <p className="text-[8px] text-subtitle/40">Productores</p>
                            </div>
                        </div>
                        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${role === 'artist'
                            ? 'bg-artist/5 border-artist/20 hover:border-artist/40'
                            : 'bg-producer/5 border-producer/20 hover:border-producer/40'
                            }`}>
                            <div className={`w-8 h-8 rounded-lg ${roleBgColor} flex items-center justify-center`}>
                                <Headphones size={14} className={roleColor} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase">+2K</p>
                                <p className="text-[8px] text-subtitle/40">Proyectos</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 text-[10px] text-subtitle/40">
                        <Sparkles size={12} className={roleColor} />
                        <span>Únete a la comunidad musical más grande</span>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="bg-[#0b0b0d]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

                        <div className="lg:hidden flex justify-center mb-6">
                            <AudioLinkLogo color={logoColor} size={48} />
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Bienvenido</h2>
                            <p className="text-[11px] text-subtitle/50 mt-1">Inicia sesión para continuar</p>
                        </div>

                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <button
                                type="button"
                                onClick={() => { setRole('artist'); setErrorMsg(null); }}
                                className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${role === 'artist'
                                    ? 'bg-artist text-black shadow-lg shadow-artist/20'
                                    : 'bg-white/5 border border-white/10 text-subtitle/60 hover:text-light hover:bg-white/10'
                                    }`}
                            >
                                <Mic size={14} />
                                Soy Artista
                            </button>
                            <button
                                type="button"
                                onClick={() => { setRole('producer'); setErrorMsg(null); }}
                                className={`py-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all flex items-center justify-center gap-2 ${role === 'producer'
                                    ? 'bg-producer text-black shadow-lg shadow-producer/20'
                                    : 'bg-white/5 border border-white/10 text-subtitle/60 hover:text-light hover:bg-white/10'
                                    }`}
                            >
                                <Headphones size={14} />
                                Soy Productor
                            </button>
                        </div>

                        {errorMsg && (
                            <div className="flex gap-2 items-center bg-error/10 border border-error/20 rounded-xl p-3 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                                <p className="text-[10px] font-bold text-error flex-1">{errorMsg}</p>
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-[9px] font-black text-subtitle/40 uppercase tracking-wider block mb-1.5">
                                    Correo electrónico
                                </label>
                                <div className="relative">
                                    <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtitle/40" />
                                    <input
                                        type="email"
                                        required
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        placeholder="tu@email.com"
                                        className={`w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-light outline-none transition-all ${roleBorderColor}`}
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-1.5">
                                    <label className="text-[9px] font-black text-subtitle/40 uppercase tracking-wider">
                                        Contraseña
                                    </label>
                                    <a href="#" className={`text-[8px] font-bold transition-colors ${roleColor} hover:opacity-80`}>
                                        ¿Olvidaste tu contraseña?
                                    </a>
                                </div>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtitle/40" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="••••••••"
                                        className={`w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-11 pr-12 text-sm text-light outline-none transition-all ${roleBorderColor}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-subtitle/40 hover:text-light transition-colors"
                                    >
                                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                variant={role}
                                size="lg"
                                fullWidth
                                isLoading={isLoading}
                                rightIcon={<ArrowRight size={14} />}
                                className="h-12 mt-6 rounded-xl text-[11px]"
                            >
                                Iniciar Sesión
                            </Button>
                        </form>

                        <div className="text-center mt-6 pt-4 border-t border-white/10">
                            <p className="text-[10px] text-subtitle/50">
                                ¿No tienes una cuenta?{" "}
                                <Link
                                    to="/register"
                                    className={`font-black transition-colors hover:opacity-80 ${roleColor}`}
                                >
                                    Regístrate
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
