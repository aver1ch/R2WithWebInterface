package handlers

import (
	"encoding/json"
	"fmt"
	"io"
	"log/slog"
	"net/http"
	"os"
	"os/exec"
	"path/filepath"
)

type RunHandler struct {
	pythonPath string
}

func NewRunHandler(pythonPath string) *RunHandler {
	return &RunHandler{
		pythonPath: pythonPath,
	}
}

func (h *RunHandler) RunHandler(w http.ResponseWriter, r *http.Request) {
	slog.Info("Check if request is POST in RunHandler")
	if r.Method != http.MethodPost {
		http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
		return
	}

	// Parse multipart form
	err := r.ParseMultipartForm(10 << 20) // 10 MB max
	if err != nil {
		http.Error(w, "Error parsing form", http.StatusBadRequest)
		return
	}

	// Get target_r2
	targetR2 := r.FormValue("target_r2")
	if targetR2 == "" {
		targetR2 = "0.8" // Default value
	}

	// Get file
	file, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "Error retrieving file", http.StatusBadRequest)
		return
	}
	defer file.Close()

	// Create temp file
	tempDir := os.TempDir()
	tempFile, err := os.CreateTemp(tempDir, "upload-*.csv")
	if err != nil {
		http.Error(w, "Error creating temp file", http.StatusInternalServerError)
		return
	}
	defer os.Remove(tempFile.Name()) // Clean up

	// Copy uploaded file to temp file
	fileBytes, err := io.ReadAll(file)
	if err != nil {
		http.Error(w, "Error reading file", http.StatusInternalServerError)
		return
	}
	if _, err := tempFile.Write(fileBytes); err != nil {
		http.Error(w, "Error writing temp file", http.StatusInternalServerError)
		return
	}
	if err := tempFile.Close(); err != nil {
		http.Error(w, "Error closing temp file", http.StatusInternalServerError)
		return
	}

	// Create output directory with timestamp
	outputDir, err := os.MkdirTemp("", "regression-output-*")
	if err != nil {
		http.Error(w, "Error creating output directory", http.StatusInternalServerError)
		return
	}
	defer os.RemoveAll(outputDir) // Clean up

	slog.Info("Executing Python script", "target_r2", targetR2)

	// Execute Python script
	scriptPath := filepath.Join(h.pythonPath, "main.py")

	cmd := exec.Command("python3", scriptPath, "--target_r2", targetR2, "--input", tempFile.Name(), "--output", outputDir)
	output, err := cmd.CombinedOutput()
	if err != nil {
		slog.Error("Error executing python script", "error", err, "output", string(output))
		http.Error(w, fmt.Sprintf("Error executing script: %s", string(output)), http.StatusInternalServerError)
		return
	}

	slog.Info("Python script executed successfully")

	// Find generated files
	var csvPath, imagePath string
	entries, err := os.ReadDir(outputDir)
	if err != nil {
		http.Error(w, "Error reading output directory", http.StatusInternalServerError)
		return
	}

	for _, entry := range entries {
		name := entry.Name()
		fullPath := filepath.Join(outputDir, name)
		if filepath.Ext(name) == ".csv" {
			csvPath = fullPath
		} else if filepath.Ext(name) == ".png" {
			imagePath = fullPath
		}
	}

	// Return file paths and script output
	response := map[string]interface{}{
		"success":       true,
		"csv_path":      csvPath,
		"image_path":    imagePath,
		"script_output": string(output),
	}

	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(response)
}

func (h *RunHandler) DownloadCSV(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")
	if path == "" {
		http.Error(w, "Path required", http.StatusBadRequest)
		return
	}

	file, err := os.Open(path)
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	defer file.Close()

	w.Header().Set("Content-Disposition", "attachment; filename=regression_results.csv")
	w.Header().Set("Content-Type", "text/csv")
	http.ServeFile(w, r, path)
}

func (h *RunHandler) DownloadImage(w http.ResponseWriter, r *http.Request) {
	path := r.URL.Query().Get("path")
	if path == "" {
		http.Error(w, "Path required", http.StatusBadRequest)
		return
	}

	file, err := os.Open(path)
	if err != nil {
		http.Error(w, "File not found", http.StatusNotFound)
		return
	}
	defer file.Close()

	w.Header().Set("Content-Disposition", "attachment; filename=regression_plot.png")
	w.Header().Set("Content-Type", "image/png")
	http.ServeFile(w, r, path)
}
