package services

import (
	"errors"
	"server/internal/models"
	"server/internal/repository"
	"server/internal/utils"
)

type RegService struct {
	repo *repository.UserRepository
}

func NewRegService(u *repository.UserRepository) *RegService {
	return &RegService{
		repo: u,
	}
}

func (s *RegService) Register(req models.RegisterRequest) (bool, error) {
	if !checkCredentials(req.Password, req.Email) {
		return false, errors.New("invalid credentials")
	}

	_, err := s.repo.FindByEmail(req.Email)
	if err == nil {
		return false, errors.New("user already exists")
	}

	hashedPassword, err := utils.HashPassword(req.Password)
	if err != nil {
		return false, err
	}

	err = s.repo.Create(models.NewUser(req.Email, hashedPassword))
	if err != nil {
		return false, err
	}
	return true, nil
}

func checkCredentials(password string, email string) bool {
	return password != "" && email != ""
}
