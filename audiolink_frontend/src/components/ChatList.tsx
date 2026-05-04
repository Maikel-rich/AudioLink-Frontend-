import React from 'react';
import { Search, Filter, Plus } from 'lucide-react';

const ChatList = () => {
    const chats = [
        { id: 1, name: "Kael Beats", lastMsg: "He subido los stems del proyecto...", time: "12:45", active: true, online: true, unread: true, img: "https://randomuser.me/api/portraits/men/32.jpg" },
        { id: 2, name: "Elena Rose", lastMsg: "¿Te gusta el nuevo arreglo?", time: "AYER", active: false, online: true, unread: false, img: "https://randomuser.me/api/portraits/women/44.jpg" },
        { id: 3, name: "Dímelo Flow", lastMsg: "Mañana grabamos voces.", time: "LUN", active: false, online: false, unread: true, img: "https://randomuser.me/api/portraits/men/46.jpg" },
    ];
    const hasUnread = chats.some(chat => chat.unread);

    return (
        <div className="w-80 h-full border-r border-gray-light flex flex-col bg-dark shrink-0">
            <div className="p-5 border-b border-gray-light bg-dark/50 backdrop-blur-xl">
                <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-black text-light tracking-widest uppercase">
                        Chats {hasUnread && <span className="text-artist text-xl ml-1 animate-pulse">.</span>}
                    </h2>
                    <div className="flex gap-2">
                        <button
                            className="p-2 bg-gray-dark border border-gray-light rounded-lg text-subtitle hover:text-artist
                            transition-all cursor-pointer"
                        >
                            <Plus size={16} />
                        </button>

                        {/* BOTÓN FILTRAR (INACTIVO) */}
                        <button
                            className="p-2 bg-gray-dark border border-gray-light rounded-lg text-subtitle/20 cursor-not-allowed opacity-50"
                        >
                            <Filter size={16} />
                        </button>
                    </div>
                </div>
                <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-subtitle/30" size={14} />
                    <input
                        type="text"
                        placeholder="BUSCAR CONVERSACIÓN..."
                        className="w-full bg-gray-dark border border-gray-light rounded-md py-2.5 pl-9 pr-4 text-[9px] font-bold tracking-[0.15em]
                        text-light focus:outline-none focus:border-artist/40 placeholder:text-subtitle/20 uppercase"
                    />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto custom-scrollbar">
                {chats.map((chat) => (
                    <div
                        key={chat.id}
                        className={`group relative p-4 flex gap-4 cursor-pointer transition-all duration-200
                        ${chat.active ? 'bg-artist-muted/20' : 'hover:bg-gray-light/10'}`}
                    >
                        {chat.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-artist shadow-[0_0_15px_rgba(60,131,246,0.5)]" />}
                        <div className="relative shrink-0">
                            <img
                                src={chat.img}
                                className={`w-11 h-11 rounded-lg object-cover
                                ${chat.active ? '' : 'grayscale group-hover:grayscale-0 transition-all duration-500'}`} alt={chat.name}
                            />
                            {chat.online && <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-success border-2 border-dark rounded-full shadow-lg shadow-success/20"></span>}
                        </div>
                        <div className="flex-1 min-w-0 flex flex-col justify-center">
                            <div className="flex justify-between items-baseline mb-0.5">
                                <h4
                                    className={`text-[11px] font-bold tracking-wider uppercase truncate
                                    ${chat.active ? 'text-artist' : 'text-light group-hover:text-artist'}`}
                                >
                                    {chat.name}
                                </h4>
                                <span className="text-[8px] font-black text-subtitle/40 tracking-tight">{chat.time}</span>
                            </div>
                            <p
                                className={`text-[10px] truncate
                                ${chat.unread && !chat.active ? 'text-light font-black' : 'text-subtitle/60 font-bold'}`}
                            >
                                {chat.lastMsg}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};
export default ChatList;    