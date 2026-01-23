package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Email        string `gorm:"uniqueIndex;size:255" json:"email"`
	PasswordHash string `gorm:"size:255" json:"-"`
}

func NewUser(email, passwordHash string) *User {
	return &User{
		Email:        email,
		PasswordHash: passwordHash,
	}
}
