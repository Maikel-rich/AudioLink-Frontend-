import api from '@/services/api';

export type ProjectVisualStatus = 'In Progress' | 'Mixing' | 'Mastering' | 'Review';

export interface ProjectData {
    id: number;
    title: string;
    artist: {
        id: number;
        fullName: string | null;
        profilePicture: string | null;
    } | null;
    producer: {
        id: number;
        fullName: string | null;
        profilePicture: string | null;
    } | null;
    status: ProjectVisualStatus;
    progressPercentage: number;
    currentStageName: string | null;
    isPaid: boolean;
    createdAt?: string;
    finalAudioUrl?: string | null;
    isFinalAudioAvailable?: boolean;
}

export interface ProjectFile {
    id: number;
    projectId: number;
    name: string;
    url: string;
    size: number;
    type: string;
    uploadedAt: string;
    isFinal: boolean;
    uploadedBy: {
        id: number;
        fullName: string;
    };
}

const calculateVisualStatus = (percentage: number): ProjectVisualStatus => {
    if (percentage < 30) return 'In Progress';
    if (percentage < 60) return 'Mixing';
    if (percentage < 90) return 'Mastering';
    return 'Review';
};

export const projectService = {
    async getAllProjects(): Promise<ProjectData[]> {
        const response = await api.get('/projects');
        return response.data.map((project: any) => ({
            ...project,
            status: calculateVisualStatus(project.progressPercentage ?? 0),
            finalAudioUrl: project.finalAudioUrl,
            isFinalAudioAvailable: !!project.finalAudioUrl
        }));
    },

    async getProjectById(id: number | string): Promise<ProjectData> {
        const response = await api.get(`/projects/${id}`);
        const project = response.data;
        return {
            ...project,
            status: calculateVisualStatus(project.progressPercentage ?? 0),
            finalAudioUrl: project.finalAudioUrl,
            isFinalAudioAvailable: !!project.finalAudioUrl
        };
    },

    async createProject(payload: { title: string; artistId: number; producerId: number; status?: string }): Promise<any> {
        const response = await api.post('/projects', payload);
        return response.data;
    },

    async updateProgress(id: number, data: { progressPercentage: number; currentStageName: string; status?: string }): Promise<any> {
        const response = await api.patch(`/projects/${id}/progress`, data);
        return response.data;
    },

    async uploadFinalAudio(projectId: number, audioUrl: string): Promise<any> {
        const response = await api.post(`/projects/${projectId}/final-audio`, { finalAudioUrl: audioUrl });
        return response.data;
    },

    async downloadFinalAudio(projectId: number): Promise<{ downloadUrl: string; fileName: string }> {
        const response = await api.get(`/projects/${projectId}/final-audio/download`);
        return response.data;
    },

    async canDownloadFinalAudio(projectId: number): Promise<{ canDownload: boolean; message?: string }> {
        const response = await api.get(`/projects/${projectId}/final-audio/check`);
        return response.data;
    },

    async markAsCompleted(projectId: number): Promise<any> {
        const response = await api.patch(`/projects/${projectId}/complete`);
        return response.data;
    },

    async uploadFinalFile(projectId: number, file: File): Promise<any> {
        const formData = new FormData();
        formData.append('file', file);
        const response = await api.post(`/projects/${projectId}/files`, formData, {
            headers: { 'Content-Type': 'multipart/form-data' }
        });
        return response.data;
    },

    async getProjectFiles(projectId: number): Promise<ProjectFile[]> {
        const response = await api.get(`/projects/${projectId}/files`);
        return response.data;
    },

    async downloadFile(fileId: number): Promise<Blob> {
        const response = await api.get(`/projects/files/${fileId}/download`, {
            responseType: 'blob'
        });
        return response.data;
    },

    async deleteFile(fileId: number): Promise<any> {
        const response = await api.delete(`/projects/files/${fileId}`);
        return response.data;
    },

    async getPaymentStatusByProject(projectId: number): Promise<{ isFullyPaid: boolean; status: string }> {
        try {
            const project = await this.getProjectById(projectId);

            const response = await api.get(`/requests/payment-status-by-project`, {
                params: {
                    artistId: project.artist?.id,
                    producerId: project.producer?.id
                }
            });

            return {
                isFullyPaid: response.data.paymentStatus === 2,
                status: response.data.statusLabel
            };
        } catch (error) {
            return { isFullyPaid: false, status: 'not_paid' };
        }
    },

    async hasFinalAudioFile(projectId: number): Promise<boolean> {
        try {
            const response = await api.get(`/projects/${projectId}/has-final-audio`);
            return response.data.hasFinalAudio;
        } catch (error) {
            return false;
        }
    },
};