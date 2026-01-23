package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"server/internal/models"
	"server/internal/services"
)

type AuthHandler struct {
	service *services.AuthService
}

func NewAuthHandler(service *services.AuthService) *AuthHandler {
	return &AuthHandler{service: service}
}

func (h *AuthHandler) LoginHandler(w http.ResponseWriter, r *http.Request) {
	slog.Info("Check is request is POST in LoginHandler function")
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var credentials models.LoginRequest
	slog.Info("Pull login and password from request in LoginHandler function")
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	token, err := h.service.Login(credentials)
	if err != nil {
		slog.Error("Login failed", "error", err)
		http.Error(w, err.Error(), http.StatusUnauthorized)
		return
	}

	slog.Info("Login successful. Cooking response")

	response := map[string]interface{}{
		"success": true,
		"token":   token,
	}

	slog.Info("Sending response")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}
