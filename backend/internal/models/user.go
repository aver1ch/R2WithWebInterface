package models

type User struct {
	Login    string `bson:"id"`
	Password string `bson:"login"`
}

func NewUser(login string, password string) *User {
	return &User{Login: login, Password: password}
}
