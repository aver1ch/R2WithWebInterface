package main

import (
	"database/sql"
	"flag"
	"fmt"
	"log"
	"net/http"

	_ "github.com/lib/pq"

	"server/internal/config"
	"server/internal/db"
	"server/internal/handlers"
	"server/internal/middleware"
	"server/internal/repository"
	"server/internal/service"
)

func main() {
	cfg := config.Load()

	database, err := db.Connect(cfg.DBUrl)
	if err != nil {
		log.Fatalf("Failed to connect to database: %v", err)
	}

	// Initialize database tables
	initDB(database)

	port := flag.String("port", "8080", "Server port")
	flag.Parse()

	users := repository.NewUserRepo(database)
	authService := service.NewAuthService(users, cfg.JWTSecret)
	regService := service.NewRegressionService(users, cfg.PythonBin)

	authH := handlers.NewAuthHandler(authService)
	upH := handlers.NewUploadHandler(regService)
	histH := handlers.NewHistoryHandler(users)

	// Apply CORS middleware to all routes
	http.HandleFunc("/register", middleware.CORS(http.HandlerFunc(authH.Register)).ServeHTTP)
	http.HandleFunc("/login", middleware.CORS(http.HandlerFunc(authH.Login)).ServeHTTP)
	http.HandleFunc("/health", middleware.CORS(http.HandlerFunc(healthHandler)).ServeHTTP)
	http.Handle("/run", middleware.CORS(middleware.Auth(http.HandlerFunc(upH.Upload))))
	http.Handle("/run/csv", middleware.CORS(middleware.Auth(http.HandlerFunc(upH.DownloadCSV))))
	http.Handle("/run/image", middleware.CORS(middleware.Auth(http.HandlerFunc(upH.DownloadImage))))
	http.Handle("/history", middleware.CORS(middleware.Auth(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		userID := r.Context().Value("user_id").(string)
		histH.GetHistory(w, r, userID)
	}))))

	addr := fmt.Sprintf(":%s", *port)
	log.Printf("Server starting on %s", addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

func healthHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Write([]byte(`{"status": "healthy"}`))
}

func initDB(database *sql.DB) {
	// Create users table
	_, err := database.Exec(`
		CREATE TABLE IF NOT EXISTS users (
			id TEXT PRIMARY KEY,
			email TEXT UNIQUE NOT NULL,
			password TEXT NOT NULL,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
		)
	`)
	if err != nil {
		log.Printf("Warning: Failed to create users table: %v", err)
	}

	// Create uploads table for history
	_, err = database.Exec(`
		CREATE TABLE IF NOT EXISTS uploads (
			id TEXT PRIMARY KEY,
			user_id TEXT NOT NULL,
			filename TEXT NOT NULL,
			target_r2 REAL,
			r2_score REAL,
			status TEXT,
			csv_path TEXT,
			image_path TEXT,
			created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
			FOREIGN KEY (user_id) REFERENCES users(id)
		)
	`)
	if err != nil {
		log.Printf("Warning: Failed to create uploads table: %v", err)
	}

	// Create indexes
	_, err = database.Exec(`CREATE INDEX IF NOT EXISTS idx_uploads_user_id ON uploads(user_id)`)
	if err != nil {
		log.Printf("Warning: Failed to create index: %v", err)
	}
}
