import { useState, useEffect } from 'react';
import { togglePostLike, createComment, getComments, deletePost, deleteComment, toggleCommentLike } from '@/lib/api';

export default function TimelinePost({ post: initialPost }) {
    const [post, setPost] = useState(initialPost);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const handleLike = async () => {
        try {
            const { liked } = await togglePostLike(post.id);
            setPost(prev => ({
                ...prev,
                is_liked: liked,
                likes_count: liked ? prev.likes_count + 1 : prev.likes_count - 1
            }));
        } catch (error) {
            console.error('Failed to toggle like:', error);
        }
    };

    const handleCommentSubmit = async () => {
        if (!commentText.trim()) return;

        try {
            const newComment = await createComment(post.id, { content: commentText });
            setComments([newComment, ...comments]);
            setCommentText('');
            setPost(prev => ({
                ...prev,
                comments_count: prev.comments_count + 1
            }));
        } catch (error) {
            console.error('Failed to post comment:', error);
        }
    };

    const loadComments = async () => {
        if (showComments) {
            setShowComments(false);
            return;
        }

        try {
            setLoadingComments(true);
            setShowComments(true);
            const data = await getComments(post.id);
            setComments(data);
        } catch (error) {
            console.error('Failed to load comments:', error);
        } finally {
            setLoadingComments(false);
        }
    };

    const handleDeletePost = async () => {
        if (!confirm('Are you sure you want to delete this post?')) return;

        try {
            setIsDeleting(true);
            await deletePost(post.id);
            // Ideally we should remove it from parent state, but for now we'll just hide it
            setPost(null);
        } catch (error) {
            console.error('Failed to delete post:', error);
            setIsDeleting(false);
        }
    };

    const handleDeleteComment = async (commentId) => {
        if (!confirm('Delete this comment?')) return;

        try {
            await deleteComment(commentId);
            setComments(comments.filter(c => c.id !== commentId));
            setPost(prev => ({
                ...prev,
                comments_count: prev.comments_count - 1
            }));
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleCommentLike = async (commentId) => {
        try {
            const { liked } = await toggleCommentLike(commentId);
            setComments(comments.map(c =>
                c.id === commentId
                    ? { ...c, is_liked: liked, likes_count: liked ? c.likes_count + 1 : c.likes_count - 1 }
                    : c
            ));
        } catch (error) {
            console.error('Failed to like comment:', error);
        }
    };

    if (!post) return null;

    return (
        <div className="_feed_inner_timeline_post_area _b_radious6 _padd_b24 _padd_t24 _mar_b16">
            {/* Post Header */}
            <div className="_feed_inner_timeline_content _padd_r24 _padd_l24">
                <div className="_feed_inner_timeline_post_top">
                    <div className="_feed_inner_timeline_post_box">
                        <div className="_feed_inner_timeline_post_box_image">
                            <img src="/assets/images/post_img.png" alt="" className="_post_img" />
                        </div>
                        <div className="_feed_inner_timeline_post_box_txt">
                            <h4 className="_feed_inner_timeline_post_box_title">
                                {post.user.first_name} {post.user.last_name}
                            </h4>
                            <p className="_feed_inner_timeline_post_box_para">
                                {formatDate(post.created_at)} . <a href="#0">{post.is_private ? 'Private' : 'Public'}</a>
                            </p>
                        </div>
                    </div>

                    {/* Dropdown Menu */}
                    <div className="_feed_inner_timeline_post_box_dropdown">
                        <div className="_feed_timeline_post_dropdown">
                            <button
                                className="_feed_timeline_post_dropdown_link"
                                onClick={() => setShowDropdown(!showDropdown)}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="4" height="17" fill="none" viewBox="0 0 4 17">
                                    <circle cx="2" cy="2" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="8" r="2" fill="#C4C4C4" />
                                    <circle cx="2" cy="15" r="2" fill="#C4C4C4" />
                                </svg>
                            </button>
                        </div>

                        <div className={`_feed_timeline_dropdown ${showDropdown ? 'show' : ''}`}>
                            <ul className="_feed_timeline_dropdown_list">
                                <li className="_feed_timeline_dropdown_item">
                                    <button onClick={handleDeletePost} className="_feed_timeline_dropdown_link" style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left' }}>
                                        <span>🗑️</span> Delete Post
                                    </button>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>

                {/* Post Content */}
                <h4 className="_feed_inner_timeline_post_title">{post.content}</h4>
                {post.image_url && (
                    <div className="_feed_inner_timeline_image">
                        <img src={post.image_url} alt="" className="_time_img" />
                    </div>
                )}
            </div>

            {/* Reactions Summary */}
            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                <div className="_feed_inner_timeline_total_reacts_image">
                    <span style={{ fontSize: '18px' }}>👍</span>
                    <p className="_feed_inner_timeline_total_reacts_para">{post.likes_count}</p>
                </div>
                <div className="_feed_inner_timeline_total_reacts_txt">
                    <p className="_feed_inner_timeline_total_reacts_para1">
                        <a href="#0" onClick={loadComments}><span>{post.comments_count}</span> Comment</a>
                    </p>
                </div>
            </div>

            {/* Reaction Buttons */}
            <div className="_feed_inner_timeline_reaction">
                <button
                    className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${post.is_liked ? '_feed_reaction_active' : ''}`}
                    onClick={handleLike}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>👍 Like</span>
                    </span>
                </button>

                <button
                    className="_feed_inner_timeline_reaction_comment _feed_reaction"
                    onClick={loadComments}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>💬 Comment</span>
                    </span>
                </button>
            </div>

            {/* Comment Section */}
            {showComments && (
                <div className="_feed_inner_timeline_cooment_area">
                    <div className="_feed_inner_comment_box">
                        <div className="_feed_inner_comment_box_form">
                            <div className="_feed_inner_comment_box_content">
                                <div className="_feed_inner_comment_box_content_image">
                                    <img src="/assets/images/comment_img.png" alt="" className="_comment_img" />
                                </div>
                                <div className="_feed_inner_comment_box_content_txt">
                                    <textarea
                                        className="form-control _comment_textarea"
                                        placeholder="Write a comment..."
                                        value={commentText}
                                        onChange={(e) => setCommentText(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter' && !e.shiftKey) {
                                                e.preventDefault();
                                                handleCommentSubmit();
                                            }
                                        }}
                                    ></textarea>
                                </div>
                            </div>
                            <div className="_feed_inner_comment_box_icon">
                                <button
                                    className="_feed_inner_comment_box_icon_btn"
                                    onClick={handleCommentSubmit}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Comments List */}
                    <div className="_timline_comment_main">
                        {loadingComments ? (
                            <div className="text-center">Loading comments...</div>
                        ) : (
                            comments.map(comment => (
                                <div key={comment.id} className="_comment_main _mar_b16">
                                    <div className="_comment_image">
                                        <a href="#0" className="_comment_image_link">
                                            <img src="/assets/images/txt_img.png" alt="" className="_comment_img1" />
                                        </a>
                                    </div>
                                    <div className="_comment_area">
                                        <div className="_comment_details">
                                            <div className="_comment_details_top">
                                                <div className="_comment_name">
                                                    <a href="#0">
                                                        <h4 className="_comment_name_title">
                                                            {comment.user.first_name} {comment.user.last_name}
                                                        </h4>
                                                    </a>
                                                </div>
                                                <button
                                                    onClick={() => handleDeleteComment(comment.id)}
                                                    style={{ border: 'none', background: 'none', fontSize: '12px', color: '#999' }}
                                                >
                                                    Delete
                                                </button>
                                            </div>
                                            <div className="_comment_status">
                                                <p className="_comment_status_text">
                                                    <span>{comment.content}</span>
                                                </p>
                                            </div>
                                            <div className="_comment_reply">
                                                <div className="_comment_reply_num">
                                                    <ul className="_comment_reply_list">
                                                        <li>
                                                            <span
                                                                onClick={() => handleCommentLike(comment.id)}
                                                                style={{ cursor: 'pointer', fontWeight: comment.is_liked ? 'bold' : 'normal' }}
                                                            >
                                                                Like ({comment.likes_count})
                                                            </span>
                                                        </li>
                                                        <li><span className="_time_link">{formatDate(comment.created_at)}</span></li>
                                                    </ul>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}