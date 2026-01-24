package handlers

import (
	"encoding/json"
	"io"
	"net/http"
	"os"
	"strconv"

	"server/internal/service"
)

type UploadHandler struct {
	reg *service.RegressionService
}

func NewUploadHandler(r *service.RegressionService) *UploadHandler {
	return &UploadHandler{reg: r}
}

func (h *UploadHandler) Upload(w http.ResponseWriter, r *http.Request) {
	// Get userID from context
	userID, ok := r.Context().Value("user_id").(string)
	if !ok {
		http.Error(w, "unauthorized", http.StatusUnauthorized)
		return
	}

	// Parse multipart form
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	// Get parameters
	targetR2 := 0.8
	if tr := r.FormValue("target_r2"); tr != "" {
		if parsed, err := strconv.ParseFloat(tr, 64); err == nil {
			targetR2 = parsed
		}
	}

	// Get file
	file, fileHeader, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	filename := fileHeader.Filename

	// Save temp file
	tmp, err := os.CreateTemp("", "upload-*.csv")
	if err != nil {
		http.Error(w, "Error creating temp file", http.StatusInternalServerError)
		return
	}
	defer os.Remove(tmp.Name())

	if _, err := io.Copy(tmp, file); err != nil {
		tmp.Close()
		http.Error(w, "Error saving file", http.StatusInternalServerError)
		return
	}
	tmp.Close()

	// Run regression
	result, err := h.reg.Run(tmp.Name(), targetR2)
	if err != nil {
		http.Error(w, err.Error(), 500)
		return
	}

	// Read CSV file content
	var csvData string
	if csvPath, ok := result["csv_path"].(string); ok && csvPath != "" {
		if data, err := os.ReadFile(csvPath); err == nil {
			csvData = string(data)
		}
	}

	// Save to history (log error but don't fail the request)
	if err := h.reg.SaveHistory(userID, filename, result); err != nil {
		// Log error but don't fail the request
		// Could use a logger here
	}

	// Prepare response
	response := map[string]interface{}{
		"success":         result["success"],
		"r2_score":        result["r2_score"],
		"target_r2":       result["target_r2"],
		"target_achieved": result["target_achieved"],
		"csv_data":        csvData,
		"csv_path":        result["csv_path"],
		"image_path":      result["image_path"],
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *UploadHandler) DownloadCSV(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")
	if path == "" {
		http.Error(w, "Path required", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Disposition", "attachment; filename=regression_results.csv")
	w.Header().Set("Content-Type", "text/csv")
	http.ServeFile(w, r, path)
}

func (h *UploadHandler) DownloadImage(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")
	if path == "" {
		http.Error(w, "Path required", http.StatusBadRequest)
		return
	}

	w.Header().Set("Content-Disposition", "attachment; filename=regression_plot.png")
	w.Header().Set("Content-Type", "image/png")
	http.ServeFile(w, r, path)
}
