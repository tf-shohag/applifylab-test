package models

import (
	"time"

	"gorm.io/gorm"
)

type Post struct {
	ID        uint           `gorm:"primaryKey" json:"id"`
	UserID    uint           `gorm:"not null;index" json:"user_id"`
	Content   string         `gorm:"type:text;not null" json:"content"`
	ImageURL  string         `gorm:"size:500" json:"image_url,omitempty"`
	IsPrivate bool           `gorm:"default:false" json:"is_private"`
	CreatedAt time.Time      `json:"created_at"`
	UpdatedAt time.Time      `json:"updated_at"`
	DeletedAt gorm.DeletedAt `gorm:"index" json:"-"`

	// Relationships
	User     User      `gorm:"foreignKey:UserID" json:"user,omitempty"`
	Comments []Comment `gorm:"foreignKey:PostID" json:"comments,omitempty"`
	Likes    []Like    `gorm:"polymorphic:Likeable;polymorphicValue:post" json:"likes,omitempty"`

	// Computed fields
	LikesCount    int64 `gorm:"-" json:"likes_count"`
	CommentsCount int64 `gorm:"-" json:"comments_count"`
	IsLiked       bool  `gorm:"-" json:"is_liked"`
}

// PostResponse is the public representation of a post
type PostResponse struct {
	ID            uint         `json:"id"`
	Content       string       `json:"content"`
	ImageURL      string       `json:"image_url,omitempty"`
	IsPrivate     bool         `json:"is_private"`
	CreatedAt     time.Time    `json:"created_at"`
	UpdatedAt     time.Time    `json:"updated_at"`
	User          UserResponse `json:"user"`
	LikesCount    int64        `json:"likes_count"`
	CommentsCount int64        `json:"comments_count"`
	IsLiked       bool         `json:"is_liked"`
}

// ToResponse converts Post to PostResponse
func (p *Post) ToResponse() PostResponse {
	return PostResponse{
		ID:            p.ID,
		Content:       p.Content,
		ImageURL:      p.ImageURL,
		IsPrivate:     p.IsPrivate,
		CreatedAt:     p.CreatedAt,
		UpdatedAt:     p.UpdatedAt,
		User:          p.User.ToResponse(),
		LikesCount:    p.LikesCount,
		CommentsCount: p.CommentsCount,
		IsLiked:       p.IsLiked,
	}
}
