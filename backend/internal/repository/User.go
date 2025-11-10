package repository

import (
	"context"
	"server/internal/models"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
)

type UserRepository struct {
	db *mongo.Collection
}

func NewUserRepository(db *mongo.Collection) *UserRepository {
	return &UserRepository{
		db: db,
	}
}

func (r *UserRepository) FindByLogin(login string) (*models.User, error) {
	var user models.User
	err := r.db.FindOne(context.TODO(), bson.M{"login": login}).Decode(&user)
	return &user, err
}

func (r *UserRepository) Create(user *models.User) error {
	_, err := r.db.InsertOne(context.TODO(), user)
	return err
}
