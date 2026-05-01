import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const SearchBar = ({ value, onChange }: SearchBarProps) => {
    return (
        <div className="relative w-full mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-subtitle w-5 h-5" />
            <input
                type="text"
                value={value}
                onChange={onChange}
                placeholder="Buscar sesiones, productores o archivos..."
                className="w-full bg-gray-dark border border-gray-light rounded-xl py-3 pl-12 pr-4 text-light focus:outline-none focus:ring-1 focus:ring-artist transition-all placeholder:text-subtitle/50"
            />
        </div>
    );
};

export default SearchBar;