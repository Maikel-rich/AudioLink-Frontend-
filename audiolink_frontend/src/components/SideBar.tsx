import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
    Compass, Layers, MessageSquare, Library,
    Send, Settings, LogOut, LucideIcon, Download, User
} from 'lucide-react';
import AudioLinkLogo from '@/svg/AudioLinkLogo';

import { ROUTES } from "@/constants/routes";
import { authService } from '@/services/authService';

type UserRole = 'artist' | 'producer';

interface SidebarProps {
    userType?: UserRole;
    isCollapsed?: boolean;
}

interface NavItemProps {
    icon: LucideIcon;
    label: string;
    to: string;
    active?: boolean;
    userType: UserRole;
    isLogout?: boolean;
    isCollapsed?: boolean;
    onClick?: () => void;
}

const NavItem = ({ icon: Icon, label, to, active, userType, isLogout, isCollapsed, onClick }: NavItemProps) => {
    const activeStyles = userType === 'artist'
        ? 'bg-artist-muted text-artist border-l-4 border-artist'
        : 'bg-producer-dark text-producer border-l-4 border-producer';

    const hoverStyles = isLogout
        ? 'hover:bg-error/10 text-error'
        : 'hover:bg-gray-light text-subtitle hover:text-light';

    const content = (
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
        </div>
    );

    if (onClick) {
        return (
            <button onClick={onClick} className="w-full text-left bg-transparent border-0 p-0 outline-none block">
                {content}
            </button>
        );
    }

    return (
        <Link to={to} className="no-underline">
            {content}
        </Link>
    );
};

const Sidebar = ({ userType: propUserType, isCollapsed = false }: SidebarProps) => {
    const location = useLocation();
    const navigate = useNavigate();

    const [role, setRole] = useState<UserRole>(() => {
        return (authService.getUserRoleLocal?.() as UserRole) || propUserType || 'artist';
    });

    useEffect(() => {
        const verifyRoleWithServer = async () => {
            try {
                if (authService.getMe) {
                    await authService.getMe();
                    const currentRole = authService.getUserRoleLocal?.() as UserRole;
                    if (currentRole && currentRole !== role) {
                        setRole(currentRole);
                    }
                }
            } catch (err) {
                // Error silencioso en producción
            }
        };

        verifyRoleWithServer();
    }, [role]);

    const logoColor = role === 'artist' ? '#3b82f6' : '#eab308';
    const isActive = (path: string) => location.pathname === path;

    const handleLogout = () => {
        authService.logout();
        navigate(ROUTES.LOGIN || '/login');
    };

    return (
        <aside className={`
            ${isCollapsed ? 'w-20' : 'w-72'} 
            h-screen bg-dark flex flex-col border-r border-gray-light transition-all duration-300 ease-in-out shrink-0 z-30
        `}>
            <div className={`p-8 mb-4 ${isCollapsed ? 'px-0 flex justify-center' : ''}`}>
                <div className="flex items-center gap-3">
                    <AudioLinkLogo color={logoColor} size={isCollapsed ? 42 : 48} />
                    {!isCollapsed && (
                        <div className="flex flex-col">
                            <h1 className="text-light font-bold text-xl tracking-tight leading-none">AudioLink</h1>
                            <span className={`text-[10px] uppercase font-black tracking-[0.2em] mt-1 transition-colors ${role === 'artist' ? 'text-artist' : 'text-producer'
                                }`}>
                                Estudio {role === 'artist' ? 'Artista' : 'Productor'}
                            </span>
                        </div>
                    )}
                </div>
            </div>

            <nav className="flex-1 flex flex-col gap-1">
                {role === 'artist' ? (
                    <>
                        <NavItem
                            icon={Compass} label="Descubrir"
                            to={ROUTES.SEARCH} active={isActive(ROUTES.SEARCH)}
                            userType={role} isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={Layers} label="Proyectos"
                            to={ROUTES.PROJECTS} active={isActive(ROUTES.PROJECTS)}
                            userType={role} isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={MessageSquare} label="Mensajes"
                            to={ROUTES.MESSAGES} active={isActive(ROUTES.MESSAGES)}
                            userType={role} isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={Library} label="Biblioteca"
                            to={ROUTES.FINISHED_PROJECTS} active={isActive(ROUTES.FINISHED_PROJECTS)}
                            userType={role} isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={Send} label="Propuestas enviadas"
                            to={ROUTES.SENT_PROPOSALS} active={isActive(ROUTES.SENT_PROPOSALS)}
                            userType={role} isCollapsed={isCollapsed}
                        />
                    </>
                ) : (
                    <>
                        <NavItem
                            icon={User} label="Mi Perfil"
                            to={ROUTES.MY_STUDIO || "/producer/profile"} active={isActive(ROUTES.MY_STUDIO)}
                            userType={role} isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={Layers} label="Mis Proyectos"
                            to={ROUTES.PROJECTS || "/producer/projects"} active={isActive(ROUTES.PROJECTS)}
                            userType={role} isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={MessageSquare} label="Mensajes"
                            to={ROUTES.MESSAGES} active={isActive(ROUTES.MESSAGES)}
                            userType={role} isCollapsed={isCollapsed}
                        />
                        <NavItem
                            icon={Download} label="Propuestas recibidas"
                            to="/producer/proposals" active={isActive("/producer/proposals")}
                            userType={role} isCollapsed={isCollapsed}
                        />
                    </>
                )}
            </nav>

            <div className="mt-auto border-t border-gray-light py-4">
                <NavItem
                    icon={Settings} label="Ajustes"
                    to={ROUTES.SETTINGS} active={isActive(ROUTES.SETTINGS)}
                    userType={role} isCollapsed={isCollapsed}
                />
                <NavItem
                    icon={LogOut} label="Cerrar Sesión"
                    to={ROUTES.LOGIN}
                    userType={role} isLogout isCollapsed={isCollapsed}
                    onClick={handleLogout}
                />
            </div>
        </aside>
    );
};

export default Sidebar;