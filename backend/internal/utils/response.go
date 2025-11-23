package utils

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

type Response struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data,omitempty"`
	Error   string      `json:"error,omitempty"`
	Message string      `json:"message,omitempty"`
}

type PaginatedResponse struct {
	Success bool        `json:"success"`
	Data    interface{} `json:"data"`
	Page    int         `json:"page"`
	Limit   int         `json:"limit"`
	Total   int64       `json:"total"`
	HasMore bool        `json:"has_more"`
}

// SuccessResponse sends a successful JSON response
func SuccessResponse(c *gin.Context, data interface{}, message string) {
	c.JSON(http.StatusOK, Response{
		Success: true,
		Data:    data,
		Message: message,
	})
}

// ErrorResponse sends an error JSON response
func ErrorResponse(c *gin.Context, statusCode int, err string, message string) {
	c.JSON(statusCode, Response{
		Success: false,
		Error:   err,
		Message: message,
	})
}

// PaginatedSuccessResponse sends a paginated successful JSON response
func PaginatedSuccessResponse(c *gin.Context, data interface{}, page, limit int, total int64) {
	hasMore := int64(page*limit) < total
	c.JSON(http.StatusOK, PaginatedResponse{
		Success: true,
		Data:    data,
		Page:    page,
		Limit:   limit,
		Total:   total,
		HasMore: hasMore,
	})
}
