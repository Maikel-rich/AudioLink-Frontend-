import api from '@/services/api';
import { studioService, StudioServiceUI } from './studioService';

export interface ProducerData {
    id: number;
    email: string;
    fullName: string | null;
    profilePicture: string | null;
    avatarUrl?: string | null;
    bio: string | null;
    skills: string[] | null;
    genres?: string[] | null;
    yearsExperience: number | null;
    totalStreams: string | null;
    type?: string;
    price?: number;
    minPrice?: number | null;
    services: StudioServiceUI[];
}

const normalizeGenres = (genres: unknown): string[] => {
    if (!genres) return [];
    if (Array.isArray(genres)) return genres;
    if (typeof genres === 'string') {
        try {
            const parsed = JSON.parse(genres);
            return Array.isArray(parsed) ? parsed : [];
        } catch {
            return genres.split(',').map(g => g.trim()).filter(g => g);
        }
    }
    return [];
};

export const producerService = {
    async getAllProducers(): Promise<ProducerData[]> {
        const response = await api.get('/producers');

        return response.data.map((producer: any) => {
            const genres = normalizeGenres(producer.skills || producer.genres);
            return {
                ...producer,
                price: producer.minPrice !== null ? Number(producer.minPrice) : 0,
                skills: genres,
                genres: genres,
                services: studioService.mapBackendServices(producer.services)
            };
        });
    },

    async getProducerById(id: string | number): Promise<ProducerData> {
        const response = await api.get(`/producers/${id}`);
        const data = response.data;

        const genres = normalizeGenres(data.skills || data.genres);

        return {
            ...data,
            skills: genres,
            genres: genres,
            services: studioService.mapBackendServices(data.services)
        };
    },

    async getMyProfile(): Promise<ProducerData> {
        const response = await api.get('/producers/me');
        const data = response.data;

        const genres = normalizeGenres(data.genres || data.skills);

        return {
            ...data,
            skills: genres,
            genres: genres,
            services: studioService.mapBackendServices(data.services)
        };
    },

    async updateMyProfile(data: {
        fullName?: string;
        bio?: string;
        avatarUrl?: string | null;
        genres?: string[];
    }) {
        const payload: any = {};

        if (data.fullName !== undefined) payload.fullName = data.fullName;
        if (data.bio !== undefined) payload.bio = data.bio;
        if (data.avatarUrl !== undefined) payload.avatarUrl = data.avatarUrl;
        if (data.genres !== undefined) payload.genres = data.genres;

        const response = await api.put('/producers/me/update', payload);
        return response.data;
    }
};