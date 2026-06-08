import React, { ChangeEvent } from 'react';
import { Disc, ImageIcon } from 'lucide-react';

interface FeaturedBeat {
    title: string;
    genre: string;
    price: string;
    coverUrl: string | null;
    taggedAudioUrl: string | null;
    untaggedAudioUrl: string | null;
    bpm: number | string;
    keySignature: string;
}

interface FeaturedBeatSectionProps {
    beat: FeaturedBeat;
    isEditing: boolean;
    uploadingCover: boolean;
    uploadingTagged: boolean;
    uploadingUntagged: boolean;
    onFieldChange: (field: string, value: string) => void;
    onCoverUpload: (e: ChangeEvent<HTMLInputElement>) => void;
    onAudioUpload: (e: ChangeEvent<HTMLInputElement>, type: 'tagged' | 'untagged') => void;
}

export const FeaturedBeatSection: React.FC<FeaturedBeatSectionProps> = ({
    beat,
    isEditing,
    onCoverUpload,
    onAudioUpload
}) => {
    return (
        <div className="lg:col-span-7 bg-[#0b0b0d] border border-white/3 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-subtitle/40 border-b border-white/3 pb-4">
                <Disc size={14} className="text-producer" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Beat Destacado</h3>
                {!isEditing && (
                    <span className="text-[8px] bg-producer/20 text-producer px-2 py-0.5 rounded-full ml-auto">
                        SOLO LECTURA
                    </span>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="p-5 bg-black/30 border border-white/5 rounded-xl space-y-4 col-span-2">
                    <div className="flex gap-3 items-center bg-[#060608] p-3 rounded-xl border border-white/3">
                        <div className="w-14 h-14 bg-white/2 rounded-lg border border-white/10 flex items-center justify-center relative group shrink-0 overflow-hidden">
                            {beat.coverUrl ? (
                                <img src={beat.coverUrl} className="w-full h-full object-cover" alt="Cover" />
                            ) : (
                                <ImageIcon size={16} className="text-subtitle/20" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0 space-y-1">
                            <div className="text-xs font-black uppercase text-light truncate">
                                {beat.title || "Sin título"}
                            </div>
                            <div className="flex gap-2">
                                <div className="w-1/3 text-[9px] font-bold text-subtitle/40 uppercase">
                                    {beat.genre || "Género"}
                                </div>
                                <div className="w-1/3 text-[9px] font-mono font-bold text-subtitle/40">
                                    {beat.bpm ? `${beat.bpm} BPM` : "BPM"}
                                </div>
                                <div className="w-1/3 text-[9px] font-mono font-bold text-success text-right">
                                    {parseFloat(beat.price).toFixed(2)}€
                                </div>
                            </div>
                        </div>
                    </div>

                    {beat.taggedAudioUrl && (
                        <div className="mt-3">
                            <audio controls className="w-full h-8">
                                <source src={beat.taggedAudioUrl} type="audio/mpeg" />
                            </audio>
                        </div>
                    )}

                    {!beat.taggedAudioUrl && (
                        <div className="text-center py-2 text-[8px] text-subtitle/40">
                            Sin audio de preview
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};