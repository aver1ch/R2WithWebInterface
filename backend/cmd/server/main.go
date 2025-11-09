package main

import (
	"log/slog"
	"net/http"
	"os"
	"path/filepath"

	"server/internal/db"
	"server/internal/handlers"
)

func main() {
	slog.Info("Server starts\n Initialization of database")
	client := db.ConnectMongo("mongodb://localhost:27017")
	db := client.Database("myapp") // создастся автоматически

	distDir := "../frontend/dist"
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

	http.HandleFunc("/api/login", handlers.LoginHandler)
	http.HandleFunc("/api/register", handlers.RegistrationHandler)

	http.ListenAndServe(":8080", nil)
}
