import React from 'react';
import { Paperclip, Send, Mic } from 'lucide-react';

const MessageInput = () => {
    return (
        <div className="px-8 py-6 bg-dark border-t border-gray-light/50">
            <div className="max-w-6xl mx-auto flex items-center gap-3">

                <button
                    title="Adjuntar archivos"
                    className="h-13 w-13 flex items-center justify-center bg-gray-dark border border-gray-light rounded-lg text-subtitle/40
                    hover:text-artist hover:border-artist/40 hover:bg-artist/5 transition-all cursor-pointer group shrink-0"
                >
                    <Paperclip size={18} className="group-hover:-rotate-12 transition-transform duration-300" />
                </button>

                <div
                    className="flex-1 min-h-13 flex items-center bg-gray-dark/30 border border-gray-light rounded-lg transition-all px-4 group 
                    focus-within:border-artist/40"
                >
                    <textarea
                        placeholder="Escribe un mensaje..."
                        className="
                            flex-1 bg-transparent border-none outline-none focus:ring-0 focus:ring-offset-0 text-[14px] font-semibold text-light
                            py-4 resize-none placeholder:text-subtitle/20 leading-[1.2] min-h-13 max-h-32 custom-scrollbar"
                        rows={1}
                        style={{ height: '52px' }}
                        onInput={(e) => {
                            const target = e.target as HTMLTextAreaElement;
                            target.style.height = '52px';
                            const newHeight = Math.max(52, target.scrollHeight);
                            target.style.height = `${newHeight}px`;
                        }}
                    />

                    {/* Botón Micrófono (Inactivo) */}
                    <div className="flex items-center ml-2">
                        <button
                            disabled
                            className="p-2 text-subtitle/5 cursor-not-allowed"
                        >
                            <Mic size={16} />
                        </button>
                    </div>
                </div>

                <button
                    className="
                        h-13 w-13 flex items-center justify-center bg-artist text-white rounded-lg hover:bg-artist/90 active:scale-[0.98]
                        transition-all cursor-pointer group shadow-sm shadow-artist/5 shrink-0"
                >
                    <Send
                        size={16}
                        strokeWidth={2.5}
                        className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" /
                    >
                </button>
            </div>
        </div>
    );
};

export default MessageInput;