package common

import (
	"context"
	"errors"
	"time"

	log "github.com/sirupsen/logrus"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

const (
	DB_NAME = "oasisbot"

	COL_GUILDS   = "guilds"
	COL_COMMANDS = "commands"
	COL_POLLS = "polls"
)

func Connect(ctx context.Context) *mongo.Client {
	client, err := mongo.NewClient(options.Client().ApplyURI(ConfMongoDBURI.GetString()))
	if err != nil {
		log.Fatal(err)
	}
	err = client.Connect(ctx)
	if err != nil {
		log.Fatal(err)
	}
	return client
}

func InitDB() {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()
	log.Info("Established connection with MongoDB")
}

func AddGuild(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(DB_NAME).Collection(COL_GUILDS)
	update := bson.D{
		{Key: "$set", Value: bson.D{{Key: "guildID", Value: id}}},
		{Key: "$set", Value: bson.D{{Key: "prefix", Value: "&"}}},
	}
	options := options.Update().SetUpsert(true)
	if _, err := collection.UpdateOne(
		ctx,
		bson.M{"guildID": id},
		update,
		options,
	); err != nil {
		return err
	}

	return nil
}

func UpdateGuild(guild *Guild) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(DB_NAME).Collection(COL_GUILDS)
	update := bson.D{primitive.E{Key: "$set", Value: *guild}}
	if _, err := collection.UpdateOne(
		ctx,
		bson.M{"guildID": guild.GuildID},
		update,
	); err != nil {
		return err
	} else {
		return nil
	}
}

func RemoveGuild(id string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(DB_NAME).Collection(COL_GUILDS)
	if _, err := collection.DeleteOne(ctx, bson.D{primitive.E{Key: "guildID", Value: id}}); err != nil {
		return err
	}

	return nil
}

func GetAllGuilds() ([]Guild, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(DB_NAME).Collection(COL_GUILDS)
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cur.Close(context.Background())

	var guilds []Guild
	for cur.Next(context.Background()) {
		result := Guild{}
		err := cur.Decode(&result)
		if err != nil {
			return nil, err
		}

		guilds = append(guilds, result)
	}

	if err := cur.Err(); err != nil {
		return nil, err
	} else {
		return guilds, nil
	}
}

func GetGuildByID(id string) (*Guild, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(DB_NAME).Collection(COL_GUILDS)

	var guild Guild
	err := collection.FindOne(ctx, bson.D{primitive.E{Key: "guildID", Value: id}}).Decode(&guild)
	if err != nil {
		return nil, errors.New("Document not found!")
	} else {
		return &guild, nil
	}
}
