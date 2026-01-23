package python

import (
	"bytes"
	"fmt"
	"os"
	"os/exec"
	"path/filepath"
)

func RunRegressionScript(pythonPath, dataFile, outputDir string) (csvPath, imagePath string, err error) {
	scriptPath := filepath.Join(pythonPath, "main.py")

	cmd := exec.Command("python3", scriptPath, "--input", dataFile, "--output", outputDir)
	var stdout, stderr bytes.Buffer
	cmd.Stdout = &stdout
	cmd.Stderr = &stderr

	err = cmd.Run()
	if err != nil {
		return "", "", fmt.Errorf("python script failed: %s, stderr: %s", err, stderr.String())
	}

	csvPath = filepath.Join(outputDir, "regression_results.csv")
	imagePath = filepath.Join(outputDir, "regression_plot.png")

	if _, err := os.Stat(csvPath); os.IsNotExist(err) {
		return "", "", fmt.Errorf("CSV file not generated")
	}
	if _, err := os.Stat(imagePath); os.IsNotExist(err) {
		return "", "", fmt.Errorf("image file not generated")
	}

	return csvPath, imagePath, nil
}