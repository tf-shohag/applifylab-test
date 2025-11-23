package handlers

import (
	"fmt"
	"net/http"

	"github.com/applifylab/social-feed-backend/internal/config"
	"github.com/applifylab/social-feed-backend/internal/database"
	"github.com/applifylab/social-feed-backend/internal/middleware"
	"github.com/applifylab/social-feed-backend/internal/models"
	"github.com/applifylab/social-feed-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type CommentHandler struct {
	cfg *config.Config
}

func NewCommentHandler(cfg *config.Config) *CommentHandler {
	return &CommentHandler{cfg: cfg}
}

type CreateCommentRequest struct {
	Content string `json:"content" binding:"required"`
}

// CreateComment creates a comment on a post
func (h *CommentHandler) CreateComment(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	postID := c.Param("id")

	var req CreateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	// Check if post exists
	var post models.Post
	if err := database.DB.First(&post, postID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "not_found", "Post not found")
		return
	}

	comment := models.Comment{
		PostID:  post.ID,
		UserID:  userID,
		Content: req.Content,
	}

	if err := database.DB.Create(&comment).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to create comment")
		return
	}

	database.DB.Preload("User").First(&comment, comment.ID)
	utils.SuccessResponse(c, comment.ToResponse(), "Comment created successfully")
}

// GetComments retrieves comments for a post
func (h *CommentHandler) GetComments(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	postID := c.Param("id")

	var comments []models.Comment
	if err := database.DB.Where("post_id = ? AND parent_comment_id IS NULL", postID).
		Preload("User").
		Order("created_at DESC").
		Find(&comments).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to fetch comments")
		return
	}

	// Enrich with counts
	for i := range comments {
		database.DB.Model(&models.Like{}).
			Where("likeable_type = ? AND likeable_id = ?", "comment", comments[i].ID).
			Count(&comments[i].LikesCount)

		database.DB.Model(&models.Comment{}).
			Where("parent_comment_id = ?", comments[i].ID).
			Count(&comments[i].RepliesCount)

		var like models.Like
		err := database.DB.Where("user_id = ? AND likeable_type = ? AND likeable_id = ?",
			userID, "comment", comments[i].ID).First(&like).Error
		comments[i].IsLiked = err == nil
	}

	commentResponses := make([]models.CommentResponse, len(comments))
	for i, comment := range comments {
		commentResponses[i] = comment.ToResponse()
	}

	utils.SuccessResponse(c, commentResponses, fmt.Sprintf("%d comments found", len(comments)))
}

// CreateReply creates a reply to a comment
func (h *CommentHandler) CreateReply(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	commentID := c.Param("id")

	var req CreateCommentRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "validation_error", err.Error())
		return
	}

	// Check if parent comment exists
	var parentComment models.Comment
	if err := database.DB.First(&parentComment, commentID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "not_found", "Comment not found")
		return
	}

	reply := models.Comment{
		PostID:          parentComment.PostID,
		UserID:          userID,
		ParentCommentID: &parentComment.ID,
		Content:         req.Content,
	}

	if err := database.DB.Create(&reply).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to create reply")
		return
	}

	database.DB.Preload("User").First(&reply, reply.ID)
	utils.SuccessResponse(c, reply.ToResponse(), "Reply created successfully")
}

// GetReplies retrieves replies for a comment
func (h *CommentHandler) GetReplies(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	commentID := c.Param("id")

	var replies []models.Comment
	if err := database.DB.Where("parent_comment_id = ?", commentID).
		Preload("User").
		Order("created_at ASC").
		Find(&replies).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to fetch replies")
		return
	}

	// Enrich with counts
	for i := range replies {
		database.DB.Model(&models.Like{}).
			Where("likeable_type = ? AND likeable_id = ?", "comment", replies[i].ID).
			Count(&replies[i].LikesCount)

		var like models.Like
		err := database.DB.Where("user_id = ? AND likeable_type = ? AND likeable_id = ?",
			userID, "comment", replies[i].ID).First(&like).Error
		replies[i].IsLiked = err == nil
	}

	replyResponses := make([]models.CommentResponse, len(replies))
	for i, reply := range replies {
		replyResponses[i] = reply.ToResponse()
	}

	utils.SuccessResponse(c, replyResponses, fmt.Sprintf("%d replies found", len(replies)))
}

// DeleteComment deletes a comment
func (h *CommentHandler) DeleteComment(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	commentID := c.Param("id")

	var comment models.Comment
	if err := database.DB.First(&comment, commentID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "not_found", "Comment not found")
		return
	}

	// Check ownership
	if comment.UserID != userID {
		utils.ErrorResponse(c, http.StatusForbidden, "forbidden", "You can only delete your own comments")
		return
	}

	if err := database.DB.Delete(&comment).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to delete comment")
		return
	}

	utils.SuccessResponse(c, nil, "Comment deleted successfully")
}

// ToggleLike toggles like on a comment
func (h *CommentHandler) ToggleLike(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	commentID := c.Param("id")

	// Check if comment exists
	var comment models.Comment
	if err := database.DB.First(&comment, commentID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "not_found", "Comment not found")
		return
	}

	// Check if already liked
	var like models.Like
	err := database.DB.Where("user_id = ? AND likeable_type = ? AND likeable_id = ?",
		userID, "comment", commentID).First(&like).Error

	if err == nil {
		// Unlike
		database.DB.Delete(&like)
		utils.SuccessResponse(c, gin.H{"liked": false}, "Comment unliked")
	} else {
		// Like
		like = models.Like{
			UserID:       userID,
			LikeableType: "comment",
			LikeableID:   comment.ID,
		}
		database.DB.Create(&like)
		utils.SuccessResponse(c, gin.H{"liked": true}, "Comment liked")
	}
}

// GetCommentLikes retrieves users who liked a comment
func (h *CommentHandler) GetCommentLikes(c *gin.Context) {
	commentID := c.Param("id")

	var likes []models.Like
	if err := database.DB.Where("likeable_type = ? AND likeable_id = ?", "comment", commentID).
		Preload("User").Find(&likes).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to fetch likes")
		return
	}

	users := make([]models.UserResponse, len(likes))
	for i, like := range likes {
		users[i] = like.User.ToResponse()
	}

	utils.SuccessResponse(c, users, fmt.Sprintf("%d users liked this comment", len(users)))
}
