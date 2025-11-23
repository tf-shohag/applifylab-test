import axios from 'axios';

const uploadClient = axios.create({
    baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080/api',
});

// Add auth token to upload requests
uploadClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export interface UploadResponse {
    url: string;
    filename: string;
}

/**
 * Upload an image file
 */
export const uploadImage = async (file: File): Promise<UploadResponse> => {
    const formData = new FormData();
    formData.append('image', file);

    const response = await uploadClient.post('/upload', formData, {
        headers: {
            'Content-Type': 'multipart/form-data',
        },
    });

    return response.data.data;
};

/**
 * Get full URL for uploaded image
 */
export const getImageUrl = (path: string): string => {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';
    // Remove /api from base URL for uploads
    const uploadBaseUrl = baseUrl.replace('/api', '');
    return `${uploadBaseUrl}${path}`;
};
