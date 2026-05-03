import { Music, Film, Headphones, Info } from 'lucide-react';

const ProfileHero = () => {
    const profileImg = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop";

    return (
        <section className="relative w-full">
            <div className="flex flex-col md:flex-row gap-10 items-start">

                {/* Contenedor de Imagen de Perfil */}
                <div className="relative shrink-0">
                    <div className="w-56 h-56 rounded-2xl overflow-hidden border-2 border-artist/20 shadow-2xl shadow-artist/5">
                        <img
                            src={profileImg}
                            alt="Alex Rivers Profile"
                            className="w-full h-full object-cover grayscale-20 hover:grayscale-0 transition-all duration-500 scale-105 hover:scale-100"
                        />
                    </div>
                    {/* Botón de información estilo mockup */}
                    <button className="absolute -bottom-3 -right-3 w-10 h-10 bg-artist text-white rounded-full flex items-center justify-center border-4 border-dark hover:scale-110 transition-transform shadow-xl">
                        <Info size={18} strokeWidth={3} />
                    </button>
                </div>

                {/* Información de texto */}
                <div className="flex-1 pt-2">
                    <div className="flex items-center gap-4 mb-4">
                        <h1 className="text-5xl font-black text-light tracking-tighter">
                            Alex Rivers
                        </h1>
                        <div className="flex items-center justify-center px-3 py-1.5 bg-artist/10 border border-artist/30 rounded-full min-h-6">
                            <span className="text-[10px] font-black text-artist uppercase tracking-[0.2em] leading-none">
                                Productor Platino
                            </span>
                        </div>
                    </div>

                    <p className="text-subtitle text-base leading-relaxed max-w-2xl font-medium italic opacity-90">
                        "Transformando ideas en experiencias sonoras. Más de 8 años diseñando beats para la nueva era del Hip-Hop y el cine experimental."
                    </p>

                    {/* Tags de especialidad */}
                    <div className="flex flex-wrap gap-3 mt-8">
                        <ProfileTag icon={Music} label="Hip-Hop" />
                        <ProfileTag icon={Film} label="Cinematográfico" />
                        <ProfileTag icon={Headphones} label="Electrónico" />
                    </div>
                </div>
            </div>
        </section>
    );
};

// Sub-componente etiquetas del perfil
const ProfileTag = ({ icon: Icon, label }: { icon: any, label: string }) => (
    <div className="flex items-center gap-2.5 px-5 py-2.5 bg-gray-dark border border-gray-light/10 rounded-xl hover:border-artist/40 transition-all group cursor-pointer">
        <Icon size={16} className="text-artist group-hover:scale-110 transition-transform" />
        <span className="text-xs font-bold text-subtitle uppercase tracking-widest group-hover:text-light transition-colors">
            {label}
        </span>
    </div>
);

export default ProfileHero;