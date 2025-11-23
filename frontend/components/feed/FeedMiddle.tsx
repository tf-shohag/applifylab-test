import { useState, useEffect } from 'react';
import StoriesSection from './StoriesSection';
import CreatePostBox from './CreatePostBox';
import TimelinePost from './TimelinePost';
import { getPosts, Post } from '@/lib/api';

export default function FeedMiddle() {
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await getPosts(1, 20); // Fetch first page for now
            setPosts(response.data || []);
        } catch (err) {
            console.error('Failed to fetch posts:', err);
            setError('Failed to load posts');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const handlePostCreated = (newPost: Post) => {
        setPosts([newPost, ...posts]);
    };

    return (
        <div className="_layout_middle_wrap">
            <div className="_layout_middle_inner">
                {/* Stories Section */}
                <StoriesSection />

                {/* Create Post Box */}
                <CreatePostBox onPostCreated={handlePostCreated} />

                {/* Timeline Posts */}
                {loading ? (
                    <div className="text-center _padd_t24">Loading posts...</div>
                ) : error ? (
                    <div className="alert alert-danger">{error}</div>
                ) : (
                    posts.map((post) => (
                        <TimelinePost key={post.id} post={post} />
                    ))
                )}
            </div>
        </div>
    );
}