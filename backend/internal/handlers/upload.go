package handlers

import (
	"fmt"
	"io"
	"net/http"
	"os"
	"path/filepath"
	"strings"
	"time"

	"github.com/applifylab/social-feed-backend/internal/config"
	"github.com/applifylab/social-feed-backend/internal/utils"
	"github.com/gin-gonic/gin"
	"github.com/google/uuid"
)

type UploadHandler struct {
	cfg *config.Config
}

func NewUploadHandler(cfg *config.Config) *UploadHandler {
	return &UploadHandler{cfg: cfg}
}

// UploadImage handles image file uploads
func (h *UploadHandler) UploadImage(c *gin.Context) {
	fmt.Println("DEBUG: Entering UploadImage handler")
	file, err := c.FormFile("image")
	if err != nil {
		fmt.Printf("DEBUG: Upload error: %v\n", err)
		utils.ErrorResponse(c, http.StatusBadRequest, "validation_error", "No file uploaded")
		return
	}

	// Log file details
	fmt.Printf("Received file: %s, Size: %d bytes\n", file.Filename, file.Size)

	// Validate file size
	if file.Size > h.cfg.MaxUploadSize {
		fmt.Printf("File too large: %d > %d\n", file.Size, h.cfg.MaxUploadSize)
		utils.ErrorResponse(c, http.StatusBadRequest, "file_too_large",
			fmt.Sprintf("File size exceeds maximum allowed size of %d bytes", h.cfg.MaxUploadSize))
		return
	}

	// Validate file type
	ext := strings.ToLower(filepath.Ext(file.Filename))
	fmt.Printf("File extension: %s\n", ext)
	allowedExts := map[string]bool{
		".jpg":  true,
		".jpeg": true,
		".png":  true,
		".gif":  true,
		".webp": true,
	}

	if !allowedExts[ext] {
		fmt.Printf("Invalid file extension: %s\n", ext)
		utils.ErrorResponse(c, http.StatusBadRequest, "invalid_file_type",
			"Only image files (jpg, jpeg, png, gif, webp) are allowed")
		return
	}

	// Generate unique filename
	filename := fmt.Sprintf("%s_%s%s", time.Now().Format("20060102150405"), uuid.New().String(), ext)
	filePath := filepath.Join(h.cfg.UploadDir, filename)

	// Ensure upload directory exists
	if err := os.MkdirAll(h.cfg.UploadDir, 0755); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to create upload directory")
		return
	}

	// Save file
	if err := c.SaveUploadedFile(file, filePath); err != nil {
		utils.ErrorResponse(c, http.StatusInternalServerError, "server_error", "Failed to save file")
		return
	}

	// Return URL
	imageURL := fmt.Sprintf("/uploads/%s", filename)
	utils.SuccessResponse(c, gin.H{
		"url":      imageURL,
		"filename": filename,
	}, "File uploaded successfully")
}

// ServeUpload serves uploaded files
func (h *UploadHandler) ServeUpload(c *gin.Context) {
	filename := c.Param("filename")
	filePath := filepath.Join(h.cfg.UploadDir, filename)

	// Check if file exists
	if _, err := os.Stat(filePath); os.IsNotExist(err) {
		c.JSON(http.StatusNotFound, gin.H{"error": "File not found"})
		return
	}

	// Open file
	file, err := os.Open(filePath)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to open file"})
		return
	}
	defer file.Close()

	// Get file info
	fileInfo, err := file.Stat()
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get file info"})
		return
	}

	// Set content type based on extension
	ext := strings.ToLower(filepath.Ext(filename))
	contentTypes := map[string]string{
		".jpg":  "image/jpeg",
		".jpeg": "image/jpeg",
		".png":  "image/png",
		".gif":  "image/gif",
		".webp": "image/webp",
	}

	if contentType, ok := contentTypes[ext]; ok {
		c.Header("Content-Type", contentType)
	}

	c.Header("Content-Length", fmt.Sprintf("%d", fileInfo.Size()))
	io.Copy(c.Writer, file)
}
