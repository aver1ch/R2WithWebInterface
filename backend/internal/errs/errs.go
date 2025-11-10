package errs

import "errors"

var (
	ErrUnkownPassword     = errors.New("password not found")
	ErrUnkownUser         = errors.New("user not found")
	ErrInvalidCredentials = errors.New("credentials is invalid")
)
