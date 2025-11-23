package handlers

import (
	"net/http"
	"strings"

	"github.com/applifylab/social-feed-backend/internal/config"
	"github.com/applifylab/social-feed-backend/internal/database"
	"github.com/applifylab/social-feed-backend/internal/middleware"
	"github.com/applifylab/social-feed-backend/internal/models"
	"github.com/applifylab/social-feed-backend/internal/utils"
	"github.com/gin-gonic/gin"
)

type AuthHandler struct {
	cfg *config.Config
}

func NewAuthHandler(cfg *config.Config) *AuthHandler {
	return &AuthHandler{cfg: cfg}
}

type RegisterRequest struct {
	FirstName string `json:"first_name" binding:"required"`
	LastName  string `json:"last_name" binding:"required"`
	Email     string `json:"email" binding:"required,email"`
	Password  string `json:"password" binding:"required,min=6"`
}

type LoginRequest struct {
	Email    string `json:"email" binding:"required,email"`
	Password string `json:"password" binding:"required"`
}

type AuthResponse struct {
	Token string              `json:"token"`
	User  models.UserResponse `json:"user"`
}

// Register handles user registration
func (h *AuthHandler) Register(c *gin.Context) {
	var req RegisterRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "validation_error", err.Error())
		return
	}

	// Check if user already exists
	var existingUser models.User
	if err := database.DB.Where("email = ?", strings.ToLower(req.Email)).First(&existingUser).Error; err == nil {
		utils.ErrorResponse(c, http.StatusConflict, "user_exists", "User with this email already exists")
		return
	}

	// Hash password
	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to process password")
		return
	}

	// Create user
	user := models.User{
		FirstName:    req.FirstName,
		LastName:     req.LastName,
		Email:        strings.ToLower(req.Email),
		PasswordHash: hashedPassword,
	}

	if err := database.DB.Create(&user).Error; err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to create user")
		return
	}

	// Generate JWT token
	token, err := utils.GenerateToken(user.ID, user.Email, h.cfg.JWTSecret)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to generate token")
		return
	}

	utils.SuccessResponse(c, AuthResponse{
		Token: token,
		User:  user.ToResponse(),
	}, "User registered successfully")
}

// Login handles user login
func (h *AuthHandler) Login(c *gin.Context) {
	var req LoginRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		utils.ErrorResponse(c, http.StatusBadRequest, "validation_error", err.Error())
		return
	}

	// Find user by email
	var user models.User
	if err := database.DB.Where("email = ?", strings.ToLower(req.Email)).First(&user).Error; err != nil {
		utils.ErrorResponse(c, http.StatusUnauthorized, "invalid_credentials", "Invalid email or password")
		return
	}

	// Check password
	if !utils.CheckPassword(user.PasswordHash, req.Password) {
		utils.ErrorResponse(c, http.StatusUnauthorized, "invalid_credentials", "Invalid email or password")
		return
	}

	// Generate JWT token
	token, err := utils.GenerateToken(user.ID, user.Email, h.cfg.JWTSecret)
	if err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to generate token")
		return
	}

	utils.SuccessResponse(c, AuthResponse{
		Token: token,
		User:  user.ToResponse(),
	}, "Login successful")
}

// GetMe returns the current authenticated user
func (h *AuthHandler) GetMe(c *gin.Context) {
	userID, exists := middleware.GetUserID(c)
	if !exists {
		utils.ErrorResponse(c, http.StatusUnauthorized, "unauthorized", "User not authenticated")
		return
	}

	var user models.User
	if err := database.DB.First(&user, userID).Error; err != nil {
		utils.ErrorResponse(c, http.StatusNotFound, "user_not_found", "User not found")
		return
	}

	utils.SuccessResponse(c, user.ToResponse(), "User retrieved successfully")
}
