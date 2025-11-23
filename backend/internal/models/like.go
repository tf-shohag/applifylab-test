package models

import (
	"time"
)

type Like struct {
	ID           uint      `gorm:"primaryKey" json:"id"`
	UserID       uint      `gorm:"not null;index:idx_user_likeable" json:"user_id"`
	LikeableType string    `gorm:"size:50;not null;index:idx_likeable" json:"likeable_type"`
	LikeableID   uint      `gorm:"not null;index:idx_likeable" json:"likeable_id"`
	CreatedAt    time.Time `json:"created_at"`

	// Relationships
	User User `gorm:"foreignKey:UserID" json:"user,omitempty"`
}

// TableName specifies the table name for Like model
func (Like) TableName() string {
	return "likes"
}
