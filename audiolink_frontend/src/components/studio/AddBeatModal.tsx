import React, { useState, ChangeEvent } from 'react';
import { X, UploadCloud, Loader2, Disc, FileAudio } from 'lucide-react';
import { cloudinaryService } from '@/services/cloudinaryService';

interface AddBeatModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSave: (beatData: any) => Promise<void>;
}

export const AddBeatModal: React.FC<AddBeatModalProps> = ({ isOpen, onClose, onSave }) => {
    const [title, setTitle] = useState('');
    const [genre, setGenre] = useState('Trap');
    const [price, setPrice] = useState('');
    const [coverUrl, setCoverUrl] = useState<string | null>(null);
    const [taggedAudioUrl, setTaggedAudioUrl] = useState<string | null>(null);
    const [untaggedAudioUrl, setUntaggedAudioUrl] = useState<string | null>(null);
    const [bpm, setBpm] = useState('');
    const [keySignature, setKeySignature] = useState('');

    const [uploadingCover, setUploadingCover] = useState(false);
    const [uploadingTagged, setUploadingTagged] = useState(false);
    const [uploadingUntagged, setUploadingUntagged] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    const handleCoverUpload = async (e: ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        try {
            setUploadingCover(true);
            const url = await cloudinaryService.uploadFileSecure(file);
            setCoverUrl(url);
        } catch {
            // Error silencioso en producción
        } finally {
            setUploadingCover(false);
        }
    };

    const handleAudioUpload = async (e: ChangeEvent<HTMLInputElement>, type: 'tagged' | 'untagged') => {
        const file = e.target.files?.[0];
        if (!file) return;
        const ext = file.name.split('.').pop()?.toLowerCase();
        if ((type === 'tagged' && ext !== 'mp3') || (type === 'untagged' && ext !== 'wav')) {
            return;
        }
        try {
            type === 'tagged' ? setUploadingTagged(true) : setUploadingUntagged(true);
            const url = await cloudinaryService.uploadFileSecure(file);
            type === 'tagged' ? setTaggedAudioUrl(url) : setUntaggedAudioUrl(url);
        } catch {
            // Error silencioso en producción
        } finally {
            type === 'tagged' ? setUploadingTagged(false) : setUploadingUntagged(false);
        }
    };

    const handleSubmit = async () => {
        if (!title.trim()) return;
        if (!price || parseFloat(price) <= 0) return;

        setIsSaving(true);
        try {
            await onSave({
                title: title.trim(),
                genre,
                price: parseFloat(price),
                coverUrl: coverUrl || '',
                taggedAudioUrl,
                untaggedAudioUrl,
                bpm: bpm ? parseInt(bpm) : undefined,
                keySignature: keySignature || undefined
            });
            onClose();
            resetForm();
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsSaving(false);
        }
    };

    const resetForm = () => {
        setTitle('');
        setGenre('Trap');
        setPrice('');
        setCoverUrl(null);
        setTaggedAudioUrl(null);
        setUntaggedAudioUrl(null);
        setBpm('');
        setKeySignature('');
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4">
            <div className="bg-[#0b0b0d] border border-white/10 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center p-6 border-b border-white/10">
                    <h2 className="text-lg font-black uppercase tracking-tighter">Añadir Nuevo Beat</h2>
                    <button onClick={onClose} className="text-subtitle/40 hover:text-light">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-6 space-y-6">
                    <div>
                        <label className="text-[8px] font-black uppercase text-subtitle/30 block mb-1">Título *</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-sm text-light focus:outline-none focus:border-producer/40"
                            placeholder="Nombre del beat"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[8px] font-black uppercase text-subtitle/30 block mb-1">Género</label>
                            <input
                                type="text"
                                value={genre}
                                onChange={(e) => setGenre(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-sm text-light focus:outline-none focus:border-producer/40"
                                placeholder="Trap, Hip Hop, etc"
                            />
                        </div>

                        <div>
                            <label className="text-[8px] font-black uppercase text-subtitle/30 block mb-1">Precio € *</label>
                            <input
                                type="number"
                                step="0.01"
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-sm text-light focus:outline-none focus:border-producer/40"
                                placeholder="49.99"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[8px] font-black uppercase text-subtitle/30 block mb-1">BPM</label>
                            <input
                                type="number"
                                value={bpm}
                                onChange={(e) => setBpm(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-sm text-light focus:outline-none focus:border-producer/40"
                                placeholder="140"
                            />
                        </div>
                        <div>
                            <label className="text-[8px] font-black uppercase text-subtitle/30 block mb-1">Tonalidad</label>
                            <input
                                type="text"
                                value={keySignature}
                                onChange={(e) => setKeySignature(e.target.value)}
                                className="w-full bg-black/40 border border-white/5 rounded-lg px-4 py-2 text-sm text-light focus:outline-none focus:border-producer/40"
                                placeholder="Cm, Am, etc"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="text-[8px] font-black uppercase text-subtitle/30 block mb-1">Portada</label>
                        <div className="flex gap-4 items-center">
                            <div className="w-20 h-20 bg-black/40 rounded-lg border border-white/10 flex items-center justify-center overflow-hidden">
                                {uploadingCover ? (
                                    <Loader2 className="animate-spin text-producer" size={20} />
                                ) : coverUrl ? (
                                    <img src={coverUrl} className="w-full h-full object-cover" alt="Cover" />
                                ) : (
                                    <UploadCloud size={20} className="text-subtitle/40" />
                                )}
                            </div>
                            <label className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[8px] font-black uppercase cursor-pointer hover:bg-white/10">
                                SUBIR IMAGEN
                                <input type="file" accept="image/*" className="hidden" onChange={handleCoverUpload} />
                            </label>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="text-[8px] font-black uppercase text-subtitle/30 block mb-1">Preview MP3</label>
                            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-black/40 border border-white/5 rounded-lg cursor-pointer hover:border-producer/30">
                                {uploadingTagged ? <Loader2 size={14} className="animate-spin" /> : <FileAudio size={14} />}
                                {taggedAudioUrl ? 'Archivo cargado' : 'Subir MP3'}
                                <input type="file" accept="audio/mp3" className="hidden" onChange={(e) => handleAudioUpload(e, 'tagged')} />
                            </label>
                        </div>
                        <div>
                            <label className="text-[8px] font-black uppercase text-subtitle/30 block mb-1">Máster WAV</label>
                            <label className="flex items-center justify-center gap-2 px-4 py-3 bg-black/40 border border-white/5 rounded-lg cursor-pointer hover:border-producer/30">
                                {uploadingUntagged ? <Loader2 size={14} className="animate-spin" /> : <Disc size={14} />}
                                {untaggedAudioUrl ? 'Archivo cargado' : 'Subir WAV'}
                                <input type="file" accept="audio/wav" className="hidden" onChange={(e) => handleAudioUpload(e, 'untagged')} />
                            </label>
                        </div>
                    </div>
                </div>

                <div className="flex gap-3 p-6 border-t border-white/10">
                    <button
                        onClick={onClose}
                        className="flex-1 px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-white/10"
                    >
                        Cancelar
                    </button>
                    <button
                        onClick={handleSubmit}
                        disabled={isSaving}
                        className="flex-1 px-4 py-2 bg-producer text-black rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-producer/90 disabled:opacity-50"
                    >
                        {isSaving ? <Loader2 size={14} className="animate-spin mx-auto" /> : 'Añadir Beat'}
                    </button>
                </div>
            </div>
        </div>
    );
};