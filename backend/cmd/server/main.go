package main

import (
	"log/slog"
	"net/http"
	"os"
	"path/filepath"

	"server/internal/db"
	"server/internal/handlers"
	"server/internal/repository"
	"server/internal/services"
)

func main() {
	slog.Info("Server starts\n Initialization of database")
	client := db.ConnectMongo("mongodb://localhost:27017")
	db := client.Database("R2")

	distDir := "../frontend/web_interface/build"
	fs := http.FileServer(http.Dir(distDir))

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		path := filepath.Join(distDir, r.URL.Path)
		_, err := os.Stat(path)
		if os.IsNotExist(err) {
			http.ServeFile(w, r, filepath.Join(distDir, "index.html"))
			return
		}
		fs.ServeHTTP(w, r)
	})
	slog.Info("Initialization of repositories")
	userRepo := repository.NewUserRepository(db.Collection("users"))
	slog.Info("Collection users is created")

	slog.Info("Initialization of services")
	regService := services.NewRegService(userRepo)
	authService := services.NewAuthService(userRepo)
	slog.Info("Initialization of services successful")

	slog.Info("Initialization of handlers")
	regHandler := handlers.NewRegHandler(regService)
	authHandler := handlers.NewAuthHandler(authService)
	slog.Info("Initialization of handlers successful")

	slog.Info("Initialization of routes")
	http.HandleFunc("/api/login", authHandler.LoginHandler)
	http.HandleFunc("/api/register", regHandler.RegistrationHandler)
	slog.Info("Initialization of routes successful")

	http.ListenAndServe(":8080", nil)
}
