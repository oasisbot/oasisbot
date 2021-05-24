package main

import (
	"oasisbot/common/run"
	"oasisbot/customcommands"
	"oasisbot/polls"
)

func main() {
	run.Init()

	customcommands.RegisterPlugin()
	polls.RegisterPlugin()

	run.Run()
}
