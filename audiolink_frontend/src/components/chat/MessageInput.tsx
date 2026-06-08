import React, { useState, useRef } from 'react';
import { Paperclip, Send, Mic, Music, X, Loader2 } from 'lucide-react';
import { cloudinaryService } from '@/services/cloudinaryService';

interface MessageInputProps {
    userType: 'artist' | 'producer';
    onSendMessage?: (text: string, fileUrl?: string, fileType?: string) => void;
}

const MessageInput = ({ userType, onSendMessage }: MessageInputProps) => {
    const [text, setText] = useState<string>('');
    const [isUploading, setIsUploading] = useState(false);
    const [uploadProgress, setUploadProgress] = useState(0);
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [filePreview, setFilePreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const focusBorder = userType === 'artist' ? 'focus-within:border-artist/40' : 'focus-within:border-producer/40';
    const buttonBg = userType === 'artist'
        ? 'bg-artist hover:bg-artist/90 text-white shadow-artist/10'
        : 'bg-producer hover:bg-producer/90 text-black shadow-producer/10';

    const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const validTypes = ['audio/mpeg', 'audio/mp3', 'audio/wav', 'audio/x-wav', 'audio/m4a', 'audio/aac'];
        if (!validTypes.includes(file.type) && !file.name.match(/\.(mp3|wav|m4a|aac|ogg)$/i)) {
            return;
        }

        if (file.size > 50 * 1024 * 1024) {
            return;
        }

        setSelectedFile(file);

        const fileName = file.name.length > 30 ? file.name.substring(0, 27) + '...' : file.name;
        setFilePreview(fileName);
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        setIsUploading(true);
        setUploadProgress(0);

        try {
            const progressInterval = setInterval(() => {
                setUploadProgress(prev => Math.min(prev + 10, 90));
            }, 200);

            const uploadedUrl = await cloudinaryService.uploadFileSecure(selectedFile);

            clearInterval(progressInterval);
            setUploadProgress(100);

            setTimeout(async () => {
                if (onSendMessage) {
                    const fileType = selectedFile.type.includes('mp3') || selectedFile.name.endsWith('.mp3') ? 'mp3' : 'wav';
                    const messageText = text.trim() || `📁 Archivo de audio: ${selectedFile.name}`;
                    await onSendMessage(messageText, uploadedUrl, fileType);
                }

                setText('');
                setSelectedFile(null);
                setFilePreview(null);
                setUploadProgress(0);
                setIsUploading(false);

                if (fileInputRef.current) {
                    fileInputRef.current.value = '';
                }
            }, 500);

        } catch (error) {
            setIsUploading(false);
            setUploadProgress(0);
        }
    };

    const handleCancelUpload = () => {
        setSelectedFile(null);
        setFilePreview(null);
        setUploadProgress(0);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSend = () => {
        if (!text.trim() && !selectedFile) return;

        if (selectedFile && !isUploading) {
            handleUpload();
        } else if (text.trim()) {
            onSendMessage?.(text.trim());
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
        <div className="px-6 py-4 bg-dark/60 border-t border-white/5 backdrop-blur-md shrink-0 w-full">
            <div className="max-w-6xl mx-auto">
                {selectedFile && (
                    <div className="mb-3 p-3 bg-black/40 rounded-xl border border-white/10">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <Music size={20} className="text-artist" />
                                <div>
                                    <p className="text-[10px] font-bold text-light">{filePreview}</p>
                                    <p className="text-[8px] text-subtitle/40">
                                        {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
                                    </p>
                                </div>
                            </div>
                            {!isUploading && (
                                <button
                                    onClick={handleCancelUpload}
                                    className="p-1 text-subtitle/40 hover:text-error transition-colors"
                                >
                                    <X size={16} />
                                </button>
                            )}
                        </div>
                        {isUploading && (
                            <div className="mt-2">
                                <div className="flex justify-between text-[8px] text-subtitle/40 mb-1">
                                    <span>Subiendo archivo...</span>
                                    <span>{uploadProgress}%</span>
                                </div>
                                <div className="w-full h-1 bg-white/10 rounded-full overflow-hidden">
                                    <div
                                        className="h-full bg-artist rounded-full transition-all duration-300"
                                        style={{ width: `${uploadProgress}%` }}
                                    />
                                </div>
                            </div>
                        )}
                    </div>
                )}

                <div className="flex items-end gap-3">
                    <div className="relative">
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="audio/*"
                            onChange={handleFileSelect}
                            className="hidden"
                            id="audio-upload"
                            disabled={isUploading}
                        />
                        <label
                            htmlFor="audio-upload"
                            className={`h-11 w-11 flex items-center justify-center bg-gray-dark/80 border border-white/5 rounded-xl text-subtitle/40 hover:text-light transition-all shrink-0 cursor-pointer ${isUploading ? 'opacity-50 pointer-events-none' : ''}`}
                        >
                            <Paperclip size={15} />
                        </label>
                    </div>

                    <div className={`flex-1 min-h-11 flex items-center bg-gray-dark/40 border border-white/5 rounded-xl transition-all px-4 ${focusBorder}`}>
                        <textarea
                            value={text}
                            onChange={(e) => setText(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={selectedFile ? "Añade un comentario (opcional)..." : "Escribe un mensaje o adjunta un archivo..."}
                            className="flex-1 bg-transparent border-none outline-none focus:ring-0 focus:ring-offset-0 text-xs font-semibold text-light py-3.5 resize-none placeholder:text-subtitle/20 leading-snug max-h-24 custom-scrollbar"
                            rows={1}
                            style={{ height: '42px' }}
                            disabled={isUploading}
                        />
                        <div className="flex items-center ml-2 shrink-0">
                            <button disabled className="p-1.5 text-subtitle/5 cursor-not-allowed">
                                <Mic size={15} />
                            </button>
                        </div>
                    </div>

                    <button
                        onClick={handleSend}
                        disabled={(!text.trim() && !selectedFile) || isUploading}
                        className={`h-11 w-11 flex items-center justify-center rounded-xl active:scale-[0.97] transition-all cursor-pointer group shadow-lg shrink-0 mb-[1px] ${buttonBg} disabled:opacity-50 disabled:cursor-not-allowed`}
                    >
                        {isUploading ? (
                            <Loader2 size={15} className="animate-spin" />
                        ) : (
                            <Send size={15} strokeWidth={2.5} className="group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default MessageInput;