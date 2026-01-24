package config

import "os"

type Config struct {
	DBUrl     string
	JWTSecret string
	PythonBin string
}

func Load() *Config {
	return &Config{
		DBUrl:     os.Getenv("DATABASE_URL"),
		JWTSecret: os.Getenv("JWT_SECRET"),
		PythonBin: getEnv("PYTHON_BIN", "python3"),
	}
}

func getEnv(key, fallback string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return fallback
}
