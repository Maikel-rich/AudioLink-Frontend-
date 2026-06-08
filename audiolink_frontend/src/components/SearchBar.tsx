import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps extends React.InputHTMLAttributes<HTMLInputElement> {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ value, onChange, placeholder, ...props }: SearchBarProps) => {
    return (
        <div className="relative w-full group">
            <Search
                size={16}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-subtitle/30 group-focus-within:text-artist/60 transition-colors"
            />

            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder={placeholder || "BUSCAR..."}
                {...props}
                className={`
                    w-full h-12 bg-gray-dark/40 border border-gray-light rounded-xl 
                    pl-11 pr-4 text-[11px] font-bold text-light outline-none
                    focus:border-artist/40 focus:bg-gray-dark/60 transition-all 
                    placeholder:text-subtitle/20 tracking-wider uppercase
                    ${props.className || ''}
                `}
            />
        </div>
    );
};

export default SearchBar;