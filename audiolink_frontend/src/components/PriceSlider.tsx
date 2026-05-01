interface PriceSliderProps {
    min: number;
    max: number;
    onChange: (values: { min: number; max: number }) => void;
}

const PriceSlider = ({ min, max, onChange }: PriceSliderProps) => {
    const leftPercent = (min / 1000) * 100;
    const rightPercent = (max / 1000) * 100;

    return (
        <div className="bg-gray-dark border border-gray-light rounded-xl px-4 py-2.5 flex items-center gap-4 min-w-[320px]">
            <span className="text-subtitle text-[10px] uppercase font-black tracking-widest whitespace-nowrap">
                Precio: ${min} - ${max}
            </span>

            <div className="relative flex-1 flex items-center h-5">
                {/* Línea de fondo */}
                <div className="h-1 bg-gray-light/30 w-full rounded-full" />

                {/* Línea azul activa dinámica */}
                <div
                    className="absolute h-1 bg-artist rounded-full"
                    style={{ left: `${leftPercent}%`, width: `${rightPercent - leftPercent}%` }}
                />

                {/* Input invisible */}
                <input
                    type="range"
                    min="0"
                    max="1000"
                    value={max}
                    onChange={(e) => onChange({ min, max: Number(e.target.value) })}
                    className="absolute w-full h-full opacity-0 cursor-pointer z-10"
                />

                {/* Selectores visuales */}
                <div
                    className="absolute w-3.5 h-3.5 bg-white border-2 border-artist rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all"
                    style={{ left: `${leftPercent}%`, transform: 'translateX(-50%)' }}
                />
                <div
                    className="absolute w-3.5 h-3.5 bg-white border-2 border-artist rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)] transition-all"
                    style={{ left: `${rightPercent}%`, transform: 'translateX(-50%)' }}
                />
            </div>
        </div>
    );
};

export default PriceSlider;