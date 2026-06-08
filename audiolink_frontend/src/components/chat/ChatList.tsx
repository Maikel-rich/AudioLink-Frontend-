import React, { useState, useEffect } from 'react';
import { Search, Loader2, MessageCircle, FolderOpen } from 'lucide-react';
import { serviceRequestService, ServiceRequest } from '@/services/serviceRequestService';
import { authService } from '@/services/authService';
import { useNavigate } from 'react-router-dom';

interface ChatListProps {
    userType: 'artist' | 'producer';
    activeChatId: number;
    onSelectChat: (chatId: number, requestId: number) => void;
}

interface ChatContact {
    id: number;
    requestId: number;
    name: string;
    avatar: string | null;
    lastMessage: string;
    lastMessageTime: string;
    unread: boolean;
    role: 'artist' | 'producer';
    serviceName: string;
    status: string;
    createdAt: string;
}

const ChatList = ({ userType, activeChatId, onSelectChat }: ChatListProps) => {
    const navigate = useNavigate();
    const [contacts, setContacts] = useState<ChatContact[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [search, setSearch] = useState('');

    const loadContacts = async () => {
        try {
            setIsLoading(true);
            const requests = await serviceRequestService.getMyRequests();

            const contactsList: ChatContact[] = [];

            requests.forEach(req => {
                const otherParty = userType === 'artist' ? req.producer : req.artist;
                const otherPartyId = otherParty.id;

                contactsList.push({
                    id: otherPartyId,
                    requestId: req.id,
                    name: otherParty.name,
                    avatar: otherParty.avatar,
                    lastMessage: req.message || (req.status === 'pending' ? 'Solicitud pendiente' : 'Conversación iniciada'),
                    lastMessageTime: new Date(req.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                    unread: req.status === 'pending',
                    role: userType === 'artist' ? 'producer' : 'artist',
                    serviceName: req.service.name,
                    status: req.status,
                    createdAt: req.createdAt
                });
            });

            contactsList.sort((a, b) =>
                new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            );

            setContacts(contactsList);
        } catch (error) {
            // Error silencioso en producción
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        loadContacts();
    }, [userType]);

    const filteredContacts = contacts.filter(contact =>
        contact.name.toLowerCase().includes(search.toLowerCase()) ||
        contact.serviceName.toLowerCase().includes(search.toLowerCase())
    );

    const activeTextTheme = userType === 'artist' ? 'text-artist' : 'text-producer';

    const handleSelect = (contact: ChatContact) => {
        onSelectChat(contact.id, contact.requestId);
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'pending': return 'bg-yellow-500/20 text-yellow-400';
            case 'accepted': return 'bg-blue-500/20 text-blue-400';
            case 'rejected': return 'bg-red-500/20 text-red-400';
            case 'in_progress': return 'bg-purple-500/20 text-purple-400';
            case 'completed': return 'bg-green-500/20 text-green-400';
            default: return 'bg-gray-500/20 text-gray-400';
        }
    };

    const getStatusText = (status: string) => {
        switch (status) {
            case 'pending': return 'Pendiente';
            case 'accepted': return 'Aceptada';
            case 'rejected': return 'Rechazada';
            case 'in_progress': return 'En progreso';
            case 'completed': return 'Completada';
            default: return status;
        }
    };

    return (
        <div className="w-80 h-full border-r border-white/5 flex flex-col bg-dark shrink-0">
            <div className="p-4 border-b border-white/5 bg-dark/50">
                <h2 className="text-xs font-black text-light tracking-widest uppercase mb-3">Mis Conversaciones</h2>
                <div className="relative flex items-center bg-gray-dark border border-white/5 rounded-xl px-3 focus-within:border-white/10 transition-colors">
                    <Search size={14} className="text-subtitle/30 shrink-0" />
                    <input
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Buscar por artista, productor o servicio..."
                        className="w-full bg-transparent border-0 outline-0 text-xs text-light py-2.5 px-2 placeholder:text-subtitle/20 font-medium"
                    />
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <Loader2 className="animate-spin text-subtitle/40" size={20} />
                    </div>
                ) : filteredContacts.length === 0 ? (
                    <div className="text-center py-12">
                        <MessageCircle size={32} className="mx-auto text-subtitle/20 mb-2" />
                        <p className="text-[10px] text-subtitle/40">No hay conversaciones</p>
                        <p className="text-[8px] text-subtitle/30 mt-1">
                            {userType === 'producer'
                                ? 'Cuando un artista te envíe una solicitud, aparecerá aquí'
                                : 'Envía una solicitud a un productor para comenzar'}
                        </p>
                    </div>
                ) : (
                    filteredContacts.map((contact) => {
                        const isSelected = contact.requestId === activeChatId;
                        return (
                            <div
                                key={contact.requestId}
                                onClick={() => handleSelect(contact)}
                                className={`p-3 rounded-xl cursor-pointer transition-all group border
                                    ${isSelected
                                        ? (userType === 'artist' ? 'bg-artist/5 border-artist/15' : 'bg-producer/5 border-producer/15')
                                        : 'bg-transparent border-transparent hover:bg-white/2 hover:border-white/5'}`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="relative shrink-0 w-10 h-10">
                                        {contact.avatar ? (
                                            <img
                                                src={contact.avatar}
                                                className="w-full h-full rounded-full object-cover border border-white/10"
                                                alt={contact.name}
                                            />
                                        ) : (
                                            <div className={`w-full h-full rounded-full flex items-center justify-center text-sm font-black uppercase
                                                ${userType === 'artist' ? 'bg-artist/20 text-artist' : 'bg-producer/20 text-producer'}`}>
                                                {contact.name[0]?.toUpperCase() || '?'}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between items-baseline">
                                            <h4 className={`text-xs font-black uppercase truncate ${isSelected ? activeTextTheme : 'text-light'}`}>
                                                {contact.name}
                                            </h4>
                                            <span className="text-[7px] font-mono text-subtitle/40">{contact.lastMessageTime}</span>
                                        </div>
                                        <p className="text-[8px] font-medium text-subtitle/60 truncate mt-0.5">
                                            {contact.serviceName}
                                        </p>
                                        <div className="flex items-center justify-between mt-1">
                                            <span className={`text-[7px] px-1.5 py-0.5 rounded-full ${getStatusColor(contact.status)}`}>
                                                {getStatusText(contact.status)}
                                            </span>
                                            {contact.unread && (
                                                <div className="w-2 h-2 rounded-full bg-artist" />
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })
                )}
            </div>
        </div>
    );
};

export default ChatList;