import api from '@/services/api';

export const cloudinaryService = {
    async uploadFileSecure(file: File): Promise<string> {
        try {
            const responseSignature = await api.get('/cloudinary/signature');
            const { signature, timestamp, api_key, cloud_name, folder } = responseSignature.data;

            const formData = new FormData();
            formData.append('file', file);
            formData.append('api_key', api_key);
            formData.append('timestamp', timestamp.toString());
            formData.append('signature', signature);
            formData.append('folder', folder);

            const cloudinaryResponse = await fetch(
                `https://api.cloudinary.com/v1_1/${cloud_name}/upload`,
                {
                    method: 'POST',
                    body: formData,
                }
            );

            if (!cloudinaryResponse.ok) {
                const errorData = await cloudinaryResponse.json();
                throw new Error(errorData.error?.message || 'Error al procesar la carga en Cloudinary');
            }

            const data = await cloudinaryResponse.json();

            return data.secure_url;

        } catch (error) {
            throw error;
        }
    }
};