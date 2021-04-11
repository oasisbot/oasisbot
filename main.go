package main

import (
	"oasisbot/internal/common/run"
	"oasisbot/internal/customcommands"
)

func main() {
	run.Init()

	customcommands.RegisterPlugin()

	run.Run()
}
