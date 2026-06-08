import React from 'react';
import { Music, Film, Headphones, Info } from 'lucide-react';
import { ProducerData } from '@/services/producerService';

interface ProfileHeroProps {
    producer: ProducerData;
    isOwnProfile?: boolean;
}

const ProfileHero = ({
    producer,
    isOwnProfile = false
}: ProfileHeroProps) => {

    const fallbackImage = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=1000&auto=format&fit=crop";

    const getCleanBio = (): string => {
        if (!producer.bio) {
            return "Este productor aún no ha redactado su manifiesto técnico en la plataforma.";
        }

        let cleanBio = producer.bio;

        if (cleanBio.trim().startsWith('{')) {
            try {
                const parsedBio = JSON.parse(cleanBio);
                if (parsedBio && typeof parsedBio === 'object' && parsedBio.bio) {
                    cleanBio = parsedBio.bio;
                }
            } catch (e) {
                // Error silencioso en producción
            }
        }

        cleanBio = cleanBio.replace(/\\"/g, '"');

        if (cleanBio.startsWith('"') && cleanBio.endsWith('"')) {
            cleanBio = cleanBio.slice(1, -1);
        }

        return cleanBio;
    };

    return (
        <section className="relative w-full">
            <div className="flex flex-col md:flex-row gap-10 items-start">

                <div className="relative shrink-0">
                    <div className={`w-56 h-56 rounded-2xl overflow-hidden border-2 shadow-2xl ${isOwnProfile ? 'border-producer/20 shadow-producer/5' : 'border-artist/20 shadow-artist/5'
                        }`}>
                        <img
                            src={producer.profilePicture || fallbackImage}
                            alt={producer.fullName || "Studio"}
                            className="w-full h-full object-cover"
                        />
                    </div>
                </div>

                <div className="flex-1 space-y-6 pt-2 w-full flex flex-col min-h-[224px] justify-between">
                    <div className="space-y-3">
                        <div className="text-[9px] font-black uppercase text-subtitle/40 tracking-[0.4em]">
                            Estudio de Producción Afiliado
                        </div>
                        <h1 className="text-4xl font-black uppercase tracking-tight text-light">
                            {producer.fullName || "Productor Anónimo"}
                        </h1>

                        <div className="pt-2">
                            <p className="text-sm font-medium text-subtitle/60 max-w-3xl leading-relaxed text-justify whitespace-pre-line">
                                {getCleanBio()}
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    );
};

export default ProfileHero;