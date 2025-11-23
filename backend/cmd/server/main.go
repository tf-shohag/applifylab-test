package main

import (
	"log"

	"github.com/applifylab/social-feed-backend/internal/config"
	"github.com/applifylab/social-feed-backend/internal/database"
	"github.com/applifylab/social-feed-backend/internal/handlers"
	"github.com/applifylab/social-feed-backend/internal/middleware"
	"github.com/gin-gonic/gin"
)

func main() {
	// Load configuration
	cfg := config.Load()

	// Connect to database
	if err := database.Connect(cfg); err != nil {
		log.Fatal("Failed to connect to database:", err)
	}

	// Run migrations
	if err := database.AutoMigrate(); err != nil {
		log.Fatal("Failed to run migrations:", err)
	}

	// Initialize Gin
	router := gin.Default()

	// Apply CORS middleware
	router.Use(middleware.CORSMiddleware(cfg))

	// Initialize handlers
	authHandler := handlers.NewAuthHandler(cfg)
	postHandler := handlers.NewPostHandler(cfg)
	commentHandler := handlers.NewCommentHandler(cfg)
	uploadHandler := handlers.NewUploadHandler(cfg)

	// Public routes
	api := router.Group("/api")
	{
		// Auth routes
		auth := api.Group("/auth")
		{
			auth.POST("/register", authHandler.Register)
			auth.POST("/login", authHandler.Login)
		}
	}

	// Protected routes
	protected := api.Group("")
	protected.Use(middleware.AuthMiddleware(cfg))
	{
		// Auth routes
		protected.GET("/auth/me", authHandler.GetMe)

		// Post routes
		posts := protected.Group("/posts")
		{
			posts.POST("", postHandler.CreatePost)
			posts.GET("", postHandler.GetPosts)
			posts.GET("/:id", postHandler.GetPost)
			posts.PUT("/:id", postHandler.UpdatePost)
			posts.DELETE("/:id", postHandler.DeletePost)
			posts.POST("/:id/like", postHandler.ToggleLike)
			posts.GET("/:id/likes", postHandler.GetPostLikes)

			// Comment routes
			posts.POST("/:id/comments", commentHandler.CreateComment)
			posts.GET("/:id/comments", commentHandler.GetComments)
		}

		// Comment routes
		comments := protected.Group("/comments")
		{
			comments.POST("/:id/replies", commentHandler.CreateReply)
			comments.GET("/:id/replies", commentHandler.GetReplies)
			comments.DELETE("/:id", commentHandler.DeleteComment)
			comments.POST("/:id/like", commentHandler.ToggleLike)
			comments.GET("/:id/likes", commentHandler.GetCommentLikes)
		}

		// Upload routes
		protected.POST("/upload", uploadHandler.UploadImage)
	}

	// Serve uploaded files
	router.GET("/uploads/:filename", uploadHandler.ServeUpload)

	// Health check
	router.GET("/health", func(c *gin.Context) {
		c.JSON(200, gin.H{"status": "ok"})
	})

	// Start server
	log.Printf("Server starting on port %s", cfg.Port)
	if err := router.Run(":" + cfg.Port); err != nil {
		log.Fatal("Failed to start server:", err)
	}
}
