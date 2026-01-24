package service

import (
	"database/sql"
	"errors"
	"strings"

	"server/internal/repository"
	"server/internal/utils"
)

type AuthService struct {
	users *repository.UserRepo
	jwt   string
}

func NewAuthService(u *repository.UserRepo, jwtSecret string) *AuthService {
	return &AuthService{users: u, jwt: jwtSecret}
}

func (s *AuthService) Register(email, password string) (string, string, error) {
	if email == "" || password == "" {
		return "", "", errors.New("email and password are required")
	}
	
	hash, err := utils.HashPassword(password)
	if err != nil {
		return "", "", errors.New("failed to hash password")
	}
	
	userID, err := s.users.Create(email, hash)
	if err != nil {
		// Check if it's a unique constraint violation
		if strings.Contains(err.Error(), "unique") || strings.Contains(err.Error(), "duplicate") {
			return "", "", errors.New("email already exists")
		}
		return "", "", errors.New("failed to create user")
	}
	
	token, err := utils.GenerateJWT(userID, s.jwt)
	if err != nil {
		return "", "", errors.New("failed to generate token")
	}
	return userID, token, nil
}

func (s *AuthService) Login(email, password string) (string, string, error) {
	if email == "" || password == "" {
		return "", "", errors.New("email and password are required")
	}
	
	u, err := s.users.GetByEmail(email)
	if err != nil {
		if err == sql.ErrNoRows {
			return "", "", errors.New("invalid credentials")
		}
		return "", "", errors.New("failed to find user")
	}
	
	if !utils.CheckPassword(u.Password, password) {
		return "", "", errors.New("invalid credentials")
	}
	
	token, err := utils.GenerateJWT(u.ID, s.jwt)
	if err != nil {
		return "", "", errors.New("failed to generate token")
	}
	return u.ID, token, nil
}
