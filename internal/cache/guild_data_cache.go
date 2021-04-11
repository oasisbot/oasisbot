package cache

import (
	"errors"
	"oasisbot/internal/common"
)

var GuildData GuildDataStore

type GuildDataStore struct {
	Cache map[string]*common.Guild
}

func init() {
	GuildData.Cache = make(map[string]*common.Guild)
}

func (g *GuildDataStore) Add(guild *common.Guild) *common.Guild {
	g.Cache[guild.GuildID] = guild
	return g.Cache[guild.GuildID]
}

func (g *GuildDataStore) Update(guild *common.Guild) error {
	err := common.UpdateGuild(guild)
	if err != nil {
		return err
	}
	g.Cache[guild.GuildID] = guild
	return nil
}

func (g *GuildDataStore) Fetch(id string, useDB bool) (*common.Guild, error) {
	existing := g.Cache[id]
	if existing != nil {
		return existing, nil
	}
	if useDB {
		data, err := common.GetGuildByID(id)
		if err != nil {
			return nil, err
		}
		return g.Add(data), nil
	}
	return nil, errors.New("Not found")
}
