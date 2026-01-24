package service

import (
	"encoding/json"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
	"time"

	"server/internal/repository"
)

type RegressionService struct {
	users  *repository.UserRepo
	python string
}

func NewRegressionService(u *repository.UserRepo, python string) *RegressionService {
	return &RegressionService{users: u, python: python}
}

func (s *RegressionService) Run(csvPath string, targetR2 float64) (map[string]interface{}, error) {
	// Create output directory
	outputDir, err := os.MkdirTemp("", "regression-output-*")
	if err != nil {
		return nil, err
	}

	// Get the directory where the executable is located
	execPath, err := os.Executable()
	if err != nil {
		return nil, fmt.Errorf("failed to get executable path: %v", err)
	}
	execDir := filepath.Dir(execPath)
	
	// Try to find regression script relative to executable
	scriptPath := filepath.Join(execDir, "regression", "main.py")
	if _, err := os.Stat(scriptPath); os.IsNotExist(err) {
		// Fallback to relative path from current working directory
		scriptPath = filepath.Join("regression", "main.py")
		if _, err := os.Stat(scriptPath); os.IsNotExist(err) {
			// Try from backend directory
			scriptPath = filepath.Join("backend", "regression", "main.py")
		}
	}

	// Run Python script with working directory set to script's directory
	scriptDir := filepath.Dir(scriptPath)
	cmd := exec.Command(s.python, scriptPath, "--target_r2",
		fmt.Sprintf("%.2f", targetR2),
		"--input", csvPath, "--output", outputDir)
	cmd.Dir = scriptDir

	output, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("python script failed: %s", string(output))
	}

	// Parse JSON output from Python script
	var pythonResult map[string]interface{}
	if err := json.Unmarshal(output, &pythonResult); err != nil {
		return nil, fmt.Errorf("failed to parse python output: %s", string(output))
	}

	// Check if Python script returned an error
	if success, ok := pythonResult["success"].(bool); !ok || !success {
		if errMsg, ok := pythonResult["error"].(string); ok {
			return nil, fmt.Errorf("python script error: %s", errMsg)
		}
		return nil, fmt.Errorf("python script failed: %s", string(output))
	}

	// Find generated files
	var csvPathResult, imagePath string
	entries, _ := os.ReadDir(outputDir)
	for _, entry := range entries {
		fullPath := filepath.Join(outputDir, entry.Name())
		if filepath.Ext(entry.Name()) == ".csv" {
			csvPathResult = fullPath
		} else if filepath.Ext(entry.Name()) == ".png" {
			imagePath = fullPath
		}
	}

	// Get R2 score from Python result
	var r2Score float64
	if score, ok := pythonResult["r2_score"].(float64); ok {
		r2Score = score
	}

	result := map[string]interface{}{
		"success":         true,
		"csv_path":        csvPathResult,
		"image_path":      imagePath,
		"r2_score":        r2Score,
		"target_r2":       targetR2,
		"target_achieved": r2Score >= targetR2,
	}

	return result, nil
}

func (s *RegressionService) SaveHistory(userID, filename string, result map[string]interface{}) error {
	var r2Score, targetR2 float64
	var csvPath, imagePath string

	if val, ok := result["r2_score"].(float64); ok {
		r2Score = val
	}
	if val, ok := result["target_r2"].(float64); ok {
		targetR2 = val
	}
	if val, ok := result["csv_path"].(string); ok {
		csvPath = val
	}
	if val, ok := result["image_path"].(string); ok {
		imagePath = val
	}

	upload := &repository.Upload{
		UserID:    userID,
		Filename:  filename,
		TargetR2:  targetR2,
		R2Score:   r2Score,
		Status:    "completed",
		CSVPath:   csvPath,
		ImagePath: imagePath,
		CreatedAt: time.Now(),
	}
	return s.users.SaveUpload(upload)
}

func (s *RegressionService) GetHistory(userID string) ([]repository.Upload, error) {
	return s.users.GetUploads(userID)
}
