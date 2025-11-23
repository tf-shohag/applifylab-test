import apiClient from './client';
import { User } from './auth';

export interface Post {
    id: number;
    content: string;
    image_url?: string;
    is_private: boolean;
    created_at: string;
    updated_at: string;
    user: User;
    likes_count: number;
    comments_count: number;
    is_liked: boolean;
}

export interface CreatePostData {
    content: string;
    image_url?: string;
    is_private?: boolean;
}

export interface UpdatePostData {
    content?: string;
    is_private?: boolean;
}

export interface PaginatedResponse<T> {
    data: T[];
    page: number;
    limit: number;
    total: number;
    has_more: boolean;
}

/**
 * Create a new post
 */
export const createPost = async (data: CreatePostData): Promise<Post> => {
    const response = await apiClient.post('/posts', data);
    return response.data;
};

/**
 * Get all posts with pagination
 */
export const getPosts = async (page: number = 1, limit: number = 20): Promise<PaginatedResponse<Post>> => {
    const response = await apiClient.get('/posts', {
        params: { page, limit },
    });
    return response as any;
};

/**
 * Get a single post by ID
 */
export const getPost = async (postId: number): Promise<Post> => {
    const response = await apiClient.get(`/posts/${postId}`);
    return response.data;
};

/**
 * Update a post
 */
export const updatePost = async (postId: number, data: UpdatePostData): Promise<Post> => {
    const response = await apiClient.put(`/posts/${postId}`, data);
    return response.data;
};

/**
 * Delete a post
 */
export const deletePost = async (postId: number): Promise<void> => {
    await apiClient.delete(`/posts/${postId}`);
};

/**
 * Toggle like on a post
 */
export const togglePostLike = async (postId: number): Promise<{ liked: boolean }> => {
    const response = await apiClient.post(`/posts/${postId}/like`);
    return response.data;
};

/**
 * Get users who liked a post
 */
export const getPostLikes = async (postId: number): Promise<User[]> => {
    const response = await apiClient.get(`/posts/${postId}/likes`);
    return response.data;
};
