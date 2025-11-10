package services

import (
	"server/internal/errs"
	"server/internal/models"
	"server/internal/repository"
)

type AuthService struct {
	repo *repository.UserRepository
}

func NewAuthService(u *repository.UserRepository) *AuthService {
	return &AuthService{
		repo: u,
	}
}

func (s *AuthService) Login(req models.LoginRequest) (bool, error) {
	user, err := s.repo.FindByLogin(req.Login)
	if err != nil {
		return false, errs.ErrUnkownUser
	}

	if !checkPassword(user.Password, req.Password) {
		return false, errs.ErrUnkownPassword
	}

	return true, nil
}

func checkPassword(password string, login string) bool {
	return password == login
}
