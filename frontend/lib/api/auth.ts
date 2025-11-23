import apiClient from './client';

export interface RegisterData {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
}

export interface LoginData {
    email: string;
    password: string;
}

export interface User {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    created_at: string;
}

export interface AuthResponse {
    token: string;
    user: User;
}

/**
 * Register a new user
 */
export const register = async (data: RegisterData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/register', data);

    // Store token and user in localStorage
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
};

/**
 * Login user
 */
export const login = async (data: LoginData): Promise<AuthResponse> => {
    const response = await apiClient.post('/auth/login', data);

    // Store token and user in localStorage
    if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
    }

    return response.data;
};

/**
 * Get current user
 */
export const getCurrentUser = async (): Promise<User> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
};

/**
 * Logout user
 */
export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    if (typeof window !== 'undefined') {
        window.location.href = '/login';
    }
};

/**
 * Get stored user from localStorage
 */
export const getStoredUser = (): User | null => {
    if (typeof window === 'undefined') return null;

    const userStr = localStorage.getItem('user');
    if (!userStr) return null;

    try {
        return JSON.parse(userStr);
    } catch {
        return null;
    }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
    if (typeof window === 'undefined') return false;
    return !!localStorage.getItem('token');
};
