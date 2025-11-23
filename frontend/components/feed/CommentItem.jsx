import { useState } from 'react';
import { toggleCommentLike, createReply, getReplies, deleteComment } from '@/lib/api';

export default function CommentItem({ comment: initialComment, onDelete }) {
    const [comment, setComment] = useState(initialComment);
    const [replies, setReplies] = useState([]);
    const [showReplies, setShowReplies] = useState(false);
    const [loadingReplies, setLoadingReplies] = useState(false);
    const [isReplying, setIsReplying] = useState(false);
    const [replyText, setReplyText] = useState('');

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

    // Relative time helper
    const formatRelativeTime = (dateString) => {
        const date = new Date(dateString);
        const now = new Date();
        const diffInSeconds = Math.floor((now - date) / 1000);

        if (diffInSeconds < 60) return 'Just now';
        const diffInMinutes = Math.floor(diffInSeconds / 60);
        if (diffInMinutes < 60) return `${diffInMinutes}m`;
        const diffInHours = Math.floor(diffInMinutes / 60);
        if (diffInHours < 24) return `${diffInHours}h`;
        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays}d`;
        return formatDate(dateString);
    };

    const handleLike = async () => {
        try {
            const { liked } = await toggleCommentLike(comment.id);
            setComment(prev => ({
                ...prev,
                is_liked: liked,
                likes_count: liked ? prev.likes_count + 1 : prev.likes_count - 1
            }));
        } catch (error) {
            console.error('Failed to like comment:', error);
        }
    };

    const handleReplySubmit = async () => {
        if (!replyText.trim()) return;

        try {
            const newReply = await createReply(comment.id, { content: replyText });
            setReplies([...replies, newReply]);
            setReplyText('');
            setIsReplying(false);
            setComment(prev => ({
                ...prev,
                replies_count: prev.replies_count + 1
            }));
            if (!showReplies) {
                setShowReplies(true);
            }
        } catch (error) {
            console.error('Failed to post reply:', error);
        }
    };

    const loadReplies = async () => {
        if (showReplies) {
            setShowReplies(false);
            return;
        }

        try {
            setLoadingReplies(true);
            setShowReplies(true);
            const data = await getReplies(comment.id);
            setReplies(data);
        } catch (error) {
            console.error('Failed to load replies:', error);
        } finally {
            setLoadingReplies(false);
        }
    };

    const handleDelete = async () => {
        if (!confirm('Delete this comment?')) return;
        try {
            await deleteComment(comment.id);
            if (onDelete) onDelete(comment.id);
        } catch (error) {
            console.error('Failed to delete comment:', error);
        }
    };

    const handleReplyDelete = (replyId) => {
        setReplies(replies.filter(r => r.id !== replyId));
        setComment(prev => ({
            ...prev,
            replies_count: prev.replies_count - 1
        }));
    };

    return (
        <div className="_comment_main _mar_b16">
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
                            onClick={handleDelete}
                            style={{ border: 'none', background: 'none', fontSize: '12px', color: '#999' }}
                        >
                            Delete
                        </button>
                    </div>
                    <div className="_comment_status">
                        <p className="_comment_status_text">
                            <span>{comment.content}</span>
                        </p>
                        {/* Like Count Display */}
                        {comment.likes_count > 0 && (
                            <div style={{
                                position: 'absolute',
                                right: '-20px',
                                bottom: '5px',
                                background: '#fff',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                                borderRadius: '10px',
                                padding: '2px 5px',
                                display: 'flex',
                                alignItems: 'center',
                                fontSize: '11px'
                            }}>
                                <span style={{ marginRight: '2px' }}>👍</span> {comment.likes_count}
                            </div>
                        )}
                    </div>
                    <div className="_comment_reply">
                        <div className="_comment_reply_num">
                            <ul className="_comment_reply_list">
                                <li>
                                    <span
                                        onClick={handleLike}
                                        style={{ cursor: 'pointer', fontWeight: comment.is_liked ? 'bold' : 'normal', color: comment.is_liked ? '#377DFF' : '#666' }}
                                    >
                                        Like
                                    </span>
                                </li>
                                <li>
                                    <span
                                        onClick={() => setIsReplying(!isReplying)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        Reply
                                    </span>
                                </li>
                                <li>
                                    <span style={{ cursor: 'pointer' }}>Share</span>
                                </li>
                                <li><span className="_time_link">.{formatRelativeTime(comment.created_at)}</span></li>
                            </ul>
                        </div>
                    </div>

                    {/* Reply Input */}
                    {isReplying && (
                        <div className="_feed_inner_comment_box" style={{ marginTop: '10px' }}>
                            <div className="_feed_inner_comment_box_form">
                                <div className="_feed_inner_comment_box_content">
                                    <div className="_feed_inner_comment_box_content_image">
                                        <img src="/assets/images/comment_img.png" alt="" className="_comment_img" style={{ width: '30px', height: '30px' }} />
                                    </div>
                                    <div className="_feed_inner_comment_box_content_txt">
                                        <textarea
                                            className="form-control _comment_textarea"
                                            placeholder={`Reply to ${comment.user.first_name}...`}
                                            value={replyText}
                                            onChange={(e) => setReplyText(e.target.value)}
                                            onKeyDown={(e) => {
                                                if (e.key === 'Enter' && !e.shiftKey) {
                                                    e.preventDefault();
                                                    handleReplySubmit();
                                                }
                                            }}
                                            style={{ minHeight: '40px', padding: '8px' }}
                                        ></textarea>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* View Replies Link */}
                    {comment.replies_count > 0 && (
                        <div style={{ marginTop: '5px' }}>
                            <a
                                href="#0"
                                onClick={(e) => { e.preventDefault(); loadReplies(); }}
                                style={{ fontSize: '13px', fontWeight: '600', color: '#666' }}
                            >
                                {showReplies ? 'Hide replies' : `View ${comment.replies_count} replies`}
                            </a>
                        </div>
                    )}

                    {/* Nested Replies */}
                    {showReplies && (
                        <div className="_nested_replies" style={{ marginLeft: '20px', borderLeft: '2px solid #f0f2f5', paddingLeft: '10px', marginTop: '10px' }}>
                            {loadingReplies ? (
                                <div style={{ fontSize: '12px', color: '#999' }}>Loading replies...</div>
                            ) : (
                                replies.map(reply => (
                                    <CommentItem key={reply.id} comment={reply} onDelete={handleReplyDelete} />
                                ))
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
