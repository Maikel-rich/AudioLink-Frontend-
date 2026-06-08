import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ArrowRight, Play, Pause, Headphones, Sparkles, Disc } from 'lucide-react';
import { ROUTES } from "@/constants/routes";
import { beatService, BeatResponse } from '@/services/beatService';
import { useAudio } from '@/context/AudioContext';

interface ProducerCardProps {
    id: number;
    fullName: string | null;
    profilePicture: string | null;
    skills?: string[] | null;
    type?: string;
    price?: number;
}

const ProducerCard = ({
    id,
    fullName,
    profilePicture,
    skills = [],
    type = "PRODUCER",
    price = 0
}: ProducerCardProps) => {
    const navigate = useNavigate();
    const { currentBeat, isPlaying, playBeat, pause } = useAudio();
    const [featuredBeat, setFeaturedBeat] = useState<BeatResponse | null>(null);
    const [isLoadingBeat, setIsLoadingBeat] = useState(false);

    const fallbackImage = "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?q=80&w=500";

    useEffect(() => {
        const loadFeaturedBeat = async () => {
            try {
                const beats = await beatService.getProducerBeats(id);
                const featured = beats.find(beat => beat.isFeatured === true);
                setFeaturedBeat(featured || null);
            } catch (error) {
                // Error silencioso en producción
            }
        };
        loadFeaturedBeat();
    }, [id]);

    const goToProfile = () => {
        const targetRoute = ROUTES.PRODUCER_PROFILE.replace(':id', id.toString());
        navigate(targetRoute);
    };

    const handlePlayFeatured = async (e: React.MouseEvent) => {
        e.stopPropagation();

        if (!featuredBeat?.taggedAudioUrl) return;

        setIsLoadingBeat(true);

        if (currentBeat?.id === featuredBeat.id && isPlaying) {
            pause();
        } else {
            playBeat(featuredBeat);
        }

        setIsLoadingBeat(false);
    };

    const isCurrentBeatPlaying = () => {
        return currentBeat?.id === featuredBeat?.id && isPlaying;
    };

    return (
        <div
            className="group relative flex bg-[#09090b] rounded-xl overflow-hidden h-40 border border-white/[0.03] transition-all duration-500 hover:border-artist/30 hover:bg-[#0e0e12] shadow-[0_8px_30px_rgb(0,0,0,0.6)] cursor-pointer"
            onClick={goToProfile}
        >
            <div
                className="w-40 h-full relative shrink-0 overflow-hidden border-r border-white/[0.02] cursor-pointer"
                onClick={handlePlayFeatured}
            >
                <img
                    src={profilePicture || fallbackImage}
                    alt={fullName || "Producer"}
                    className="w-full h-full object-cover grayscale opacity-35 group-hover:opacity-65 transition-all duration-700 ease-out"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-[#09090b] via-transparent to-transparent opacity-60" />

                {featuredBeat && (
                    <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-sm rounded-full px-2 py-0.5 flex items-center gap-1 z-10">
                        <Sparkles size={8} className="text-artist" />
                        <span className="text-[6px] font-black text-white uppercase tracking-wider">BEAT</span>
                    </div>
                )}

                <div className="absolute inset-0 flex items-center justify-center bg-black/50 backdrop-blur-sm opacity-0 hover:opacity-100 transition-opacity duration-300 z-20">
                    <div className={`w-10 h-10 rounded-full bg-artist text-white flex items-center justify-center shadow-[0_0_20px_rgba(239,68,68,0.5)] transform transition-all duration-300 ${isCurrentBeatPlaying() ? 'scale-100' : 'scale-90 hover:scale-100'}`}>
                        {isLoadingBeat ? (
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        ) : isCurrentBeatPlaying() ? (
                            <Pause size={16} fill="white" />
                        ) : (
                            <Play size={16} fill="white" className="ml-0.5" />
                        )}
                    </div>
                </div>

                {featuredBeat && (
                    <div className="absolute bottom-2 right-2 bg-black/50 rounded-full p-1">
                        <Headphones size={10} className="text-artist" />
                    </div>
                )}
            </div>

            <div className="flex-1 p-5 flex flex-col justify-between min-w-0 relative z-10">
                <div className="flex flex-col justify-center flex-1 min-w-0 pb-2">
                    <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[7.5px] font-black tracking-[0.2em] text-artist bg-artist/10 border border-artist/20 px-2.5 py-0.5 rounded-sm uppercase">
                            {type}
                        </span>

                        {isCurrentBeatPlaying() && (
                            <div className="flex items-end gap-0.5 h-2.5">
                                <div className="w-[1.5px] h-1.5 bg-artist animate-pulse" />
                                <div className="w-[1.5px] h-2.5 bg-artist animate-pulse delay-75" />
                                <div className="w-[1.5px] h-2 bg-artist animate-pulse delay-150" />
                                <div className="w-[1.5px] h-1.5 bg-artist animate-pulse delay-300" />
                            </div>
                        )}
                    </div>

                    <h3 className="text-base font-black text-light tracking-tight uppercase truncate group-hover:text-white transition-colors">
                        {fullName || "FIRMA ANÓNIMA"}
                    </h3>
                </div>

                <div className="flex items-end justify-between border-t border-white/[0.03] pt-3">
                    <div className="flex flex-col">
                        <span className="text-[7.5px] font-black text-subtitle/30 uppercase tracking-[0.15em] mb-0.5">Precio desde:</span>
                        <span className="text-base font-black text-white tracking-tighter tabular-nums">
                            {price > 0 ? `${price.toLocaleString()}€` : 'ON DEMAND'}
                        </span>
                    </div>

                    {featuredBeat && (
                        <div className="text-right">
                            <span className="text-[6px] font-black text-subtitle/30 uppercase tracking-wider">
                                Beat destacado
                            </span>
                            <p className="text-[8px] font-medium text-subtitle/50 truncate max-w-[100px]">
                                {featuredBeat.title}
                            </p>
                        </div>
                    )}
                </div>
            </div>

            <button
                onClick={(e) => {
                    e.stopPropagation();
                    goToProfile();
                }}
                className="w-14 flex flex-col items-center justify-center bg-white/[0.01] hover:bg-artist border-l border-white/[0.03] transition-all duration-300 group/profile relative"
            >
                <ArrowRight
                    size={16}
                    className="text-subtitle/30 group-hover/profile:text-white group-hover:translate-x-0.5 transition-all duration-300 mb-4"
                />

                <span className="absolute bottom-5 text-[6.5px] font-black tracking-widest uppercase text-subtitle/20 group-hover/profile:text-white/80 origin-center select-none">
                    OPEN
                </span>
            </button>

            <div className="absolute bottom-0 left-0 h-[1.5px] bg-gradient-to-r from-artist via-artist/50 to-transparent w-0 group-hover:w-full transition-all duration-500 ease-out" />
        </div>
    );
};

export default ProducerCard;