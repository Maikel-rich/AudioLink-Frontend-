import React from 'react';
import { Phone, Video, Info, MoreVertical, Circle } from 'lucide-react';

const ChatHeader = () => {
    return (
        <div className="h-20 w-full border-b border-gray-light bg-dark/40 backdrop-blur-md flex items-center justify-between px-8 shrink-0">
            <div className="flex items-center gap-4">
                <div className="relative shrink-0">
                    <img
                        src="https://randomuser.me/api/portraits/men/32.jpg"
                        className="w-10 h-10 rounded-lg object-cover border border-gray-light grayscale"
                        alt="Kael Beats"
                    />
                    <Circle size={8} className="absolute -top-1 -right-1 fill-success text-success" />
                </div>
                <div className="min-w-0">
                    <div className="flex items-center gap-3">
                        <h3 className="text-sm font-bold text-light tracking-wide uppercase truncate">Kael Beats</h3>
                        <span className="text-[8px] font-black px-2 py-0.5 bg-artist/10 text-artist border border-artist/20 rounded">ONLINE</span>
                    </div>
                    <p className="text-[10px] font-bold text-subtitle/50 tracking-tight uppercase mt-0.5">Productor / Mix Engineer</p>
                </div>
            </div>

            <div className="flex items-center gap-1">
                {/* BOTONES INACTIVOS */}
                <button className="p-2.5 text-subtitle/10 cursor-not-allowed">
                    <Phone size={18} strokeWidth={2.5} />
                </button>
                <button className="p-2.5 text-subtitle/10 cursor-not-allowed">
                    <Video size={18} strokeWidth={2.5} />
                </button>
                <div className="w-px h-6 bg-gray-light mx-2 opacity-20" />
                <button className="p-2.5 text-subtitle/10 cursor-not-allowed">
                    <Info size={18} strokeWidth={2.5} />
                </button>
                <button className="p-2.5 text-subtitle/60 hover:text-light transition-all cursor-pointer">
                    <MoreVertical size={18} strokeWidth={2.5} />
                </button>
            </div>
        </div>
    );
};
export default ChatHeader;