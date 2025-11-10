package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"server/internal/models"
	"server/internal/services"
)

type RegHandler struct {
	service *services.RegService
}

func NewRegHandler(service *services.RegService) *RegHandler {
	return &RegHandler{service: service}
}

func (h *RegHandler) RegistrationHandler(w http.ResponseWriter, r *http.Request) {
	var err error
	slog.Debug("Check is request is POST in RegistrationHandler function")
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var credentials models.RegisterRequest
	slog.Debug("Pull login and password from request in RegistrationHandler function")
	if err = json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	isSuccess, err := h.service.Register(credentials)

	slog.Debug("Login and password is valid\n Adding to database")

	slog.Debug("Cooking response")
	response := map[string]bool{"isAuth": isSuccess}

	slog.Debug("Sending response")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

	return
}
