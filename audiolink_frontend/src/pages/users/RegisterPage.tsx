import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Eye, EyeOff, Mail, Lock, User, Mic, Headphones, Sparkles, Music, ArrowRight } from 'lucide-react';
import Button from '@/components/Button';
import AudioLinkLogo from '@/svg/AudioLinkLogo';
import { ROUTES } from "@/constants/routes";
import { authService } from '@/services/authService';

const RegisterPage = () => {
    const navigate = useNavigate();
    const [role, setRole] = useState<'artist' | 'producer'>('artist');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [errorMsg, setErrorMsg] = useState<string | null>(null);
    const [successMsg, setSuccessMsg] = useState<string | null>(null);

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        confirmPassword: '',
        fullName: ''
    });

    const logoColor = role === 'artist' ? '#3b82f6' : '#eab308';
    const roleColor = role === 'artist' ? 'text-artist' : 'text-producer';
    const roleBgColor = role === 'artist' ? 'bg-artist/20' : 'bg-producer/20';
    const roleBorderColor = role === 'artist' ? 'focus:border-artist/40' : 'focus:border-producer/40';
    const roleGradient = role === 'artist'
        ? 'from-artist to-artist/60'
        : 'from-producer to-producer/60';

    const isValidEmail = (email: string) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPassword = (password: string) => {
        return password.length >= 6;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMsg(null);
        setSuccessMsg(null);

        if (!formData.email || !formData.password || !formData.confirmPassword) {
            setErrorMsg('Todos los campos son obligatorios');
            return;
        }

        if (!isValidEmail(formData.email)) {
            setErrorMsg('Introduce un correo electrónico válido');
            return;
        }

        if (!isValidPassword(formData.password)) {
            setErrorMsg('La contraseña debe tener al menos 6 caracteres');
            return;
        }

        if (formData.password !== formData.confirmPassword) {
            setErrorMsg('Las contraseñas no coinciden');
            return;
        }

        setIsLoading(true);

        try {
            const roleValue = role === 'producer' ? 0 : 1;

            const payload: any = {
                email: formData.email,
                password: formData.password,
                role: roleValue
            };

            if (formData.fullName && formData.fullName.trim() !== '') {
                payload.fullName = formData.fullName.trim();
            }

            await authService.register(payload);

            setSuccessMsg('¡Cuenta creada con éxito! Redirigiendo al login...');

            setFormData({ email: '', password: '', confirmPassword: '', fullName: '' });

            setTimeout(() => {
                navigate('/login');
            }, 2000);

        } catch (error: any) {
            const errorMessage = error.response?.data?.error || 'Error al crear la cuenta. Intenta de nuevo.';
            setErrorMsg(errorMessage);
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

            <div className="w-full max-w-5xl grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

                <div className="hidden lg:block space-y-8 sticky top-8">
                    <div className="flex items-center gap-3">
                        <AudioLinkLogo color={logoColor} size={48} />
                        <div>
                            <h1 className="text-2xl font-black uppercase tracking-tighter">AudioLink</h1>
                            <p className="text-[10px] font-black text-subtitle/40 uppercase tracking-wider">Plataforma de producción musical</p>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-4xl font-black uppercase tracking-tighter leading-tight">
                            Únete a la<br />
                            <span className={`text-transparent bg-clip-text bg-gradient-to-r ${roleGradient}`}>comunidad musical</span>
                        </h2>
                        <p className="text-subtitle/50 leading-relaxed">
                            Crea tu cuenta y comienza a conectar con productores y artistas
                            de todo el mundo. Gestiona tus proyectos, comparte tu música y
                            lleva tu carrera al siguiente nivel.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-8">
                        <div className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${role === 'artist'
                            ? 'bg-artist/5 border-artist/20'
                            : 'bg-producer/5 border-producer/20'
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
                            ? 'bg-artist/5 border-artist/20'
                            : 'bg-producer/5 border-producer/20'
                            }`}>
                            <div className={`w-8 h-8 rounded-lg ${roleBgColor} flex items-center justify-center`}>
                                <Mic size={14} className={roleColor} />
                            </div>
                            <div>
                                <p className="text-[10px] font-black uppercase">+2K</p>
                                <p className="text-[8px] text-subtitle/40">Artistas</p>
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-2 text-[10px] text-subtitle/40">
                        <Sparkles size={12} className={roleColor} />
                        <span>Registro gratuito · Sin compromiso</span>
                    </div>
                </div>

                <div className="w-full max-w-md mx-auto lg:mx-0">
                    <div className="bg-[#0b0b0d]/80 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl">

                        <div className="lg:hidden flex justify-center mb-6">
                            <AudioLinkLogo color={logoColor} size={48} />
                        </div>

                        <div className="text-center mb-8">
                            <h2 className="text-2xl font-black uppercase tracking-tighter">Crear cuenta</h2>
                            <p className="text-[11px] text-subtitle/50 mt-1">Regístrate para comenzar</p>
                        </div>

                        {successMsg && (
                            <div className="flex gap-2 items-center bg-success/10 border border-success/20 rounded-xl p-3 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                <p className="text-[10px] font-bold text-success flex-1">{successMsg}</p>
                            </div>
                        )}

                        {errorMsg && (
                            <div className="flex gap-2 items-center bg-error/10 border border-error/20 rounded-xl p-3 mb-6">
                                <div className="w-1.5 h-1.5 rounded-full bg-error animate-pulse" />
                                <p className="text-[10px] font-bold text-error flex-1">{errorMsg}</p>
                            </div>
                        )}

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

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="text-[9px] font-black text-subtitle/40 uppercase tracking-wider block mb-1.5">
                                    Correo electrónico *
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
                                <label className="text-[9px] font-black text-subtitle/40 uppercase tracking-wider block mb-1.5">
                                    Nombre completo (opcional)
                                </label>
                                <div className="relative">
                                    <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtitle/40" />
                                    <input
                                        type="text"
                                        value={formData.fullName}
                                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                                        placeholder="Tu nombre artístico o real"
                                        className="w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-11 pr-4 text-sm text-light outline-none transition-all focus:border-white/20"
                                    />
                                </div>
                            </div>

                            <div>
                                <label className="text-[9px] font-black text-subtitle/40 uppercase tracking-wider block mb-1.5">
                                    Contraseña *
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtitle/40" />
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        required
                                        value={formData.password}
                                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                        placeholder="Mínimo 6 caracteres"
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

                            <div>
                                <label className="text-[9px] font-black text-subtitle/40 uppercase tracking-wider block mb-1.5">
                                    Confirmar contraseña *
                                </label>
                                <div className="relative">
                                    <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-subtitle/40" />
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        required
                                        value={formData.confirmPassword}
                                        onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                        placeholder="Repite tu contraseña"
                                        className={`w-full h-12 bg-black/40 border border-white/10 rounded-xl pl-11 pr-12 text-sm text-light outline-none transition-all ${roleBorderColor}`}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                        className="absolute right-4 top-1/2 -translate-y-1/2 text-subtitle/40 hover:text-light transition-colors"
                                    >
                                        {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                    </button>
                                </div>
                            </div>

                            <div className="flex items-start gap-2 pt-2">
                                <input
                                    type="checkbox"
                                    id="terms"
                                    required
                                    className="mt-0.5 w-3.5 h-3.5 rounded border-white/20 bg-black/40 checked:bg-artist checked:border-artist"
                                />
                                <label htmlFor="terms" className="text-[8px] text-subtitle/50 leading-relaxed">
                                    Acepto los{' '}
                                    <a href="#" className={`${roleColor} hover:underline`}>Términos y Condiciones</a>
                                    {' '}y la{' '}
                                    <a href="#" className={`${roleColor} hover:underline`}>Política de Privacidad</a>
                                </label>
                            </div>

                            <Button
                                type="submit"
                                variant={role}
                                size="lg"
                                fullWidth
                                isLoading={isLoading}
                                rightIcon={<ArrowRight size={14} />}
                                className="h-12 mt-4 rounded-xl text-[11px]"
                            >
                                Crear cuenta
                            </Button>
                        </form>

                        <div className="text-center mt-6 pt-4 border-t border-white/10">
                            <p className="text-[10px] text-subtitle/50">
                                ¿Ya tienes una cuenta?{' '}
                                <Link
                                    to="/login"
                                    className={`font-black transition-colors hover:opacity-80 ${roleColor}`}
                                >
                                    Inicia sesión
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RegisterPage;
