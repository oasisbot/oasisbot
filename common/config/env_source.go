package config

import (
	"os"
	"strings"
)

type EnvSource struct{}

func (e EnvSource) GetValue(key string) interface{} {
	aptKey := strings.ToUpper(key)
	aptKey = strings.Replace(aptKey, ".", "_", -1)

	value := os.Getenv(aptKey)
	if value == "" {
		return nil
	}
	return value
}
