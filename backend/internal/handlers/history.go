package handlers

import (
	"encoding/json"
	"net/http"

	"server/internal/repository"
)

type HistoryHandler struct {
	users *repository.UserRepo
}

func NewHistoryHandler(u *repository.UserRepo) *HistoryHandler {
	return &HistoryHandler{users: u}
}

func (h *HistoryHandler) GetHistory(w http.ResponseWriter, r *http.Request, userID string) {
	uploads, err := h.users.GetUploads(userID)
	if err != nil {
		http.Error(w, "Error fetching history", http.StatusInternalServerError)
		return
	}

	// Convert to frontend format
	historyItems := make([]map[string]interface{}, len(uploads))
	for i, upload := range uploads {
		historyItems[i] = map[string]interface{}{
			"id":        upload.ID,
			"filename":  upload.Filename,
			"target_r2": upload.TargetR2,
			"r2_score":  upload.R2Score,
			"status":    upload.Status,
			"created_at": upload.CreatedAt.Format("2006-01-02T15:04:05Z07:00"),
		}
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(historyItems)
}
