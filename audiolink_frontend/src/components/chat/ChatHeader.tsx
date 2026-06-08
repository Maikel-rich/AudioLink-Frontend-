// src/components/chat/ChatHeader.tsx
import React, { useState, useEffect } from 'react';
import { Phone, Video, Info, MoreVertical, Loader2 } from 'lucide-react';
import MessageInput from './MessageInput';

interface ChatHeaderProps {
    userType: 'artist' | 'producer';
    isInputFooter?: boolean;
    activeChatId?: number;
    requestData?: any;
    onSendMessage?: (text: string, fileUrl?: string, fileType?: string) => void;
}

const ChatHeader = ({ userType, isInputFooter = false, activeChatId = 1, requestData, onSendMessage }: ChatHeaderProps) => {
    if (isInputFooter) {
        return <MessageInput userType={userType} onSendMessage={onSendMessage} />;
    }

    const isLoading = !requestData;
    const otherParty = requestData ? (
        userType === 'artist' ? requestData.producer : requestData.artist
    ) : null;

    const counterpartRoleLabel = userType === 'artist' ? 'Productor Musical' : 'Artista';
    const badgeStyles = userType === 'artist'
        ? 'bg-artist/10 text-artist border-artist/20'
        : 'bg-producer/10 text-producer border-producer/20';
    const avatarBg = userType === 'artist'
        ? 'bg-artist/20 text-artist'
        : 'bg-producer/20 text-producer';

    return (
        <div className="h-16 w-full border-b border-white/5 bg-dark/40 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-10">
            <div className="flex items-center gap-3 min-w-0">
                <div className="relative shrink-0 w-9 h-9">
                    {isLoading ? (
                        <div className="w-full h-full rounded-full bg-white/5 flex items-center justify-center">
                            <Loader2 size={14} className="animate-spin text-subtitle/40" />
                        </div>
                    ) : otherParty?.avatar ? (
                        <img
                            src={otherParty.avatar}
                            className="w-full h-full rounded-full object-cover border border-white/10"
                            alt={otherParty.name}
                        />
                    ) : (
                        <div className={`w-full h-full rounded-full flex items-center justify-center text-xs font-black uppercase ${avatarBg}`}>
                            {otherParty?.name?.[0]?.toUpperCase() || '?'}
                        </div>
                    )}
                </div>
                <div className="min-w-0 flex flex-col justify-center">
                    <div className="flex items-center gap-2">
                        <h3 className="text-xs font-bold text-light tracking-wide uppercase truncate">
                            {isLoading ? 'Cargando...' : otherParty?.name || 'Usuario'}
                        </h3>
                        <span className={`text-[7px] font-black px-1.5 py-0.5 border rounded shrink-0 ${badgeStyles}`}>
                            {counterpartRoleLabel}
                        </span>
                    </div>
                    {requestData?.service?.name && (
                        <p className="text-[8px] text-subtitle/50 truncate mt-0.5">
                            Servicio: {requestData.service.name}
                        </p>
                    )}
                    {requestData?.status && (
                        <p className="text-[7px] text-subtitle/40 mt-0.5">
                            Estado: {requestData.status}
                        </p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-0.5 shrink-0">
                <button className="p-2 text-subtitle/5 cursor-not-allowed" disabled><Phone size={15} /></button>
                <button className="p-2 text-subtitle/5 cursor-not-allowed" disabled><Video size={15} /></button>
                <div className="w-px h-4 bg-white/5 mx-2" />
                <button className="p-2 text-subtitle/5 cursor-not-allowed" disabled><Info size={15} /></button>
                <button className="p-2 text-subtitle/50 hover:text-light transition-colors cursor-pointer"><MoreVertical size={15} /></button>
            </div>
        </div>
    );
};

export default ChatHeader;