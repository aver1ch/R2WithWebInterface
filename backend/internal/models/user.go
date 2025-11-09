package models

type User struct {
	Id       string `bson:"id"`
	Password string `bson:"login"`
}
