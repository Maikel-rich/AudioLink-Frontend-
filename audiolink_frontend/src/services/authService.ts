import api from '@/services/api';

const extractRoleFromDB = (data: any): 'artist' | 'producer' => {
    if (!data) return 'artist';

    const target = data.user || data.data || data;

    const dbRole = target.role;

    if (dbRole !== undefined && dbRole !== null) {
        const roleNum = Number(dbRole);
        if (roleNum === 0) {
            return 'producer';
        }
        return 'artist';
    }

    if (target.roles && Array.isArray(target.roles)) {
        return target.roles.includes('ROLE_PRODUCER') ? 'producer' : 'artist';
    }

    return 'artist';
};

const extractUserInfo = (data: any): { id: number; email: string; fullName: string; role: number; profilePicture: string | null } | null => {
    if (!data) return null;

    const target = data.user || data.data || data;

    if (target.id) {
        return {
            id: target.id,
            email: target.email || '',
            fullName: target.fullName || '',
            role: target.role,
            profilePicture: target.profilePicture || target.avatar_url || null
        };
    }

    return null;
};

export const authService = {
    async login(data: { email: string; password: string }) {
        const response = await api.post('/auth/login', {
            username: data.email,
            password: data.password
        });

        if (response.data?.token) {
            localStorage.setItem('token', response.data.token);

            const mappedRole = extractRoleFromDB(response.data);
            localStorage.setItem('user_role', mappedRole);

            const userInfo = extractUserInfo(response.data);
            if (userInfo) {
                localStorage.setItem('user', JSON.stringify(userInfo));
            }
        }
        return response.data;
    },

    async register(data: {
        email: string;
        password: string;
        fullName?: string;
        role: number;
        genres?: string[];
        languages?: string[]
    }) {
        const response = await api.post('/auth/register', data);
        return response.data;
    },

    async getMe() {
        const response = await api.get('/auth/me');
        if (response.data) {
            const mappedRole = extractRoleFromDB(response.data);
            localStorage.setItem('user_role', mappedRole);

            const userInfo = extractUserInfo(response.data);
            if (userInfo) {
                localStorage.setItem('user', JSON.stringify(userInfo));
            }
        }
        return response.data;
    },

    getUserRoleLocal(): 'artist' | 'producer' | null {
        return localStorage.getItem('user_role') as 'artist' | 'producer' | null;
    },

    getCurrentUser(): any | null {
        try {
            const userStr = localStorage.getItem('user');
            if (userStr) {
                return JSON.parse(userStr);
            }
        } catch (e) {
            // Error silencioso en producción
        }
        return null;
    },

    getCurrentUserId(): number | null {
        const user = this.getCurrentUser();
        return user?.id || null;
    },

    logout() {
        localStorage.removeItem('token');
        localStorage.removeItem('user_role');
        localStorage.removeItem('user');
    }
};