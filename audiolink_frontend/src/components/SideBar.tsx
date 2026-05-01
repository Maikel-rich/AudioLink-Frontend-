import { Link, useLocation } from 'react-router-dom';
import {
    Compass, Layers, MessageSquare, Library,
    Send, CheckCircle2, Settings, LogOut, LucideIcon
} from 'lucide-react';
import AudioLinkLogo from '@/svg/AudioLinkLogo';

import { ROUTES } from "@/constants/routes";

type UserRole = 'artist' | 'producer';

interface SidebarProps {
    userType: UserRole;
    isCollapsed?: boolean;
    hasMessages?: boolean;
}

interface NavItemProps {
    icon: LucideIcon;
    label: string;
    to: string;
    active?: boolean;
    badge?: boolean;
    userType: UserRole;
    isLogout?: boolean;
    isCollapsed?: boolean;
}

const NavItem = ({ icon: Icon, label, to, active, badge, userType, isLogout, isCollapsed }: NavItemProps) => {
    const activeStyles = userType === 'artist'
        ? 'bg-artist-muted text-artist border-l-4 border-artist'
        : 'bg-producer-dark text-producer border-l-4 border-producer';

    const hoverStyles = isLogout
        ? 'hover:bg-error/10 text-error'
        : 'hover:bg-gray-light text-subtitle hover:text-light';

    return (
        <Link to={to} className="no-underline">
            <div className={`
                flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'} px-6 py-3 cursor-pointer transition-all duration-200
                ${active ? activeStyles : hoverStyles}
                ${isCollapsed ? 'px-0 border-l-0' : ''}
            `}>
                <div className="flex items-center gap-3">
                    <Icon size={20} className="min-w-5" />
                    {!isCollapsed && (
                        <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
                            {label}
                        </span>
                    )}
                </div>

                {badge && !isCollapsed && (
                    <div className={`w-2 h-2 rounded-full ${userType === 'artist' ? 'bg-artist' : 'bg-producer'}`} />
                )}
            </div>
        </Link>
    );
};

const Sidebar = ({ userType = 'artist', isCollapsed = false, hasMessages = false }: SidebarProps) => {
    const location = useLocation();
    const logoColor = userType === 'artist' ? '#3b82f6' : '#eab308';

    const isActive = (path: string) => location.pathname === path;

    return (
        <aside className={`
            ${isCollapsed ? 'w-20' : 'w-72'} 
            h-screen bg-dark flex flex-col border-r border-gray-light transition-all duration-300 ease-in-out
        `}>
            {/* Sección Logo */}
            <div className={`p-8 mb-4 ${isCollapsed ? 'px-0 flex justify-center' : ''}`}>
                <div className="flex items-center gap-3">
                    <AudioLinkLogo color={logoColor} size={isCollapsed ? 42 : 48} />
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <h1 className="text-light font-bold text-xl tracking-tight leading-none">AudioLink</h1>
                            <span className={`text-[10px] uppercase font-black tracking-[0.2em] mt-1 ${userType === 'artist' ? 'text-artist' : 'text-producer'
                                }`}>
                                Estudio {userType === 'artist' ? 'Artista' : 'Productor'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Navegación principal */}
            <nav className="flex-1 flex flex-col gap-1">
                <NavItem
                    icon={Compass} label="Descubrir"
                    to={ROUTES.SEARCH} active={isActive(ROUTES.SEARCH)}
                    userType={userType} isCollapsed={isCollapsed}
                />
                <NavItem
                    icon={Layers} label="Proyectos"
                    to={ROUTES.PROJECTS} active={isActive(ROUTES.PROJECTS)}
                    userType={userType} isCollapsed={isCollapsed}
                />
                <NavItem
                    icon={MessageSquare} label="Mensajes"
                    to={ROUTES.MESSAGES} active={isActive(ROUTES.MESSAGES)}
                    badge={hasMessages}
                    userType={userType} isCollapsed={isCollapsed}
                />
                <NavItem
                    icon={Library} label="Biblioteca"
                    to={ROUTES.LIBRARY} active={isActive(ROUTES.LIBRARY)}
                    userType={userType} isCollapsed={isCollapsed}
                />
                <NavItem
                    icon={Send} label="Propuestas enviadas"
                    to={ROUTES.SENT_PROPOSALS} active={isActive(ROUTES.SENT_PROPOSALS)}
                    userType={userType} isCollapsed={isCollapsed}
                />
                <NavItem
                    icon={CheckCircle2} label="Proyectos terminados"
                    to={ROUTES.FINISHED_PROJECTS} active={isActive(ROUTES.FINISHED_PROJECTS)}
                    userType={userType} isCollapsed={isCollapsed}
                />
            </nav>

            {/* Acciones Bottom */}
            <div className="mt-auto border-t border-gray-light py-4">
                <NavItem
                    icon={Settings} label="Ajustes"
                    to={ROUTES.SETTINGS} active={isActive(ROUTES.SETTINGS)}
                    userType={userType} isCollapsed={isCollapsed}
                />
                <NavItem
                    icon={LogOut} label="Cerrar Sesión"
                    to={ROUTES.LOGIN}
                    userType={userType} isLogout isCollapsed={isCollapsed}
                />
            </div>
        </aside>
    );
};

export default Sidebar;