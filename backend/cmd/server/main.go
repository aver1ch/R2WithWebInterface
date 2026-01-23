package main

import (
	"flag"
	"fmt"
	"log"
	"net/http"
	"os"
	"path/filepath"

	"server/internal/db"
	"server/internal/handlers"
	"server/internal/middleware"
	"server/internal/models"
	"server/internal/repository"
	"server/internal/services"
)

func main() {
	// CLI flags
	host := flag.String("host", "localhost", "Server host")
	port := flag.Int("port", 8080, "Server port")
	dbHost := flag.String("db-host", "localhost", "Database host")
	dbPort := flag.Int("db-port", 5432, "Database port")
	dbUser := flag.String("db-user", "user", "Database user")
	dbPassword := flag.String("db-password", "password", "Database password")
	dbName := flag.String("db-name", "app", "Database name")
	pythonPath := flag.String("python-path", "regression", "Path to Python scripts directory")

	flag.Parse()

	// Set environment variables for database
	os.Setenv("DB_HOST", *dbHost)
	os.Setenv("DB_PORT", fmt.Sprintf("%d", *dbPort))
	os.Setenv("DB_USER", *dbUser)
	os.Setenv("DB_PASSWORD", *dbPassword)
	os.Setenv("DB_NAME", *dbName)

	// Connect to database
	db, err := db.ConnectDB()
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Auto-migrate database
	if err := db.AutoMigrate(&models.User{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	// Initialize repositories
	userRepo := repository.NewUserRepository(db)

	// Initialize services
	regService := services.NewRegService(userRepo)
	authService := services.NewAuthService(userRepo)

	// Initialize handlers
	regHandler := handlers.NewRegHandler(regService)
	authHandler := handlers.NewAuthHandler(authService)

	// Get absolute path to python scripts
	absPythonPath, err := filepath.Abs(*pythonPath)
	if err != nil {
		log.Fatalf("Failed to get absolute path for python scripts: %v", err)
	}

	runHandler := handlers.NewRunHandler(absPythonPath)

	// Routes
	http.HandleFunc("/register", regHandler.RegistrationHandler)
	http.HandleFunc("/login", authHandler.LoginHandler)

	// Protected routes
	http.Handle("/run", middleware.AuthMiddleware(http.HandlerFunc(runHandler.RunHandler)))
	http.Handle("/run/csv", middleware.AuthMiddleware(http.HandlerFunc(runHandler.DownloadCSV)))
	http.Handle("/run/image", middleware.AuthMiddleware(http.HandlerFunc(runHandler.DownloadImage)))

	// Start server
	addr := fmt.Sprintf("%s:%d", *host, *port)
	log.Printf("Server starting on %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}
