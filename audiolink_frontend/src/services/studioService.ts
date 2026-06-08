import api from '@/services/api';

export interface StudioServiceUI {
    id: any;
    title: string;
    price: string;
    description: string;
    features: string[];
}

export interface SymfonyServiceItem {
    id?: number;
    name: string;
    price: number;
    description: string | null;
    deliveryTimeDays?: number | null;
}

export const studioService = {
    mapBackendServices(services: SymfonyServiceItem[] | null | undefined): StudioServiceUI[] {
        return (services || []).map((service) => ({
            id: service.id,
            title: service.name || "Servicio sin título",
            price: service.price ? service.price.toString() : "0.00",
            description: service.description || "",
            features: []
        }));
    },

    async getServicesByProducer(producerId: number | string): Promise<StudioServiceUI[]> {
        const response = await api.get(`/services/producer/${producerId}`);
        return this.mapBackendServices(response.data);
    },

    async syncProducerServices(producerId: number, services: StudioServiceUI[]): Promise<any> {
        const payload = {
            services: services.map(s => {
                const isNew = typeof s.id === 'string' && (s.id.includes('new') || isNaN(Number(s.id)));

                return {
                    id: isNew ? null : Number(s.id),
                    name: s.title || 'Nuevo Servicio',
                    price: parseFloat(s.price) || 0.00,
                    description: s.description || null,
                    deliveryTimeDays: 3
                };
            })
        };

        const response = await api.put(`/services/producer/${producerId}/sync`, payload);
        return response.data;
    }
};