import React, { ChangeEvent, useState } from 'react';
import { User, UploadCloud, Loader2 } from 'lucide-react';

interface IdentitySectionProps {
    fullName: string;
    bio: string;
    avatarUrl: string | null;
    isEditing: boolean;
    uploadingAvatar: boolean;
    onFullNameChange: (value: string) => void;
    onBioChange: (value: string) => void;
    onAvatarUpload: (e: ChangeEvent<HTMLInputElement>) => void;
}

const cleanBioString = (bio: string): string => {
    if (!bio) return '';

    let cleanBio = bio;

    if (cleanBio.trim().startsWith('{')) {
        try {
            const parsed = JSON.parse(cleanBio);
            if (parsed && typeof parsed === 'object' && parsed.bio) {
                cleanBio = parsed.bio;
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

export const IdentitySection: React.FC<IdentitySectionProps> = ({
    fullName,
    bio,
    avatarUrl,
    isEditing,
    uploadingAvatar,
    onFullNameChange,
    onBioChange,
    onAvatarUpload,
}) => {
    const displayBio = cleanBioString(bio);

    return (
        <div className="lg:col-span-5 bg-[#0b0b0d] border border-white/3 rounded-2xl p-6 space-y-6">
            <div className="flex items-center gap-2 text-subtitle/40 border-b border-white/3 pb-4">
                <User size={14} className="text-producer" />
                <h3 className="text-[10px] font-black uppercase tracking-widest">Identidad de Ingeniero</h3>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6 bg-black/20 p-4 rounded-xl border border-white/3">
                <div className="w-24 h-24 rounded-xl border border-white/10 overflow-hidden bg-white/2 relative shrink-0 flex items-center justify-center group">
                    {uploadingAvatar ? (
                        <Loader2 className="animate-spin text-producer" size={20} />
                    ) : avatarUrl ? (
                        <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                    ) : (
                        <UploadCloud size={24} className="text-subtitle/20" />
                    )}
                    {isEditing && !uploadingAvatar && (
                        <label className="absolute inset-0 bg-black/80 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-2 text-center">
                            <UploadCloud size={14} className="text-producer" />
                            <span className="text-[8px] font-black text-white uppercase tracking-tighter">Subir Foto</span>
                            <input type="file" accept="image/*" onChange={onAvatarUpload} className="hidden" />
                        </label>
                    )}
                </div>

                <div className="space-y-1.5 w-full">
                    <label className="text-[8px] font-black uppercase text-subtitle/30 tracking-widest block">Nombre Artístico</label>
                    <input
                        type="text"
                        disabled={!isEditing}
                        value={fullName}
                        onChange={(e) => onFullNameChange(e.target.value)}
                        className="w-full bg-black/40 border border-white/5 rounded-lg px-3 py-2 text-xs font-bold text-light focus:outline-none focus:border-producer/40 disabled:opacity-60 transition-colors uppercase"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <label className="text-[8px] font-black uppercase text-subtitle/30 tracking-widest block">Manifiesto Técnico & Bio</label>
                <textarea
                    disabled={!isEditing}
                    rows={4}
                    value={displayBio}
                    onChange={(e) => onBioChange(e.target.value)}
                    className="w-full bg-black/40 border border-white/5 rounded-xl px-4 py-3 text-xs font-medium text-light/90 focus:outline-none focus:border-producer/40 disabled:opacity-60 resize-none transition-colors leading-relaxed"
                    placeholder="Detalla tu biografía... (usa Enter para saltos de línea)"
                />
                {isEditing && (
                    <p className="text-[7px] text-subtitle/40 mt-1">
                        Puedes usar Enter para crear saltos de línea
                    </p>
                )}
            </div>
        </div>
    );
};