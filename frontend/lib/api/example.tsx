// Example: Using the API in a React component

'use client';
import { useState, useEffect } from 'react';
import { getPosts, createPost, togglePostLike, Post } from '@/lib/api';

export default function FeedExample() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    // Fetch posts on component mount
    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = async () => {
        try {
            setLoading(true);
            const response = await getPosts(1, 20);
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to load posts:', error);
        } finally {
            setLoading(false);
        }
    };

    // Create a new post
    const handleCreatePost = async (content: string) => {
        try {
            const newPost = await createPost({
                content,
                is_private: false,
            });
            setPosts([newPost, ...posts]);
        } catch (error) {
            console.error('Failed to create post:', error);
        }
    };

    // Toggle like on a post
    const handleLike = async (postId: number) => {
        try {
            const { liked } = await togglePostLike(postId);

            // Update local state
            setPosts(posts.map(post =>
                post.id === postId
                    ? { ...post, is_liked: liked, likes_count: liked ? post.likes_count + 1 : post.likes_count - 1 }
                    : post
            ));
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div>
            {posts.map(post => (
                <div key={post.id}>
                    <p>{post.content}</p>
                    <button onClick={() => handleLike(post.id)}>
                        {post.is_liked ? 'Unlike' : 'Like'} ({post.likes_count})
                    </button>
                </div>
            ))}
        </div>
    );
}
