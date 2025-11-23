import apiClient from './client';
import { User } from './auth';

export interface Comment {
    id: number;
    post_id: number;
    parent_comment_id?: number;
    content: string;
    created_at: string;
    updated_at: string;
    user: User;
    likes_count: number;
    replies_count: number;
    is_liked: boolean;
}

export interface CreateCommentData {
    content: string;
}

/**
 * Create a comment on a post
 */
export const createComment = async (postId: number, data: CreateCommentData): Promise<Comment> => {
    const response = await apiClient.post(`/posts/${postId}/comments`, data);
    return response.data;
};

/**
 * Get comments for a post
 */
export const getComments = async (postId: number): Promise<Comment[]> => {
    const response = await apiClient.get(`/posts/${postId}/comments`);
    return response.data;
};

/**
 * Create a reply to a comment
 */
export const createReply = async (commentId: number, data: CreateCommentData): Promise<Comment> => {
    const response = await apiClient.post(`/comments/${commentId}/replies`, data);
    return response.data;
};

/**
 * Get replies for a comment
 */
export const getReplies = async (commentId: number): Promise<Comment[]> => {
    const response = await apiClient.get(`/comments/${commentId}/replies`);
    return response.data;
};

/**
 * Delete a comment
 */
export const deleteComment = async (commentId: number): Promise<void> => {
    await apiClient.delete(`/comments/${commentId}`);
};

/**
 * Toggle like on a comment
 */
export const toggleCommentLike = async (commentId: number): Promise<{ liked: boolean }> => {
    const response = await apiClient.post(`/comments/${commentId}/like`);
    return response.data;
};

/**
 * Get users who liked a comment
 */
export const getCommentLikes = async (commentId: number): Promise<User[]> => {
    const response = await apiClient.get(`/comments/${commentId}/likes`);
    return response.data;
};
