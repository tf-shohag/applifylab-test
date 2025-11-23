import { useState, useEffect } from 'react';
import { togglePostLike, createComment, getComments, deletePost, deleteComment, toggleCommentLike, getImageUrl } from '@/lib/api';

export default function TimelinePost({ post: initialPost }) {
    const [post, setPost] = useState(initialPost);
    const [showDropdown, setShowDropdown] = useState(false);
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState('');
    const [comments, setComments] = useState([]);
    const [loadingComments, setLoadingComments] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null); // Track which comment is being replied to
    const [replyText, setReplyText] = useState('');
    const [showAllComments, setShowAllComments] = useState(false);

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

    const handleCommentSubmit = async (parentId = null) => {
        const text = parentId ? replyText : commentText;
        if (!text.trim()) return;

        try {
            const newComment = await createComment(post.id, { content: text, parent_comment_id: parentId });
            setComments([newComment, ...comments]);
            if (parentId) {
                setReplyText('');
                setReplyingTo(null);
            } else {
                setCommentText('');
            }
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

    // Logic for displaying comments (show last 3 or all)
    const displayedComments = showAllComments ? comments : comments.slice(0, 3);
    const hasMoreComments = comments.length > 3;

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
                                    <a href="#0" className="_feed_timeline_dropdown_link">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 15.75L9 12l-5.25 3.75v-12a1.5 1.5 0 011.5-1.5h7.5a1.5 1.5 0 011.5 1.5v12z" />
                                            </svg>
                                        </span>
                                        Save Post
                                    </a>
                                </li>
                                <li className="_feed_timeline_dropdown_item">
                                    <a href="#0" className="_feed_timeline_dropdown_link">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" fill="none" viewBox="0 0 20 22">
                                                <path fill="#377DFF" fillRule="evenodd" d="M7.547 19.55c.533.59 1.218.915 1.93.915.714 0 1.403-.324 1.938-.916a.777.777 0 011.09-.056c.318.284.344.77.058 1.084-.832.917-1.927 1.423-3.086 1.423h-.002c-1.155-.001-2.248-.506-3.077-1.424a.762.762 0 01.057-1.083.774.774 0 011.092.057zM9.527 0c4.58 0 7.657 3.543 7.657 6.85 0 1.702.436 2.424.899 3.19.457.754.976 1.612.976 3.233-.36 4.14-4.713 4.478-9.531 4.478-4.818 0-9.172-.337-9.528-4.413-.003-1.686.515-2.544.973-3.299l.161-.27c.398-.679.737-1.417.737-2.918C1.871 3.543 4.948 0 9.528 0zm0 1.535c-3.6 0-6.11 2.802-6.11 5.316 0 2.127-.595 3.11-1.12 3.978-.422.697-.755 1.247-.755 2.444.173 1.93 1.455 2.944 7.986 2.944 6.494 0 7.817-1.06 7.988-3.01-.003-1.13-.336-1.681-.757-2.378-.526-.868-1.12-1.851-1.12-3.978 0-2.514-2.51-5.316-6.111-5.316z" clipRule="evenodd" />
                                            </svg>
                                        </span>
                                        Turn On Notification
                                    </a>
                                </li>
                                <li className="_feed_timeline_dropdown_item">
                                    <a href="#0" className="_feed_timeline_dropdown_link">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M14.25 2.25H3.75a1.5 1.5 0 00-1.5 1.5v10.5a1.5 1.5 0 001.5 1.5h10.5a1.5 1.5 0 001.5-1.5V3.75a1.5 1.5 0 00-1.5-1.5zM6.75 6.75l4.5 4.5M11.25 6.75l-4.5 4.5" />
                                            </svg>
                                        </span>
                                        Hide
                                    </a>
                                </li>
                                <li className="_feed_timeline_dropdown_item">
                                    <a href="#0" className="_feed_timeline_dropdown_link">
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M8.25 3H3a1.5 1.5 0 00-1.5 1.5V15A1.5 1.5 0 003 16.5h10.5A1.5 1.5 0 0015 15V9.75" />
                                                <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M13.875 1.875a1.591 1.591 0 112.25 2.25L9 11.25 6 12l.75-3 7.125-7.125z" />
                                            </svg>
                                        </span>
                                        Edit Post
                                    </a>
                                </li>
                                <li className="_feed_timeline_dropdown_item">
                                    <button onClick={handleDeletePost} className="_feed_timeline_dropdown_link" style={{ border: 'none', background: 'none', width: '100%', textAlign: 'left', display: 'flex', alignItems: 'center' }}>
                                        <span>
                                            <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="none" viewBox="0 0 18 18">
                                                <path stroke="#1890FF" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.2" d="M2.25 4.5h13.5M6 4.5V3a1.5 1.5 0 011.5-1.5h3A1.5 1.5 0 0112 3v1.5m2.25 0V15a1.5 1.5 0 01-1.5 1.5h-7.5a1.5 1.5 0 01-1.5-1.5V4.5h10.5zM7.5 8.25v4.5M10.5 8.25v4.5" />
                                            </svg>
                                        </span>
                                        Delete Post
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
                        <img src={getImageUrl(post.image_url)} alt="" className="_time_img" />
                    </div>
                )}
            </div>

            {/* Reactions Summary */}
            <div className="_feed_inner_timeline_total_reacts _padd_r24 _padd_l24 _mar_b26">
                <div className="_feed_inner_timeline_total_reacts_image">
                    <img src="/assets/images/react_img1.png" alt="Image" className="_react_img1" />
                    <img src="/assets/images/react_img2.png" alt="Image" className="_react_img" />
                    <img src="/assets/images/react_img3.png" alt="Image" className="_react_img _rect_img_mbl_none" />
                    <img src="/assets/images/react_img4.png" alt="Image" className="_react_img _rect_img_mbl_none" />
                    <img src="/assets/images/react_img5.png" alt="Image" className="_react_img _rect_img_mbl_none" />
                    <p className="_feed_inner_timeline_total_reacts_para">{post.likes_count > 0 ? post.likes_count : ''}</p>
                </div>
                <div className="_feed_inner_timeline_total_reacts_txt">
                    <p className="_feed_inner_timeline_total_reacts_para1">
                        <a href="#0" onClick={loadComments}><span>{post.comments_count}</span> Comment</a>
                    </p>
                    <p className="_feed_inner_timeline_total_reacts_para2"><span>0</span> Share</p>
                </div>
            </div>

            {/* Reaction Buttons */}
            <div className="_feed_inner_timeline_reaction">
                <button
                    className={`_feed_inner_timeline_reaction_emoji _feed_reaction ${post.is_liked ? '_feed_reaction_active' : ''}`}
                    onClick={handleLike}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg xmlns="http://www.w3.org/2000/svg" width="19" height="19" fill="none" viewBox="0 0 19 19">
                                <path fill="#FFCC4D" d="M9.5 19a9.5 9.5 0 100-19 9.5 9.5 0 000 19z" />
                                <path fill="#664500" d="M9.5 11.083c-1.912 0-3.181-.222-4.75-.527-.358-.07-1.056 0-1.056 1.055 0 2.111 2.425 4.75 5.806 4.75 3.38 0 5.805-2.639 5.805-4.75 0-1.055-.697-1.125-1.055-1.055-1.57.305-2.838.527-4.75.527z" />
                                <path fill="#fff" d="M4.75 11.611s1.583.528 4.75.528 4.75-.528 4.75-.528-1.056 2.111-4.75 2.111-4.75-2.11-4.75-2.11z" />
                                <path fill="#664500" d="M6.333 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847zM12.667 8.972c.729 0 1.32-.827 1.32-1.847s-.591-1.847-1.32-1.847c-.729 0-1.32.827-1.32 1.847s.591 1.847 1.32 1.847z" />
                            </svg>
                            Like
                        </span>
                    </span>
                </button>

                <button
                    className="_feed_inner_timeline_reaction_comment _feed_reaction"
                    onClick={loadComments}
                >
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="21" height="21" fill="none" viewBox="0 0 21 21">
                                <path stroke="#000" d="M1 10.5c0-.464 0-.696.009-.893A9 9 0 019.607 1.01C9.804 1 10.036 1 10.5 1v0c.464 0 .696 0 .893.009a9 9 0 018.598 8.598c.009.197.009.429.009.893v6.046c0 1.36 0 2.041-.317 2.535a2 2 0 01-.602.602c-.494.317-1.174.317-2.535.317H10.5c-.464 0-.696 0-.893-.009a9 9 0 01-8.598-8.598C1 11.196 1 10.964 1 10.5v0z" />
                                <path stroke="#000" strokeLinecap="round" strokeLinejoin="round" d="M6.938 9.313h7.125M10.5 14.063h3.563" />
                            </svg>
                            Comment
                        </span>
                    </span>
                </button>

                <button className="_feed_inner_timeline_reaction_share _feed_reaction">
                    <span className="_feed_inner_timeline_reaction_link">
                        <span>
                            <svg className="_reaction_svg" xmlns="http://www.w3.org/2000/svg" width="24" height="21" fill="none" viewBox="0 0 24 21">
                                <path stroke="#000" strokeLinejoin="round" d="M23 10.5L12.917 1v5.429C3.267 6.429 1 13.258 1 20c2.785-3.52 5.248-5.429 11.917-5.429V20L23 10.5z" />
                            </svg>
                            Share
                        </span>
                    </span>
                </button>
            </div>

            {/* Comment Section */}
            {showComments && (
                <div className="_feed_inner_timeline_cooment_area">
                    {/* View Previous Comments Toggle */}
                    {hasMoreComments && !showAllComments && (
                        <div className="_view_more_comment" style={{ padding: '0 24px 16px' }}>
                            <a
                                href="#0"
                                className="_view_more_comment_link"
                                onClick={(e) => {
                                    e.preventDefault();
                                    setShowAllComments(true);
                                }}
                                style={{ color: '#666', fontSize: '14px', fontWeight: '500' }}
                            >
                                View {comments.length - 3} previous comments
                            </a>
                        </div>
                    )}

                    {/* Comments List */}
                    <div className="_timline_comment_main">
                        {loadingComments ? (
                            <div className="text-center">Loading comments...</div>
                        ) : (
                            displayedComments.map(comment => (
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
                                                                style={{ cursor: 'pointer', fontWeight: comment.is_liked ? 'bold' : 'normal', color: comment.is_liked ? '#377DFF' : '#666' }}
                                                            >
                                                                Like
                                                            </span>
                                                        </li>
                                                        <li>
                                                            <span
                                                                onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
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
                                            {replyingTo === comment.id && (
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
                                                                            handleCommentSubmit(comment.id);
                                                                        }
                                                                    }}
                                                                    style={{ minHeight: '40px', padding: '8px' }}
                                                                ></textarea>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Main Comment Input */}
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
                                    onClick={() => handleCommentSubmit()}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}