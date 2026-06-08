import api from './api';

export interface BeatDataPayload {
    title: string;
    genre?: string;
    price: number;
    coverUrl?: string | null;
    taggedAudioUrl: string | null;
    untaggedAudioUrl: string | null;
    bpm?: number;
    keySignature?: string;
}

export interface BeatResponse {
    id: number;
    title: string;
    genre: string | null;
    price: string;
    cloudinaryUrl: string;
    taggedAudioUrl: string | null;
    untaggedAudioUrl: string | null;
    bpm: number | null;
    keySignature: string | null;
    isSold: boolean;
    isFeatured: boolean;
    producer?: {
        id: number;
        fullName: string;
    };
    createdAt?: string;
}

export interface PurchasedBeat {
    id: number;
    beatId: number;
    title: string;
    genre: string;
    bpm: number;
    keySignature: string;
    pricePaid: string;
    licenseType: string;
    purchaseDate: string;
    downloadUrl: string;
    taggedAudioUrl: string;
    coverUrl: string;
    producer: {
        id: number;
        name: string;
    };
}

export const beatService = {
    getMyFeaturedBeat: async (): Promise<BeatResponse | null> => {
        const response = await api.get('/beats/featured');
        return response.data;
    },

    saveFeaturedBeat: async (beatPayload: BeatDataPayload): Promise<any> => {
        const payload = {
            ...beatPayload,
            price: typeof beatPayload.price === 'string'
                ? parseFloat(beatPayload.price)
                : beatPayload.price
        };
        const response = await api.post('/beats/featured', payload);
        return response.data;
    },

    getMyBeats: async (): Promise<BeatResponse[]> => {
        const response = await api.get('/beats/my-beats');
        return response.data;
    },

    getProducerBeats: async (producerId: number): Promise<BeatResponse[]> => {
        const response = await api.get(`/beats/producer/${producerId}`);
        return response.data;
    },

    getBeatById: async (beatId: number): Promise<BeatResponse> => {
        const response = await api.get(`/beats/${beatId}`);
        return response.data;
    },

    createBeat: async (beatPayload: BeatDataPayload): Promise<any> => {
        const payload = {
            ...beatPayload,
            price: typeof beatPayload.price === 'string'
                ? parseFloat(beatPayload.price)
                : beatPayload.price
        };
        const response = await api.post('/beats', payload);
        return response.data;
    },

    deleteBeat: async (beatId: number): Promise<any> => {
        const response = await api.delete(`/beats/${beatId}`);
        return response.data;
    },

    markAsSold: async (beatId: number): Promise<any> => {
        const response = await api.patch(`/beats/${beatId}/sold`);
        return response.data;
    },

    setFeaturedBeat: async (beatId: number): Promise<any> => {
        const response = await api.patch(`/beats/${beatId}/featured`);
        return response.data;
    },

    purchaseBeat: async (beatId: number, licenseType: string = 'standard'): Promise<any> => {
        const response = await api.post('/beat-purchases', {
            beatId,
            licenseType
        });
        return response.data;
    },

    getMyPurchasedBeats: async (): Promise<PurchasedBeat[]> => {
        const response = await api.get('/beat-purchases/my-library');
        return response.data;
    },
};