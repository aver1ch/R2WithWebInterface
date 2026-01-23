package utils

import (
	"crypto/rand"
	"encoding/hex"
	"fmt"

	"golang.org/x/crypto/scrypt"
)

const (
	saltLen = 16
	keyLen  = 64
	N       = 32768
	r       = 8
	p       = 1
)

func HashPassword(password string) (string, error) {
	salt := make([]byte, saltLen)
	_, err := rand.Read(salt)
	if err != nil {
		return "", fmt.Errorf("failed to generate salt: %w", err)
	}

	hash, err := scrypt.Key([]byte(password), salt, N, r, p, keyLen)
	if err != nil {
		return "", fmt.Errorf("failed to hash password: %w", err)
	}

	return fmt.Sprintf("%s:%s", hex.EncodeToString(salt), hex.EncodeToString(hash)), nil
}

func CheckPassword(password, stored string) bool {
	var saltHex, hashHex string
	fmt.Sscanf(stored, "%s:%s", &saltHex, &hashHex)

	salt, err := hex.DecodeString(saltHex)
	if err != nil {
		return false
	}

	hash, err := scrypt.Key([]byte(password), salt, N, r, p, keyLen)
	if err != nil {
		return false
	}

	return hex.EncodeToString(hash) == hashHex
}
