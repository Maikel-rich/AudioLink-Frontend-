import { Navigate, Outlet, useLocation } from "react-router-dom";
import { authService } from "@/services/authService";
import { ROUTES, ARTIST_ONLY_ROUTES, PRODUCER_ONLY_ROUTES } from "@/constants/routes";

const ProtectedRoute = () => {
    const location = useLocation();

    const token = localStorage.getItem('token');
    if (!token) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    const currentRole = authService.getUserRoleLocal();
    const currentPath = location.pathname;

    if (currentRole === 'artist') {
        const isTryingToAccessProducerZone = PRODUCER_ONLY_ROUTES.some(route => {
            const regexPath = new RegExp(`^${route.replace(':id', '[^/]+')}$`);
            return regexPath.test(currentPath);
        });

        if (isTryingToAccessProducerZone) {
            return <Navigate to={ROUTES.SEARCH} replace />;
        }
    }

    if (currentRole === 'producer') {
        const isTryingToAccessArtistZone = ARTIST_ONLY_ROUTES.some(route => {
            const safeRoutePattern = route.replace(':id', '(?!proposals\\b|profile\\b)[^/]+');
            const regexPath = new RegExp(`^${safeRoutePattern}$`);
            return regexPath.test(currentPath);
        });

        if (isTryingToAccessArtistZone) {
            return <Navigate to={ROUTES.MY_STUDIO} replace />;
        }
    }

    return <Outlet />;
};

export default ProtectedRoute;