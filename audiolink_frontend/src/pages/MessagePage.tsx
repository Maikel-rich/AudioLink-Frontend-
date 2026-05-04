import React from 'react';
import Sidebar from "@/components/SideBar";
import ChatList from "@/components/ChatList";
import ChatHeader from "@/components/ChatHeader";
import MessageInput from "@/components/MessageInput";

const MessagePage = () => {
    return (
        <div className="flex h-screen bg-dark text-light overflow-hidden font-sans">
            <Sidebar userType="artist" isCollapsed={true} />

            <main className="flex-1 flex overflow-hidden">
                <ChatList />

                <div className="flex-1 flex flex-col bg-[#0b0b0d] relative shadow-[inset_10px_0_30px_rgba(0,0,0,0.5)]">
                    <ChatHeader />

                    <div className="flex-1 overflow-y-auto p-8 flex flex-col gap-8 custom-scrollbar">
                        <div className="flex items-center gap-4 opacity-20">
                            <div className="h-px flex-1 bg-subtitle" />
                            <span className="text-[9px] font-bold tracking-[0.3em] uppercase">04 MAY 2024</span>
                            <div className="h-px flex-1 bg-subtitle" />
                        </div>

                        {/* Mensaje Recibido */}
                        <div className="flex flex-col items-start max-w-[65%] group">
                            <div
                                className="bg-gray-dark/80 border border-gray-light p-5 rounded-2xl rounded-tl-none
                                group-hover:border-subtitle/30 transition-colors"
                            >
                                <p className="text-[14px] leading-relaxed text-light/80">
                                    ¡Hola! He subido los nuevos stems al proyecto. Revisalos cuando puedas, especialmente la compresión de la batería.
                                </p>
                            </div>
                            <span
                                className="text-[8px] font-black text-subtitle/20 mt-3 tracking-widest uppercase ml-1"
                            >
                                12:45 PM // KAEL BEATS
                            </span>
                        </div>

                        {/* Mensaje Enviado */}
                        <div className="flex flex-col items-end max-w-[65%] ml-auto group">
                            <div
                                className="bg-artist/90 p-5 rounded-2xl rounded-tr-none shadow-xl shadow-artist/5 group-hover:bg-artist transition-colors"
                            >
                                <p className="text-[14px] leading-relaxed text-light">
                                    ¡Brutal! Los escucho ahora mismo y te digo algo por aquí.
                                </p>
                            </div>
                            <span className="text-[8px] font-black text-artist/40 mt-3 tracking-widest uppercase mr-1">12:47 PM // ENVIADO</span>
                        </div>
                    </div>

                    <MessageInput />
                </div>
            </main>
        </div>
    );
};

export default MessagePage;
