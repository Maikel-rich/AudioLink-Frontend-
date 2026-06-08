import React from 'react';
import { Edit3, Save, Sliders, Loader2 } from 'lucide-react';

interface StudioHeaderProps {
    isEditing: boolean;
    isSaving: boolean;
    onEdit: () => void;
    onSave: () => void;
    disabled: boolean;
}

export const StudioHeader: React.FC<StudioHeaderProps> = ({
    isEditing,
    isSaving,
    onEdit,
    onSave,
    disabled
}) => {
    return (
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-6 border-b border-white/5 pb-8">
            <div>
                <span className="text-[9px] font-black uppercase text-producer tracking-[0.4em] flex items-center gap-2 mb-1">
                    <Sliders size={12} /> ESTUDIO VIRTUAL • WORKSTATION
                </span>
                <h1 className="text-3xl font-black uppercase tracking-tighter">Consola de Configuración</h1>
            </div>
            <button
                onClick={isEditing ? onSave : onEdit}
                disabled={disabled}
                className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 transition-all duration-300 shadow-lg ${isEditing
                    ? 'bg-producer text-black hover:bg-producer/90 shadow-producer/10'
                    : 'bg-white/2 border border-white/5 text-light hover:bg-white/5'
                    }`}
            >
                {isSaving ? <Loader2 size={14} className="animate-spin" /> : isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                {isSaving ? "SINCRONIZANDO..." : isEditing ? "GUARDAR SETUP" : "MODIFICAR CONFIGURACIÓN"}
            </button>
        </div>
    );
};