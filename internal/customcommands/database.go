package customcommands

import (
	"context"
	"oasisbot/internal/common"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
)

func getAllCommands() ([]Command, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := common.Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(common.DB_NAME).Collection(common.COL_COMMANDS)
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cur.Close(context.Background())

	var commands []Command
	for cur.Next(context.Background()) {
		result := Command{}
		err := cur.Decode(&result)
		if err != nil {
			return nil, err
		}

		commands = append(commands, result)
	}

	if err := cur.Err(); err != nil {
		return nil, err
	} else {
		return commands, nil
	}
}

func getAllCommandsInGuild(id string) ([]Command, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := common.Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(common.DB_NAME).Collection(common.COL_COMMANDS)
	cur, err := collection.Find(ctx, bson.D{primitive.E{Key: "guildID", Value: id}})
	if err != nil {
		return nil, err
	}
	defer cur.Close(context.Background())

	var commands []Command
	for cur.Next(context.Background()) {
		result := Command{}
		err := cur.Decode(&result)
		if err != nil {
			return nil, err
		}

		commands = append(commands, result)
	}

	if err := cur.Err(); err != nil {
		return nil, err
	} else {
		return commands, nil
	}
}

func getCommand(guildID string, name string) (*Command, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := common.Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(common.DB_NAME).Collection(common.COL_COMMANDS)

	var command Command
	err := collection.FindOne(ctx, bson.D{
		primitive.E{Key: "guildID", Value: guildID},
		primitive.E{Key: "name", Value: name},
	}).Decode(&command)
	if err != nil {
		return nil, err
	}
	return &command, nil
}

func addCommand(command *Command) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := common.Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(common.DB_NAME).Collection(common.COL_COMMANDS)
	if _, err := collection.InsertOne(ctx, command); err != nil {
		return err
	}
	return nil
}

func updateCommand(name string, new *Command) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := common.Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(common.DB_NAME).Collection(common.COL_COMMANDS)
	update := bson.D{primitive.E{Key: "$set", Value: *new}}
	if _, err := collection.UpdateOne(
		ctx,
		bson.M{"guildID": new.GuildID, "name": name},
		update,
	); err != nil {
		return err
	} else {
		return nil
	}
}

func deleteCommand(guildID string, name string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := common.Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(common.DB_NAME).Collection(common.COL_COMMANDS)
	if _, err := collection.DeleteOne(ctx, bson.M{"guildID": guildID, "name": name}); err != nil {
		return err
	} else {
		return nil
	}
}
