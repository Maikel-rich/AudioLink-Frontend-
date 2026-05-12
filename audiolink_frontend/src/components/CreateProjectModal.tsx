import React from 'react';
import { X, Music, Users, FolderPlus } from 'lucide-react';
import Button from './Button';

interface CreateProjectModalProps {
    isOpen: boolean;
    onClose: () => void;
}

const CreateProjectModal = ({ isOpen, onClose }: CreateProjectModalProps) => {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            {/* Overlay */}
            <div
                className="absolute inset-0 bg-dark/60 backdrop-blur-sm"
                onClick={onClose}
            />

            <div className="relative w-full max-w-xl bg-[#0b0b0d] border border-gray-light/50 rounded-2xl shadow-2xl overflow-hidden">
                <div className="px-8 py-6 border-b border-gray-light/30 flex justify-between items-center bg-gray-dark/20">
                    <div className="flex items-center gap-3">
                        <FolderPlus className="text-artist" size={20} />
                        <h2 className="text-sm font-black tracking-[0.2em] uppercase text-light">Nueva Sesión de Proyecto</h2>
                    </div>
                    <button onClick={onClose} className="text-subtitle/40 hover:text-light transition-colors">
                        <X size={20} />
                    </button>
                </div>

                <div className="p-8 space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black text-subtitle/40 uppercase tracking-[0.2em] ml-1">Título del Proyecto</label>
                        <input
                            type="text"
                            placeholder="EJ: ALBUM_SESSION_2024"
                            className="w-full bg-gray-dark/40 border border-gray-light rounded-xl px-5 py-4 text-xs font-bold text-light outline-none focus:border-artist/40 transition-all uppercase tracking-widest placeholder:text-subtitle/10"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-subtitle/40 uppercase tracking-[0.2em] ml-1">Género / Tipo</label>
                            <div className="relative">
                                <Music className="absolute left-4 top-1/2 -translate-y-1/2 text-subtitle/20" size={16} />
                                <select className="w-full bg-gray-dark/40 border border-gray-light rounded-xl pl-12 pr-5 py-4 text-xs font-bold text-light outline-none focus:border-artist/40 appearance-none uppercase tracking-widest">
                                    <option>Electronic</option>
                                    <option>Urban / Trap</option>
                                    <option>Pop / Rock</option>
                                    <option>Mixing Only</option>
                                </select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-black text-subtitle/40 uppercase tracking-[0.2em] ml-1">Asignar Productor</label>
                            <div className="relative">
                                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-subtitle/20" size={16} />
                                <select className="w-full bg-gray-dark/40 border border-gray-light rounded-xl pl-12 pr-5 py-4 text-xs font-bold text-light outline-none focus:border-artist/40 appearance-none uppercase tracking-widest">
                                    <option>Kael Beats</option>
                                    <option>Elena Rose</option>
                                    <option>Dímelo Flow</option>
                                </select>
                            </div>
                        </div>
                    </div>

                </div>

                <div className="px-8 py-6 bg-gray-dark/20 border-t border-gray-light/30 flex justify-end gap-4">
                    <button
                        onClick={onClose}
                        className="text-[10px] font-black text-subtitle/40 hover:text-light uppercase tracking-[0.2em] transition-colors px-4"
                    >
                        Cancelar
                    </button>
                    <Button variant="artist" size="md" className="px-8 h-12">
                        <span className="text-[10px]">Inicializar Proyecto</span>
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default CreateProjectModal;