import React, { useState } from 'react';
import { Music, Loader2, Plus, Star } from 'lucide-react';
import { BeatResponse } from '@/services/beatService';
import { AudioPlayerComponent } from '@/components/AudioPlayerComponent';

interface BeatsCatalogSectionProps {
    beats: BeatResponse[];
    loading: boolean;
    showAll: boolean;
    onToggleShow: () => void;
    onMarkAsSold: (beatId: number) => void;
    onDeleteBeat: (beatId: number) => void;
    onSetFeatured: (beatId: number) => void;
    onAddBeat: () => void;
    currentFeaturedId?: number;
}

export const BeatsCatalogSection: React.FC<BeatsCatalogSectionProps> = ({
    beats,
    loading,
    showAll,
    onToggleShow,
    onMarkAsSold,
    onDeleteBeat,
    onSetFeatured,
    onAddBeat,
    currentFeaturedId
}) => {
    const [playingBeatId, setPlayingBeatId] = useState<number | null>(null);

    const handlePlay = (beatId: number) => {
        if (playingBeatId !== null && playingBeatId !== beatId) {
            setPlayingBeatId(null);
        }
        setPlayingBeatId(beatId);
    };

    const handlePause = (beatId: number) => {
        if (playingBeatId === beatId) {
            setPlayingBeatId(null);
        }
    };

    return (
        <div className="bg-[#0b0b0d] border border-white/3 rounded-2xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/3 pb-4">
                <div className="flex items-center gap-2 text-subtitle/40">
                    <Music size={14} className="text-producer" />
                    <h3 className="text-[10px] font-black uppercase tracking-widest">
                        Mi Catálogo de Beats ({beats.length})
                    </h3>
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={onAddBeat}
                        className="flex items-center gap-1 px-3 py-1.5 bg-producer/10 border border-producer/20 rounded-lg text-[8px] font-black uppercase tracking-widest text-producer hover:bg-producer/20 transition-colors"
                    >
                        <Plus size={10} /> AÑADIR BEAT
                    </button>
                    <button
                        onClick={onToggleShow}
                        className="text-[8px] font-black uppercase tracking-widest text-subtitle/40 hover:text-producer transition-colors"
                    >
                        {showAll ? 'OCULTAR' : 'VER TODOS'}
                    </button>
                </div>
            </div>

            {showAll && (
                <div className="space-y-3">
                    {loading ? (
                        <div className="flex justify-center py-8">
                            <Loader2 className="animate-spin text-producer" size={24} />
                        </div>
                    ) : beats.length === 0 ? (
                        <div className="text-center py-12 border border-dashed border-white/5 rounded-xl bg-black/10">
                            <Music size={32} className="mx-auto text-subtitle/20 mb-3" />
                            <p className="text-[9px] font-black text-subtitle/20 uppercase tracking-widest">
                                No tienes beats en tu catálogo
                            </p>
                            <button
                                onClick={onAddBeat}
                                className="mt-4 px-4 py-2 bg-producer/20 border border-producer/30 rounded-lg text-[8px] font-black uppercase text-producer hover:bg-producer/30 transition-colors"
                            >
                                + AÑADIR MI PRIMER BEAT
                            </button>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3">
                            {beats.map((beat) => {
                                const isFeatured = beat.isFeatured === true;
                                const isSold = beat.isSold === true;

                                return (
                                    <div
                                        key={beat.id}
                                        className={`bg-black/30 border rounded-xl p-4 transition-all ${isFeatured
                                            ? 'border-producer/50 bg-producer/5'
                                            : 'border-white/5 hover:border-white/10'
                                            }`}
                                    >
                                        <div className="flex flex-col md:flex-row gap-4">
                                            <div className="w-full md:w-20 h-20 bg-gradient-to-br from-producer/20 to-transparent rounded-lg flex items-center justify-center overflow-hidden flex-shrink-0">
                                                {beat.cloudinaryUrl ? (
                                                    <img
                                                        src={beat.cloudinaryUrl}
                                                        alt={beat.title}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <Music size={28} className="text-subtitle/30" />
                                                )}
                                            </div>

                                            <div className="flex-1 min-w-0">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-2">
                                                    <div>
                                                        <div className="flex items-center gap-2 flex-wrap">
                                                            <h4 className="text-sm font-black uppercase">{beat.title}</h4>
                                                            {isFeatured && (
                                                                <span className="text-[8px] bg-producer/20 text-producer px-2 py-0.5 rounded-full flex items-center gap-1">
                                                                    <Star size={8} /> DESTACADO
                                                                </span>
                                                            )}
                                                            {isSold && !isFeatured && (
                                                                <span className="text-[8px] bg-error/20 text-error px-2 py-0.5 rounded-full">
                                                                    VENDIDO
                                                                </span>
                                                            )}
                                                        </div>
                                                        <div className="flex flex-wrap gap-2 mt-1">
                                                            <span className="text-[9px] font-mono text-subtitle/40 bg-white/5 px-2 py-0.5 rounded">
                                                                {beat.genre || 'Sin género'}
                                                            </span>
                                                            {beat.bpm && (
                                                                <span className="text-[9px] font-mono text-subtitle/40 bg-white/5 px-2 py-0.5 rounded">
                                                                    {beat.bpm} BPM
                                                                </span>
                                                            )}
                                                            {beat.keySignature && (
                                                                <span className="text-[9px] font-mono text-subtitle/40 bg-white/5 px-2 py-0.5 rounded">
                                                                    {beat.keySignature}
                                                                </span>
                                                            )}
                                                        </div>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className={`text-xl font-black ${isSold && !isFeatured ? 'text-error' : 'text-success'}`}>
                                                            {parseFloat(beat.price).toFixed(2)}€
                                                        </span>
                                                    </div>
                                                </div>

                                                {beat.taggedAudioUrl && (
                                                    <div className="mt-3">
                                                        <AudioPlayerComponent
                                                            audioUrl={beat.taggedAudioUrl}
                                                            beatId={beat.id}
                                                            isPlaying={playingBeatId === beat.id}
                                                            onPlay={handlePlay}
                                                            onPause={handlePause}
                                                        />
                                                    </div>
                                                )}

                                                {!isFeatured && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {!isSold && (
                                                            <button
                                                                onClick={() => onSetFeatured(beat.id)}
                                                                className="px-3 py-1.5 bg-white/5 hover:bg-producer/20 rounded-lg text-[8px] font-black uppercase tracking-wider text-subtitle/60 hover:text-producer transition-all flex items-center gap-1"
                                                            >
                                                                <Star size={10} /> Destacar
                                                            </button>
                                                        )}
                                                        {!isSold && (
                                                            <button
                                                                onClick={() => onMarkAsSold(beat.id)}
                                                                className="px-3 py-1.5 bg-white/5 hover:bg-error/20 rounded-lg text-[8px] font-black uppercase tracking-wider text-subtitle/60 hover:text-error transition-all"
                                                            >
                                                                Vender
                                                            </button>
                                                        )}
                                                        <button
                                                            onClick={() => onDeleteBeat(beat.id)}
                                                            className="px-3 py-1.5 bg-white/5 hover:bg-error/20 rounded-lg text-[8px] font-black uppercase tracking-wider text-subtitle/60 hover:text-error transition-all"
                                                        >
                                                            Eliminar
                                                        </button>
                                                    </div>
                                                )}

                                                {isFeatured && (
                                                    <div className="mt-3 pt-2 border-t border-white/5">
                                                        <p className="text-[8px] text-producer/60 uppercase tracking-widest flex items-center gap-2">
                                                            <Star size={10} /> Este es tu beat destacado actualmente
                                                        </p>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};