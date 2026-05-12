import React from 'react';
import Sidebar from "@/components/SideBar";
import ChatList from "@/components/ChatList";
import ChatHeader from "@/components/ChatHeader";
import MessageInput from "@/components/MessageInput";
import { MessageSquare, Terminal } from 'lucide-react';

const MessagePage = () => {
    return (
        <div className="flex h-screen bg-[#08080a] text-light overflow-hidden">
            <Sidebar userType="artist" isCollapsed={true} />

            <main className="flex-1 flex overflow-hidden">
                <div className="w-80 shrink-0 border-r border-white/5 bg-[#0b0b0d]/50">
                    <ChatList />
                </div>

                <div className="flex-1 flex flex-col bg-[#08080a] relative shadow-[inset_20px_0_40px_rgba(0,0,0,0.3)]">
                    <ChatHeader />

                    <div className="flex-1 overflow-y-auto p-10 flex flex-col gap-10 custom-scrollbar">
                        <div className="flex items-center gap-6 opacity-30">
                            <div className="h-px flex-1 bg-linear-to-r from-transparent to-subtitle" />
                            <div className="flex items-center gap-2">
                                <Terminal size={10} />
                                <span className="text-[9px] font-black tracking-[0.4em] uppercase text-subtitle">LOG_SESSION // 04 MAY 2024</span>
                            </div>
                            <div className="h-px flex-1 bg-linear-to-l from-transparent to-subtitle" />
                        </div>

                        <div className="flex flex-col items-start max-w-[70%] group">
                            <div className="bg-white/3 border border-white/8 p-5 rounded-2xl rounded-tl-none backdrop-blur-md group-hover:border-white/20 transition-all">
                                <p className="text-[14px] leading-relaxed text-subtitle/90 font-medium">
                                    Hola Kael! He revisado los últimos stems. Los arreglos de cuerda suenan brutales, pero creo que podemos darle más aire en los 12kHz. Avísame cuando puedas.
                                </p>
                            </div>
                            <span className="text-[8px] font-black text-subtitle/20 mt-3 tracking-[0.2em] uppercase ml-1">
                                12:45 PM // INCOMING // KAEL BEATS
                            </span>
                        </div>

                        <div className="flex flex-col items-end max-w-[70%] ml-auto group">
                            <div className="bg-artist/10 border border-artist/30 p-5 rounded-2xl rounded-tr-none shadow-lg shadow-artist/5 group-hover:bg-artist/20 transition-all">
                                <p className="text-[14px] leading-relaxed text-light font-medium">
                                    ¡Recibido! Le doy ese brillo extra ahora mismo y te subo la V2 al inspector del proyecto.
                                </p>
                            </div>
                            <span className="text-[8px] font-black text-artist/40 mt-3 tracking-[0.2em] uppercase mr-1">
                                12:47 PM // OUTGOING // ENVIADO
                            </span>
                        </div>
                    </div>

                    <div className="px-10 pb-8 pt-4 bg-linear-to-t from-[#08080a] to-transparent">
                        <MessageInput />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MessagePage;