import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FilterDropdownProps {
    label: string;
    value: string;
    options: string[];
    onChange: (val: string) => void;
}

const FilterDropdown = ({ label, value, options, onChange }: FilterDropdownProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className="w-full h-12 bg-gray-dark/40 border border-gray-light rounded-xl px-4 flex items-center gap-2 cursor-pointer hover:bg-gray-light/10 transition-all group"
            >
                <span className="text-subtitle text-[10px] uppercase font-black tracking-widest">{label}:</span>
                <span className="text-light text-sm font-bold flex-1">{value}</span>
                <ChevronDown size={16} className={`text-subtitle group-hover:text-light transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>

            {isOpen && (
                <div className="absolute top-full mt-2 w-full bg-gray-dark border border-gray-light rounded-xl overflow-hidden z-30 shadow-2xl">
                    {options.map((opt) => (
                        <div
                            key={opt}
                            onClick={() => {
                                onChange(opt);
                                setIsOpen(false);
                            }}
                            className="px-4 py-2 text-sm text-subtitle hover:bg-artist hover:text-white transition-colors cursor-pointer"
                        >
                            {opt}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default FilterDropdown;