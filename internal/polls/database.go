package polls

import (
	"context"
	"oasisbot/internal/common"
	"time"

	"go.mongodb.org/mongo-driver/bson"
)

func addPoll(poll *Poll) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := common.Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(common.DB_NAME).Collection(common.COL_POLLS)
	if _, err := collection.InsertOne(ctx, poll); err != nil {
		return err
	}
	return nil
}

func deletePoll(ID string) error {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := common.Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(common.DB_NAME).Collection(common.COL_POLLS)
	if _, err := collection.DeleteOne(ctx, bson.M{"message_id": ID}); err != nil {
		return err
	} else {
		return nil
	}
}

func getAllPolls() ([]*Poll, error) {
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	client := common.Connect(ctx)
	defer client.Disconnect(ctx)
	defer cancel()

	collection := client.Database(common.DB_NAME).Collection(common.COL_POLLS)
	cur, err := collection.Find(ctx, bson.D{})
	if err != nil {
		return nil, err
	}
	defer cur.Close(context.Background())

	var polls []*Poll
	for cur.Next(context.Background()) {
		result := Poll{}
		err := cur.Decode(&result)
		if err != nil {
			return nil, err
		}

		polls = append(polls, &result)
	}

	if err := cur.Err(); err != nil {
		return nil, err
	} else {
		return polls, nil
	}
}