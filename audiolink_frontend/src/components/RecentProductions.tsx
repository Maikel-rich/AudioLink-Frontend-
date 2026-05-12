import React, { useState } from 'react';
import { ShoppingCart, Play, Pause, BarChart3 } from 'lucide-react';
import Button from './Button';

const TRACKS = [
    { id: 1, title: "Midnight Reflections", genre: "CINEMATOGRÁFICO / LOFI", bpm: "88 BPM", duration: "03:45", img: "https://images.unsplash.com/photo-1614613535308-eb5fbd3d2c17?q=80&w=300" },
    { id: 2, title: "Neon Pulse", genre: "ELECTRONIC / SYNTHWAVE", bpm: "124 BPM", duration: "04:12", img: "https://images.unsplash.com/photo-1557672172-298e090bd0f1?q=80&w=300" },
    { id: 3, title: "City Grit", genre: "HIP-HOP / TRAP", bpm: "145 BPM", duration: "02:58", img: "https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=300" }
];

const RecentProductions = () => {
    const [activeTrackId, setActiveTrackId] = useState<number | null>(null);

    return (
        <div className="grid gap-4">
            {TRACKS.map((track) => {
                const isSelected = activeTrackId === track.id;
                return (
                    <div
                        key={track.id}
                        onClick={() => setActiveTrackId(isSelected ? null : track.id)}
                        className={`group relative flex items-center gap-6 p-5 rounded-2xl border transition-all duration-500 cursor-pointer ${isSelected ? 'bg-artist/10 border-artist/40 shadow-lg shadow-artist/5' : 'bg-light/2 border-light/5 hover:border-light/20'
                            }`}
                    >

                        <div className="w-16 h-16 rounded-xl overflow-hidden relative shrink-0">
                            <img src={track.img} alt={track.title} className={`w-full h-full object-cover grayscale transition-all duration-700 ${isSelected ? 'grayscale-0 scale-110' : 'group-hover:grayscale-0'}`} />
                            <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                                {isSelected ? <Pause size={20} className="text-whilightte" /> : <Play size={20} className="text-light opacity-0 group-hover:opacity-100 transition-opacity" />}
                            </div>
                        </div>

                        <div className="flex-1">
                            <h4 className={`text-sm font-black uppercase tracking-tight transition-colors ${isSelected ? 'text-artist' : 'text-light'}`}>{track.title}</h4>
                            <div className="flex items-center gap-3 mt-1">
                                <span className="text-[9px] font-black text-subtitle/40 uppercase tracking-widest">{track.genre}</span>
                                <div className="w-1 h-1 rounded-full bg-light/10" />
                                <span className="text-[9px] font-black text-artist uppercase tracking-widest">{track.bpm}</span>
                            </div>
                        </div>

                        <div className="hidden md:flex items-end gap-0.5 h-10 w-32 shrink-0 px-4">
                            {[...Array(15)].map((_, i) => (
                                <div
                                    key={i}
                                    className={`w-1 rounded-full transition-all duration-500 ${isSelected ? 'bg-artist' : 'bg-light/10 group-hover:bg-light/30'}`}
                                    style={{ height: `${isSelected ? (20 + Math.random() * 80) : (10 + Math.random() * 30)}%` }}
                                />
                            ))}
                        </div>

                        <div className="flex items-center gap-4">
                            <span className="text-[10px] font-black text-subtitle/20 tabular-nums">{track.duration}</span>
                            <Button
                                variant="ghost"
                                className={`p-3! rounded-xl border transition-all ${isSelected ? 'bg-artist text-light border-artist' : 'bg-light/5 text-subtitle/60 border-light/5 hover:border-light/20 hover:text-light'}`}
                            >
                                <ShoppingCart size={18} />
                            </Button>
                        </div>
                    </div>
                );
            })}
        </div>
    );
};

export default RecentProductions;