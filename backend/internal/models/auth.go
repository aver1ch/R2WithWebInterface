package models

type LoginRequest struct {
	Login    string `bson:"login"`
	Password string `bson:"password"`
}

type RegisterRequest struct {
	Login    string `bson:"login"`
	Password string `bson:"password"`
}

type AuthResponse struct {
	Token string `bson:"token"`
	User  User   `bson:"user"`
}
