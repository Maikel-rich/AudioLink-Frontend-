import React, { useState, useEffect } from 'react';
import { beatService, BeatResponse } from '@/services/beatService';
import { Loader2, Play, ShoppingBag, Disc, Music, Star, Pause } from 'lucide-react';
import { useAudio } from '@/context/AudioContext';
import { BeatPurchaseModal } from '@/components/BeatPurchaseModal';

interface BeatsCatalogProps {
    producerId: number;
    isOwnProfile: boolean;
}

export const BeatsCatalog: React.FC<BeatsCatalogProps> = ({ producerId, isOwnProfile }) => {
    const [beats, setBeats] = useState<BeatResponse[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [featuredBeat, setFeaturedBeat] = useState<BeatResponse | null>(null);
    const [selectedBeatForPurchase, setSelectedBeatForPurchase] = useState<BeatResponse | null>(null);
    const [showPurchaseModal, setShowPurchaseModal] = useState(false);
    const [purchaseSuccessMessage, setPurchaseSuccessMessage] = useState<string | null>(null);
    const { currentBeat, isPlaying, playBeat } = useAudio();

    useEffect(() => {
        loadBeats();
    }, [producerId]);

    const loadBeats = async () => {
        try {
            setIsLoading(true);
            const data = await beatService.getProducerBeats(producerId);

            const availableBeats = data.filter(beat => !beat.isSold);
            const featured = availableBeats.find(beat => beat.isFeatured === true);
            const nonFeatured = availableBeats.filter(beat => !beat.isFeatured);

            setFeaturedBeat(featured || null);
            setBeats(nonFeatured);
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsLoading(false);
        }
    };

    const handlePlayPause = (beat: BeatResponse) => {
        playBeat(beat);
    };

    const isBeatPlaying = (beatId: number) => {
        return currentBeat?.id === beatId && isPlaying;
    };

    const handlePurchaseClick = (beat: BeatResponse) => {
        setSelectedBeatForPurchase(beat);
        setShowPurchaseModal(true);
    };

    const handlePurchaseSuccess = () => {
        setShowPurchaseModal(false);
        setPurchaseSuccessMessage('¡Beat adquirido correctamente! Revisa tu biblioteca.');

        setTimeout(() => setPurchaseSuccessMessage(null), 3000);

        loadBeats();
        setSelectedBeatForPurchase(null);
    };

    const handleModalClose = () => {
        setShowPurchaseModal(false);
        setSelectedBeatForPurchase(null);
    };

    if (isLoading) {
        return (
            <div className="flex justify-center py-12">
                <Loader2 className="animate-spin text-artist" size={24} />
            </div>
        );
    }

    if (!featuredBeat && beats.length === 0) {
        return (
            <div className="text-center py-12 border border-dashed border-white/5 rounded-xl bg-black/10">
                <Music size={32} className="mx-auto text-subtitle/20 mb-3" />
                <p className="text-[9px] font-black text-subtitle/20 uppercase tracking-widest">
                    {isOwnProfile ? 'Aún no has subido beats' : 'Este productor aún no tiene beats disponibles'}
                </p>
            </div>
        );
    }

    return (
        <>
            {purchaseSuccessMessage && (
                <div className="fixed bottom-24 right-4 z-50 bg-success text-black px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest animate-in slide-in-from-right">
                    {purchaseSuccessMessage}
                </div>
            )}

            <div className="space-y-6">
                {featuredBeat && (
                    <div className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <Star size={14} className="text-artist" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-artist">Beat Destacado</h3>
                            <div className="h-px flex-1 bg-gradient-to-r from-artist/20 to-transparent" />
                        </div>
                        <div className="bg-gradient-to-br from-artist/10 to-transparent border border-artist/30 rounded-xl overflow-hidden">
                            <div className="flex gap-4 p-5">
                                <div className="w-24 h-24 rounded-xl overflow-hidden bg-black/50 flex-shrink-0 relative">
                                    {featuredBeat.cloudinaryUrl ? (
                                        <img
                                            src={featuredBeat.cloudinaryUrl}
                                            alt={featuredBeat.title}
                                            className="w-full h-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-artist/20 to-transparent">
                                            <Disc size={28} className="text-subtitle/30" />
                                        </div>
                                    )}
                                    {featuredBeat.taggedAudioUrl && (
                                        <button
                                            onClick={() => handlePlayPause(featuredBeat)}
                                            className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity"
                                        >
                                            {isBeatPlaying(featuredBeat.id) ? (
                                                <Pause size={20} className="text-white" />
                                            ) : (
                                                <Play size={20} className="text-white" />
                                            )}
                                        </button>
                                    )}
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                        <h4 className="text-lg font-black uppercase">{featuredBeat.title}</h4>
                                        <span className="text-[8px] bg-artist/20 text-artist px-2 py-0.5 rounded-full flex items-center gap-1">
                                            <Star size={8} /> DESTACADO
                                        </span>
                                    </div>
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <span className="text-[9px] font-mono text-subtitle/60 bg-white/5 px-2 py-0.5 rounded">
                                            {featuredBeat.genre || 'Sin género'}
                                        </span>
                                        {featuredBeat.bpm && (
                                            <span className="text-[9px] font-mono text-subtitle/60 bg-white/5 px-2 py-0.5 rounded">
                                                {featuredBeat.bpm} BPM
                                            </span>
                                        )}
                                        {featuredBeat.keySignature && (
                                            <span className="text-[9px] font-mono text-subtitle/60 bg-white/5 px-2 py-0.5 rounded">
                                                {featuredBeat.keySignature}
                                            </span>
                                        )}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-2xl font-black text-success">
                                            {parseFloat(featuredBeat.price).toFixed(2)}€
                                        </span>
                                        <button
                                            onClick={() => handlePurchaseClick(featuredBeat)}
                                            className="px-4 py-2 bg-artist text-black rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-artist/90 transition-all flex items-center gap-2"
                                        >
                                            <ShoppingBag size={12} />
                                            Adquirir Licencia
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {beats.length > 0 && (
                    <>
                        <div className="flex items-center gap-2 mb-4">
                            <Music size={14} className="text-subtitle/40" />
                            <h3 className="text-[10px] font-black uppercase tracking-widest text-subtitle/40">Catálogo Completo</h3>
                            <div className="h-px flex-1 bg-white/5" />
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            {beats.map((beat) => (
                                <div
                                    key={beat.id}
                                    className="bg-black/30 border border-white/5 rounded-xl overflow-hidden hover:border-artist/30 transition-all group"
                                >
                                    <div className="flex gap-3 p-4">
                                        <div className="w-20 h-20 rounded-lg overflow-hidden bg-black/50 flex-shrink-0 relative">
                                            {beat.cloudinaryUrl ? (
                                                <img
                                                    src={beat.cloudinaryUrl}
                                                    alt={beat.title}
                                                    className="w-full h-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-artist/10 to-transparent">
                                                    <Disc size={24} className="text-subtitle/20" />
                                                </div>
                                            )}
                                            {beat.taggedAudioUrl && (
                                                <button
                                                    onClick={() => handlePlayPause(beat)}
                                                    className="absolute inset-0 bg-black/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    {isBeatPlaying(beat.id) ? (
                                                        <Pause size={20} className="text-white" />
                                                    ) : (
                                                        <Play size={20} className="text-white" />
                                                    )}
                                                </button>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0">
                                            <h4 className="text-sm font-black uppercase truncate">{beat.title}</h4>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                <span className="text-[8px] font-black bg-white/5 px-2 py-0.5 rounded">
                                                    {beat.genre || 'Sin género'}
                                                </span>
                                                {beat.bpm && (
                                                    <span className="text-[8px] font-black bg-white/5 px-2 py-0.5 rounded">
                                                        {beat.bpm} BPM
                                                    </span>
                                                )}
                                                {beat.keySignature && (
                                                    <span className="text-[8px] font-black bg-white/5 px-2 py-0.5 rounded">
                                                        {beat.keySignature}
                                                    </span>
                                                )}
                                            </div>
                                            <div className="flex items-center justify-between mt-3">
                                                <span className="text-lg font-black text-success">
                                                    {parseFloat(beat.price).toFixed(2)}€
                                                </span>
                                                <button
                                                    onClick={() => handlePurchaseClick(beat)}
                                                    className="px-3 py-1.5 bg-artist/10 border border-artist/20 rounded-lg text-[8px] font-black uppercase tracking-widest text-artist hover:bg-artist/20 transition-all flex items-center gap-1"
                                                >
                                                    <ShoppingBag size={10} />
                                                    Adquirir Licencia
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>

            <BeatPurchaseModal
                isOpen={showPurchaseModal}
                onClose={handleModalClose}
                beat={{
                    id: selectedBeatForPurchase?.id || 0,
                    title: selectedBeatForPurchase?.title || '',
                    price: selectedBeatForPurchase?.price || '0',
                    producerName: selectedBeatForPurchase?.producer?.fullName || 'Productor'
                }}
                onSuccess={handlePurchaseSuccess}
            />
        </>
    );
};