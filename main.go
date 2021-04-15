package main

import (
	"oasisbot/internal/common/run"
	"oasisbot/internal/customcommands"
	"oasisbot/internal/polls"
)

func main() {
	run.Init()

	customcommands.RegisterPlugin()
	polls.RegisterPlugin()

	run.Run()
}
