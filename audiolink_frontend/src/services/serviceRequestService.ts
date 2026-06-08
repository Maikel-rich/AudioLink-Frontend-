import api from './api';

export interface ServiceRequest {
    id: number;
    artist: {
        id: number;
        name: string;
        avatar: string | null;
    };
    producer: {
        id: number;
        name: string;
        avatar: string | null;
    };
    service: {
        id: number;
        name: string;
        price: number;
    };
    status: 'pending' | 'accepted' | 'rejected' | 'in_progress' | 'completed' | 'cancelled';
    message: string | null;
    projectDetails: string | null;
    amount: string;
    isPaid: 0 | 1 | 2;
    createdAt: string;
    updatedAt?: string;
}

export interface ChatMessage {
    id: number;
    requestId: number;
    senderId: number;
    senderName: string;
    senderRole: 'producer' | 'artist';
    message: string;
    isRead: boolean;
    createdAt: string;
}

export interface ProposalData {
    id: number;
    title: string;
    status: 'active' | 'pending' | 'rejected' | 'completed';
    is_paid: 0 | 1 | 2;
    created_at: string;
    progress_percentage: number;
    current_stage_name: string | null;
    producer: {
        full_name: string;
        avatar_url: string | null;
    };
    service_name: string;
    amount: number;
}

const mapStatus = (status: string): 'active' | 'pending' | 'rejected' | 'completed' => {
    switch (status) {
        case 'pending':
            return 'pending';
        case 'accepted':
            return 'active';
        case 'rejected':
            return 'rejected';
        case 'in_progress':
            return 'active';
        case 'completed':
            return 'completed';
        default:
            return 'pending';
    }
};

export const getPaymentStatusLabel = (isPaid: 0 | 1 | 2): string => {
    switch (isPaid) {
        case 0:
            return 'PENDIENTE PAGO';
        case 1:
            return 'ADELANTO PAGADO';
        case 2:
            return 'PAGO COMPLETO';
        default:
            return 'PENDIENTE PAGO';
    }
};

export const getPaymentStatusColor = (isPaid: 0 | 1 | 2): string => {
    switch (isPaid) {
        case 0:
            return 'text-error bg-error/10 border-error/20';
        case 1:
            return 'text-yellow-400 bg-yellow-400/10 border-yellow-400/20';
        case 2:
            return 'text-success bg-success/10 border-success/20';
        default:
            return 'text-error bg-error/10 border-error/20';
    }
};

export const getPaymentStatusIcon = (isPaid: 0 | 1 | 2) => {
    switch (isPaid) {
        case 0:
            return '⏳';
        case 1:
            return '💳';
        case 2:
            return '✅';
        default:
            return '⏳';
    }
};

const getStageName = (status: string): string => {
    switch (status) {
        case 'pending':
            return 'Revisión de propuesta';
        case 'accepted':
            return 'Pendiente de pago';
        case 'in_progress':
            return 'En producción';
        case 'completed':
            return 'Finalizado';
        default:
            return 'Procesando';
    }
};

const mapToProposal = (req: ServiceRequest): ProposalData => ({
    id: req.id,
    title: req.service.name,
    status: mapStatus(req.status),
    is_paid: req.isPaid,
    created_at: new Date(req.createdAt).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' }).toUpperCase(),
    progress_percentage: req.status === 'accepted' ? 25 : req.status === 'in_progress' ? 50 : req.status === 'completed' ? 100 : 0,
    current_stage_name: getStageName(req.status),
    producer: {
        full_name: req.producer.name,
        avatar_url: req.producer.avatar
    },
    service_name: req.service.name,
    amount: parseFloat(req.amount)
});

export const serviceRequestService = {
    createRequest: async (data: { producerId: number; serviceId: number; message?: string; projectDetails?: string }): Promise<any> => {
        const response = await api.post('/requests', data);
        return response.data;
    },

    getMyRequests: async (): Promise<ServiceRequest[]> => {
        const response = await api.get('/requests');
        return response.data;
    },

    getMyProposals: async (): Promise<ProposalData[]> => {
        const requests = await serviceRequestService.getMyRequests();
        return requests.map(mapToProposal);
    },

    getRequestById: async (requestId: number): Promise<ServiceRequest> => {
        const response = await api.get(`/requests/${requestId}`);
        return response.data;
    },

    acceptRequest: async (requestId: number): Promise<any> => {
        const response = await api.patch(`/requests/${requestId}/accept`);
        return response.data;
    },

    rejectRequest: async (requestId: number): Promise<any> => {
        const response = await api.patch(`/requests/${requestId}/reject`);
        return response.data;
    },

    payDeposit: async (requestId: number): Promise<any> => {
        const response = await api.post(`/requests/${requestId}/pay-deposit`);
        return response.data;
    },

    payRemaining: async (requestId: number): Promise<any> => {
        const response = await api.post(`/requests/${requestId}/pay-remaining`);
        return response.data;
    },

    getPaymentStatus: async (requestId: number): Promise<any> => {
        const response = await api.get(`/requests/${requestId}/payment-status`);
        return response.data;
    },

    getMessages: async (requestId: number): Promise<ChatMessage[]> => {
        const response = await api.get(`/chat/request/${requestId}`);
        return response.data.messages || [];
    },

    sendMessage: async (requestId: number, message: string): Promise<any> => {
        const response = await api.post(`/chat/request/${requestId}/send`, { message });
        return response.data;
    }
};