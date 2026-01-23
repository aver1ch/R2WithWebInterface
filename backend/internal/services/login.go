package services

import (
	"errors"
	"server/internal/models"
	"server/internal/repository"
	"server/internal/utils"
)

type AuthService struct {
	repo *repository.UserRepository
}

func NewAuthService(u *repository.UserRepository) *AuthService {
	return &AuthService{
		repo: u,
	}
}

func (s *AuthService) Login(req models.LoginRequest) (string, error) {
	user, err := s.repo.FindByEmail(req.Email)
	if err != nil {
		return "", errors.New("user not found")
	}

	if !utils.CheckPassword(req.Password, user.PasswordHash) {
		return "", errors.New("invalid password")
	}

	token, err := utils.GenerateToken(int64(user.ID), user.Email)
	if err != nil {
		return "", err
	}

	return token, nil
}
