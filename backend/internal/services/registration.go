package services

import (
	"server/internal/errs"
	"server/internal/models"
	"server/internal/repository"
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
	if !checkCredentials(req.Password, req.Login) {
		return false, errs.ErrInvalidCredentials
	}

	err := s.repo.Create(models.NewUser(req.Login, req.Password))
	if err != nil {
		return false, err
	}
	return true, nil
}

func checkCredentials(password string, login string) bool {
	return password != "" && login != ""
}
