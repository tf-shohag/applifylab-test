package handlers

import (
	"fmt"
	"net/http"
	"strconv"

	"github.com/applifylab/social-feed-backend/internal/config"
	"github.com/applifylab/social-feed-backend/internal/database"
	"github.com/applifylab/social-feed-backend/internal/middleware"
	"github.com/applifylab/social-feed-backend/internal/models"
	"github.com/applifylab/social-feed-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type PostHandler struct {
	cfg *config.Config
}

func NewPostHandler(cfg *config.Config) *PostHandler {
	return &PostHandler{cfg: cfg}
}

type CreatePostRequest struct {
	Content   string `json:"content" binding:"required"`
	ImageURL  string `json:"image_url"`
	IsPrivate bool   `json:"is_private"`
}

type UpdatePostRequest struct {
	Content   string `json:"content"`
	IsPrivate *bool  `json:"is_private"`
}

// CreatePost creates a new post
func (h *PostHandler) CreatePost(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)

	var req CreatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ValidationErrorResponse(c, err)
		return
	}

	post := models.Post{
		UserID:    userID,
		Content:   req.Content,
		ImageURL:  req.ImageURL,
		IsPrivate: req.IsPrivate,
	}

	if err := database.DB.Create(&post).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to create post")
		return
	}

	// Load user data
	database.DB.Preload("User").First(&post, post.ID)

	utils.SuccessResponse(c, post.ToResponse(), "Post created successfully")
}

// GetPosts retrieves all posts with pagination
func (h *PostHandler) GetPosts(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)

	page, _ := strconv.Atoi(c.DefaultQuery("page", "1"))
	limit, _ := strconv.Atoi(c.DefaultQuery("limit", "20"))
	offset := (page - 1) * limit

	var posts []models.Post
	var total int64

	// Get posts (public posts + user's own private posts)
	query := database.DB.Model(&models.Post{}).
		Where("is_private = ? OR user_id = ?", false, userID)

	query.Count(&total)

	if err := query.
		Preload("User").
		Order("created_at DESC").
		Limit(limit).
		Offset(offset).
		Find(&posts).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to fetch posts")
		return
	}

	// Enrich posts with likes and comments count
	for i := range posts {
		database.DB.Model(&models.Like{}).
			Where("likeable_type = ? AND likeable_id = ?", "post", posts[i].ID).
			Count(&posts[i].LikesCount)

		database.DB.Model(&models.Comment{}).
			Where("post_id = ? AND parent_comment_id IS NULL", posts[i].ID).
			Count(&posts[i].CommentsCount)

		// Check if current user liked this post
		var like models.Like
		err := database.DB.Where("user_id = ? AND likeable_type = ? AND likeable_id = ?",
			userID, "post", posts[i].ID).First(&like).Error
		posts[i].IsLiked = err == nil
	}

	// Convert to response
	postResponses := make([]models.PostResponse, len(posts))
	for i, post := range posts {
		postResponses[i] = post.ToResponse()
	}

	utils.PaginatedSuccessResponse(c, postResponses, page, limit, total)
}

// GetPost retrieves a single post by ID
func (h *PostHandler) GetPost(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	postID := c.Param("id")

	var post models.Post
	if err := database.DB.Preload("User").First(&post, postID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "not_found", "Post not found")
		return
	}

	// Check if user can view this post
	if post.IsPrivate && post.UserID != userID {
		utils.ErrorResponse(c, http.StatusForbidden, "forbidden", "You don't have permission to view this post")
		return
	}

	// Enrich with counts
	database.DB.Model(&models.Like{}).
		Where("likeable_type = ? AND likeable_id = ?", "post", post.ID).
		Count(&post.LikesCount)

	database.DB.Model(&models.Comment{}).
		Where("post_id = ? AND parent_comment_id IS NULL", post.ID).
		Count(&post.CommentsCount)

	var like models.Like
	err := database.DB.Where("user_id = ? AND likeable_type = ? AND likeable_id = ?",
		userID, "post", post.ID).First(&like).Error
	post.IsLiked = err == nil

	utils.SuccessResponse(c, post.ToResponse(), "Post retrieved successfully")
}

// DeletePost deletes a post
func (h *PostHandler) DeletePost(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	postID := c.Param("id")

	var post models.Post
	if err := database.DB.First(&post, postID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "not_found", "Post not found")
		return
	}

	// Check ownership
	if post.UserID != userID {
		utils.ErrorResponse(c, http.StatusForbidden, "forbidden", "You can only delete your own posts")
		return
	}

	if err := database.DB.Delete(&post).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to delete post")
		return
	}

	utils.SuccessResponse(c, nil, "Post deleted successfully")
}

// UpdatePost updates a post
func (h *PostHandler) UpdatePost(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	postID := c.Param("id")

	var post models.Post
	if err := database.DB.First(&post, postID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "not_found", "Post not found")
		return
	}

	// Check ownership
	if post.UserID != userID {
		utils.ErrorResponse(c, http.StatusForbidden, "forbidden", "You can only update your own posts")
		return
	}

	var req UpdatePostRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "validation_error", err.Error())
		return
	}

	// Update fields
	if req.Content != "" {
		post.Content = req.Content
	}
	if req.IsPrivate != nil {
		post.IsPrivate = *req.IsPrivate
	}

	if err := database.DB.Save(&post).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to update post")
		return
	}

	database.DB.Preload("User").First(&post, post.ID)
	utils.SuccessResponse(c, post.ToResponse(), "Post updated successfully")
}

// ToggleLike toggles like on a post
func (h *PostHandler) ToggleLike(c *gin.Context) {
	userID, _ := middleware.GetUserID(c)
	postID := c.Param("id")

	// Check if post exists
	var post models.Post
	if err := database.DB.First(&post, postID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "not_found", "Post not found")
		return
	}

	// Check if already liked
	var like models.Like
	err := database.DB.Where("user_id = ? AND likeable_type = ? AND likeable_id = ?",
		userID, "post", postID).First(&like).Error

	if err == nil {
		// Unlike
		database.DB.Delete(&like)
		utils.SuccessResponse(c, gin.H{"liked": false}, "Post unliked")
	} else {
		// Like
		like = models.Like{
			UserID:       userID,
			LikeableType: "post",
			LikeableID:   post.ID,
		}
		database.DB.Create(&like)
		utils.SuccessResponse(c, gin.H{"liked": true}, "Post liked")
	}
}

// GetPostLikes retrieves users who liked a post
func (h *PostHandler) GetPostLikes(c *gin.Context) {
	postID := c.Param("id")

	var likes []models.Like
	if err := database.DB.Where("likeable_type = ? AND likeable_id = ?", "post", postID).
		Preload("User").Find(&likes).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to fetch likes")
		return
	}

	users := make([]models.UserResponse, len(likes))
	for i, like := range likes {
		users[i] = like.User.ToResponse()
	}

	utils.SuccessResponse(c, users, fmt.Sprintf("%d users liked this post", len(users)))
}
