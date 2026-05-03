import React, { useState } from 'react';
import { ShoppingCart, Play } from 'lucide-react';
import Button from './Button';

const TRACKS = [
    { id: 1, title: "Midnight Reflections", genre: "Cinematográfico / Lofi Hip-Hop", duration: "03:45", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300&auto=format&fit=crop" },
    { id: 2, title: "Neon Pulse", genre: "Electrónico / Synthwave", duration: "04:12", img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=300&auto=format&fit=crop" },
    { id: 3, title: "City Grit", genre: "Hip-Hop Moderno / Trap", duration: "02:58", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300&auto=format&fit=crop" }
];

const RecentProductions = () => {
    const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

    return (
        <section className="space-y-6">
            <div className="flex items-center gap-3 mb-8">
                <div className="w-1.5 h-6 bg-artist rounded-full shadow-[0_0_12px_rgba(var(--artist-rgb),0.5)]" />
                <h3 className="text-xl font-bold text-light tracking-tight">Producciones Recientes</h3>
            </div>

            <div className="grid gap-2">
                {TRACKS.map((track) => {
                    const isSelected = activeTrackId === track.id;

                    return (
                        <div
                            key={track.id}
                            onClick={() => setActiveTrackId(track.id)}
                            className={`relative group p-4 rounded-2xl transition-all duration-500 overflow-hidden ${isSelected
                                ? 'bg-white/3 translate-x-2'
                                : 'hover:bg-white/1'
                                }`}
                        >
                            <div className={`absolute left-0 top-1/4 bottom-1/4 w-1 rounded-r-full transition-all duration-500 ${isSelected ? 'bg-artist opacity-100 shadow-[0_0_15px_#3b82f6]' : 'opacity-0'
                                }`} />

                            <div className="flex items-center gap-6">
                                <div className="relative w-14 h-14 rounded-xl overflow-hidden shrink-0 shadow-2xl">
                                    <img
                                        src={track.img}
                                        alt={track.title}
                                        className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? 'scale-110' : 'group-hover:scale-105'}`}
                                    />
                                    <div className={`absolute inset-0 bg-black/40 flex items-center justify-center transition-opacity ${isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}>
                                        <Play size={18} fill="white" className="text-white" />
                                    </div>
                                </div>

                                <div className="flex-1 min-w-0">
                                    <div className="flex justify-between items-baseline mb-2">
                                        <h4 className={`font-bold transition-colors duration-300 ${isSelected ? 'text-artist' : 'text-light'}`}>
                                            {track.title}
                                        </h4>
                                        <span className="text-[10px] text-subtitle font-mono opacity-50">{track.duration}</span>
                                    </div>

                                    <div className="flex items-end gap-0.5 h-4 opacity-30 group-hover:opacity-60 transition-opacity">
                                        {Array.from({ length: 30 }).map((_, i) => (
                                            <div
                                                key={i}
                                                className={`w-1 rounded-full ${isSelected && i < 12 ? 'bg-artist' : 'bg-white/20'}`}
                                                style={{ height: `${isSelected ? (30 + Math.random() * 70) : (10 + Math.random() * 40)}%` }}
                                            />
                                        ))}
                                    </div>
                                </div>

                                <div className="flex items-center">
                                    <Button
                                        variant="ghost"
                                        className={`p-3! rounded-full transition-all duration-300 ${isSelected
                                            ? 'bg-artist text-white scale-110 shadow-lg shadow-artist/20'
                                            : 'bg-white/5 text-subtitle hover:bg-white/10 hover:text-light'
                                            }`}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            console.log("Add to cart");
                                        }}
                                    >
                                        <ShoppingCart size={18} />
                                    </Button>
                                </div>
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
};

export default RecentProductions;