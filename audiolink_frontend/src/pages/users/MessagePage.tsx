import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import Sidebar from "@/components/SideBar";
import ChatList from "@/components/chat/ChatList";
import ChatHeader from "@/components/chat/ChatHeader";
import { Terminal, Send, Loader2, MessageCircle, Play, Pause, Paperclip, Music, X, Download } from 'lucide-react';
import { serviceRequestService, ChatMessage } from '@/services/serviceRequestService';
import { authService } from '@/services/authService';
import { cloudinaryService } from '@/services/cloudinaryService';

type UserRole = 'artist' | 'producer';

const MessageInput = ({
    userType,
    onSendMessage,
    disabled
}: {
    userType: UserRole;
    onSendMessage: (text: string, fileUrl?: string, fileType?: string) => void;
    disabled?: boolean;
}) => {
    const [text, setText] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const buttonBg = userType === 'artist'
        ? 'bg-artist hover:bg-artist/90'
        : 'bg-producer hover:bg-producer/90';
    const focusBorder = userType === 'artist' ? 'focus-within:border-artist/40' : 'focus-within:border-producer/40';

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!file.type.includes('audio') && !file.name.match(/\.(mp3|wav|m4a|aac|ogg)$/i)) {
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            return;
        }

        setSelectedFile(file);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            const url = await cloudinaryService.uploadFileSecure(selectedFile);
            const fileType = selectedFile.name.endsWith('.mp3') ? 'mp3' : 'audio';
            await onSendMessage(text.trim() || `🎵 ${selectedFile.name}`, url, fileType);
            setText('');
            setSelectedFile(null);
            if (fileInputRef.current) fileInputRef.current.value = '';
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsUploading(false);
        }
    };

    const handleSend = () => {
        if (selectedFile) {
            handleUpload();
        } else if (text.trim()) {
            onSendMessage(text.trim());
            setText('');
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="w-full">
            {selectedFile && (
                <div className="mb-3 p-2 bg-black/40 rounded-lg border border-white/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <Music size={14} className="text-artist" />
                        <span className="text-[10px] text-light truncate max-w-[150px]">{selectedFile.name}</span>
                        <span className="text-[8px] text-subtitle/40">
                            {(selectedFile.size / (1024 * 1024)).toFixed(1)} MB
                        </span>
                    </div>
                    {!isUploading && (
                        <button onClick={() => setSelectedFile(null)} className="text-subtitle/40 hover:text-error">
                            <X size={14} />
                        </button>
                    )}
                </div>
            )}

            <div className="flex gap-2">
                <label className={`h-10 w-10 flex items-center justify-center bg-gray-dark/80 border border-white/5 rounded-xl text-subtitle/40 hover:text-light transition-all cursor-pointer ${isUploading ? 'opacity-50' : ''}`}>
                    <Paperclip size={15} />
                    <input
                        ref={fileInputRef}
                        type="file"
                        accept="audio/*"
                        onChange={handleFileSelect}
                        className="hidden"
                        disabled={isUploading}
                    />
                </label>

                <div className={`flex-1 flex items-center bg-gray-dark/40 border border-white/5 rounded-xl transition-all px-3 ${focusBorder}`}>
                    <textarea
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        placeholder={selectedFile ? "Comentario (opcional)..." : "Escribe un mensaje..."}
                        className="flex-1 bg-transparent border-none outline-none text-xs font-medium text-light py-2.5 resize-none"
                        rows={1}
                        style={{ height: '38px' }}
                        disabled={isUploading || disabled}
                    />
                </div>

                <button
                    onClick={handleSend}
                    disabled={(!text.trim() && !selectedFile) || isUploading || disabled}
                    className={`h-10 w-10 flex items-center justify-center rounded-xl transition-all ${buttonBg} text-black disabled:opacity-50`}
                >
                    {isUploading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} />}
                </button>
            </div>
        </div>
    );
};

const MessageBubble = ({
    message,
    isOwn,
    timestamp,
    role,
    onPlayAudio,
    isPlaying
}: {
    message: ChatMessage;
    isOwn: boolean;
    timestamp: string;
    role: UserRole;
    onPlayAudio: (messageId: number, url: string) => void;
    isPlaying: boolean;
}) => {
    const accentBg = role === 'artist'
        ? 'bg-artist/10 border-artist/20'
        : 'bg-producer/10 border-producer/20';

    const audioMatch = message.message.match(/\[audio\](.*?)\[\/audio\]/);
    const audioUrl = audioMatch ? audioMatch[1] : null;
    const cleanText = message.message.replace(/\[audio\].*?\[\/audio\]/, '').trim();

    const handleDownload = async () => {
        if (!audioUrl) return;
        try {
            const fileName = audioUrl.split('/').pop()?.split('?')[0] || 'audio_file';
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = fileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            // Error silencioso en producción
        }
    };

    return (
        <div className={`flex flex-col ${isOwn ? 'items-end' : 'items-start'} max-w-[85%] ${isOwn ? 'ml-auto' : 'mr-auto'}`}>
            <div className={`border p-3 rounded-xl ${isOwn ? 'rounded-tr-none' : 'rounded-tl-none'} ${isOwn ? accentBg : 'bg-white/5 border-white/10'}`}>
                {cleanText && (
                    <p className="text-sm leading-relaxed text-light break-words">
                        {cleanText}
                    </p>
                )}
                {audioUrl && (
                    <div className={`${cleanText ? 'mt-2 pt-2 border-t border-white/10' : ''}`}>
                        <div className="flex items-center justify-between gap-3 bg-black/40 rounded-lg p-2">
                            <div className="flex items-center gap-2">
                                <button
                                    onClick={() => onPlayAudio(message.id, audioUrl)}
                                    className="w-7 h-7 rounded-full bg-artist/20 hover:bg-artist/40 flex items-center justify-center transition-colors"
                                >
                                    {isPlaying ? <Pause size={12} /> : <Play size={12} />}
                                </button>
                                <div>
                                    <p className="text-[9px] text-light font-medium">Archivo de audio</p>
                                    <p className="text-[7px] text-subtitle/40">Click para reproducir</p>
                                </div>
                            </div>
                            <button
                                onClick={handleDownload}
                                className="p-1.5 rounded-lg bg-white/5 hover:bg-artist/20 transition-colors group"
                                title="Descargar archivo"
                            >
                                <Download size={12} className="text-subtitle/40 group-hover:text-artist transition-colors" />
                            </button>
                            <audio
                                src={audioUrl}
                                onEnded={() => onPlayAudio(message.id, '')}
                                className="hidden"
                                id={`audio-${message.id}`}
                            />
                        </div>
                    </div>
                )}
            </div>
            <span className={`text-[8px] text-subtitle/40 mt-1 ${isOwn ? 'mr-1' : 'ml-1'}`}>
                {timestamp}
            </span>
        </div>
    );
};

const MessagePage = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const requestIdParam = searchParams.get('request');

    const [role, setRole] = useState<UserRole>('artist');
    const [currentUserId, setCurrentUserId] = useState<number | null>(null);
    const [activeRequestId, setActiveRequestId] = useState<number>(() => requestIdParam ? parseInt(requestIdParam) : 0);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [currentRequest, setCurrentRequest] = useState<any>(null);
    const [error, setError] = useState<string | null>(null);
    const [playingAudioId, setPlayingAudioId] = useState<number | null>(null);
    const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});

    useEffect(() => {
        const loadUser = async () => {
            let user = authService.getCurrentUser();
            if (!user) {
                try {
                    user = await authService.getMe();
                } catch (e) {
                    // Error silencioso en producción
                }
            }
            if (user) {
                setCurrentUserId(user.id);
                setRole(user.role === 0 ? 'producer' : 'artist');
            }
        };
        loadUser();
    }, []);

    const loadMessagesByRequestId = useCallback(async (requestId: number) => {
        if (!requestId) return;

        try {
            setIsLoading(true);
            setError(null);

            const request = await serviceRequestService.getRequestById(requestId);
            setCurrentRequest(request);

            const msgs = await serviceRequestService.getMessages(requestId);
            setMessages(msgs);
        } catch (error) {
            setError('Error al cargar los mensajes');
        } finally {
            setIsLoading(false);
        }
    }, []);

    const handleSendMessage = async (text: string, fileUrl?: string, fileType?: string) => {
        if ((!text.trim() && !fileUrl) || !activeRequestId) return;

        let messageContent = text;
        if (fileUrl) {
            messageContent = `${text}\n[audio]${fileUrl}[/audio]`;
        }

        try {
            await serviceRequestService.sendMessage(activeRequestId, messageContent);
            await loadMessagesByRequestId(activeRequestId);
        } catch (error) {
            // Error silencioso en producción
        }
    };

    const handlePlayAudio = (messageId: number, url: string) => {
        const audio = audioRefs.current[messageId];
        if (!audio) return;

        if (playingAudioId === messageId) {
            audio.pause();
            setPlayingAudioId(null);
        } else {
            if (playingAudioId && audioRefs.current[playingAudioId]) {
                audioRefs.current[playingAudioId].pause();
            }
            audio.play();
            setPlayingAudioId(messageId);
        }
    };

    const handleSelectChat = (userId: number, requestId: number) => {
        if (requestId === activeRequestId) return;

        navigate(`/messages?request=${requestId}`, { replace: true });
        setActiveRequestId(requestId);
        setError(null);
        setMessages([]);
        setPlayingAudioId(null);
        loadMessagesByRequestId(requestId);
    };

    useEffect(() => {
        const reqId = searchParams.get('request');
        if (reqId) {
            const newId = parseInt(reqId);
            if (newId !== activeRequestId && newId > 0) {
                setActiveRequestId(newId);
                loadMessagesByRequestId(newId);
            }
        } else if (activeRequestId === 0) {
            const loadLatest = async () => {
                try {
                    const requests = await serviceRequestService.getMyRequests();
                    if (requests.length > 0) {
                        const latest = requests.sort((a, b) =>
                            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
                        )[0];
                        navigate(`/messages?request=${latest.id}`, { replace: true });
                    }
                } catch (error) {
                    // Error silencioso en producción
                }
            };
            loadLatest();
        }
    }, [searchParams]);

    useEffect(() => {
        messages.forEach(msg => {
            const audio = document.getElementById(`audio-${msg.id}`) as HTMLAudioElement;
            if (audio) {
                audioRefs.current[msg.id] = audio;
                audio.onended = () => setPlayingAudioId(null);
            }
        });
    }, [messages]);

    if (!currentUserId) {
        return (
            <div className="flex h-screen bg-black items-center justify-center">
                <Loader2 size={32} className="animate-spin text-subtitle/40" />
            </div>
        );
    }

    if (!activeRequestId) {
        return (
            <div className="flex h-screen bg-black text-light overflow-hidden">
                <Sidebar userType={role} isCollapsed={true} />
                <main className="flex-1 flex overflow-hidden">
                    <div className="w-80 shrink-0 border-r border-white/5">
                        <ChatList
                            userType={role}
                            activeChatId={activeRequestId}
                            onSelectChat={handleSelectChat}
                        />
                    </div>
                    <div className="flex-1 flex items-center justify-center">
                        <div className="text-center opacity-40">
                            <MessageCircle size={48} className="mx-auto mb-3" />
                            <p className="text-[11px] font-black uppercase">Cargando conversaciones...</p>
                        </div>
                    </div>
                </main>
            </div>
        );
    }

    const otherParty = currentRequest ? (
        role === 'artist' ? currentRequest.producer : currentRequest.artist
    ) : null;

    return (
        <div className="flex h-screen bg-black text-light overflow-hidden">
            <Sidebar userType={role} isCollapsed={true} />

            <main className="flex-1 flex overflow-hidden">
                <div className="w-80 shrink-0 border-r border-white/5">
                    <ChatList
                        userType={role}
                        activeChatId={activeRequestId}
                        onSelectChat={handleSelectChat}
                    />
                </div>

                <div className="flex-1 flex flex-col bg-[#08080a]">
                    <ChatHeader
                        userType={role}
                        activeChatId={otherParty?.id}
                        requestData={currentRequest}
                    />

                    <div className="flex-1 overflow-y-auto p-4 space-y-3">
                        {isLoading ? (
                            <div className="flex-1 flex items-center justify-center">
                                <Loader2 size={24} className="animate-spin text-subtitle/40" />
                            </div>
                        ) : error ? (
                            <div className="flex-1 flex flex-col items-center justify-center">
                                <p className="text-error text-xs">{error}</p>
                                <button
                                    onClick={() => loadMessagesByRequestId(activeRequestId)}
                                    className="mt-2 text-[10px] text-subtitle/40"
                                >
                                    Reintentar
                                </button>
                            </div>
                        ) : messages.length === 0 ? (
                            <div className="flex-1 flex flex-col items-center justify-center opacity-40">
                                <Terminal size={24} className="mb-2" />
                                <p className="text-[10px]">No hay mensajes aún</p>
                                <p className="text-[8px] text-subtitle/40 mt-1">
                                    {currentRequest?.status === 'pending'
                                        ? 'Esperando respuesta...'
                                        : 'Envía un mensaje para comenzar'}
                                </p>
                            </div>
                        ) : (
                            messages.map(msg => (
                                <MessageBubble
                                    key={msg.id}
                                    message={msg}
                                    isOwn={msg.senderId === currentUserId}
                                    timestamp={new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                    role={role}
                                    onPlayAudio={handlePlayAudio}
                                    isPlaying={playingAudioId === msg.id}
                                />
                            ))
                        )}
                    </div>

                    <div className="p-3 border-t border-white/10">
                        <MessageInput
                            userType={role}
                            onSendMessage={handleSendMessage}
                            disabled={!activeRequestId}
                        />
                    </div>
                </div>
            </main>
        </div>
    );
};

export default MessagePage;
