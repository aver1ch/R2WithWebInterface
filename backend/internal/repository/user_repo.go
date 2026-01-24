package repository

import (
	"database/sql"
	"time"

	"github.com/google/uuid"
)

type UserRepo struct {
	db *sql.DB
}

type User struct {
	ID        string    `json:"id"`
	Email     string    `json:"email"`
	Password  string    `json:"-"`
	CreatedAt time.Time `json:"created_at"`
}

type Upload struct {
	ID        string    `json:"id"`
	UserID    string    `json:"user_id"`
	Filename  string    `json:"filename"`
	TargetR2  float64   `json:"target_r2"`
	R2Score   float64   `json:"r2_score"`
	Status    string    `json:"status"`
	CSVPath   string    `json:"csv_path"`
	ImagePath string    `json:"image_path"`
	CreatedAt time.Time `json:"created_at"`
}

func NewUserRepo(db *sql.DB) *UserRepo {
	return &UserRepo{db: db}
}

func (r *UserRepo) FindByEmail(email string) (string, string, error) {
	var id, password string
	err := r.db.QueryRow("SELECT id, password FROM users WHERE email = $1", email).Scan(&id, &password)
	return id, password, err
}

func (r *UserRepo) GetByEmail(email string) (*User, error) {
	var u User
	err := r.db.QueryRow("SELECT id, email, password, created_at FROM users WHERE email = $1", email).Scan(&u.ID, &u.Email, &u.Password, &u.CreatedAt)
	if err != nil {
		return nil, err
	}
	return &u, nil
}

func (r *UserRepo) Create(email, password string) (string, error) {
	id := uuid.New().String()
	_, err := r.db.Exec("INSERT INTO users (id, email, password) VALUES ($1, $2, $3)", id, email, password)
	return id, err
}

func (r *UserRepo) SaveUpload(upload *Upload) error {
	upload.ID = uuid.New().String()
	_, err := r.db.Exec(`
		INSERT INTO uploads (id, user_id, filename, target_r2, r2_score, status, csv_path, image_path, created_at)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
	`, upload.ID, upload.UserID, upload.Filename, upload.TargetR2, upload.R2Score, upload.Status, upload.CSVPath, upload.ImagePath, upload.CreatedAt)
	return err
}

func (r *UserRepo) GetUploads(userID string) ([]Upload, error) {
	rows, err := r.db.Query(`
		SELECT id, user_id, filename, target_r2, r2_score, status, csv_path, image_path, created_at
		FROM uploads WHERE user_id = $1 ORDER BY created_at DESC
	`, userID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var uploads []Upload
	for rows.Next() {
		var u Upload
		if err := rows.Scan(&u.ID, &u.UserID, &u.Filename, &u.TargetR2, &u.R2Score, &u.Status, &u.CSVPath, &u.ImagePath, &u.CreatedAt); err != nil {
			return nil, err
		}
		uploads = append(uploads, u)
	}
	return uploads, nil
}
