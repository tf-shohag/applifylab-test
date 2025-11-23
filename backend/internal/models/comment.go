package models

import (
	"time"

	"gorm.io/gorm"
)

type Comment struct {
	ID              uint           `gorm:"primaryKey" json:"id"`
	PostID          uint           `gorm:"not null;index" json:"post_id"`
	UserID          uint           `gorm:"not null;index" json:"user_id"`
	ParentCommentID *uint          `gorm:"index" json:"parent_comment_id,omitempty"`
	Content         string         `gorm:"type:text;not null" json:"content"`
	CreatedAt       time.Time      `json:"created_at"`
	UpdatedAt       time.Time      `json:"updated_at"`
	DeletedAt       gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	Post     Post      `gorm:"foreignKey:PostID" json:"post,omitempty"`
	User     User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Parent   *Comment  `gorm:"foreignKey:ParentCommentID" json:"parent,omitempty"`
	Replies  []Comment `gorm:"foreignKey:ParentCommentID" json:"replies,omitempty"`
	Likes    []Like    `gorm:"polymorphic:Likeable;polymorphicValue:comment" json:"likes,omitempty"`

	// Computed fields
	LikesCount   int64 `gorm:"-" json:"likes_count"`
	RepliesCount int64 `gorm:"-" json:"replies_count"`
	IsLiked      bool  `gorm:"-" json:"is_liked"`
}

// CommentResponse is the public representation of a comment
type CommentResponse struct {
	ID              uint         `json:"id"`
	PostID          uint         `json:"post_id"`
	ParentCommentID *uint        `json:"parent_comment_id,omitempty"`
	Content         string       `json:"content"`
	CreatedAt       time.Time    `json:"created_at"`
	UpdatedAt       time.Time    `json:"updated_at"`
	User            UserResponse `json:"user"`
	LikesCount      int64        `json:"likes_count"`
	RepliesCount    int64        `json:"replies_count"`
	IsLiked         bool         `json:"is_liked"`
}

// ToResponse converts Comment to CommentResponse
func (c *Comment) ToResponse() CommentResponse {
	return CommentResponse{
		ID:              c.ID,
		PostID:          c.PostID,
		ParentCommentID: c.ParentCommentID,
		Content:         c.Content,
		CreatedAt:       c.CreatedAt,
		UpdatedAt:       c.UpdatedAt,
		User:            c.User.ToResponse(),
		LikesCount:      c.LikesCount,
		RepliesCount:    c.RepliesCount,
		IsLiked:         c.IsLiked,
	}
}
