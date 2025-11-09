package handlers

import (
	"encoding/json"
	"log/slog"
	"net/http"
	"server/internal/models"
)

func RegistrationHandler(w http.ResponseWriter, r *http.Request) {
	slog.Debug("Check is request is POST in RegistrationHandler function")
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	var credentials models.RegisterRequest

	slog.Debug("Pull login and password from request in RegistrationHandler function")
	if err := json.NewDecoder(r.Body).Decode(&credentials); err != nil {
		http.Error(w, "invalid json", http.StatusBadRequest)
		return
	}

	slog.Debug("Login and password is valid\n Adding to database")

	slog.Debug("Cooking response")
	response := map[string]string{"token": "good"}

	slog.Debug("Sending response")
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)

	return
}
