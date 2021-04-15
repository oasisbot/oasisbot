package run

import (
	"os"

	log "github.com/sirupsen/logrus"

	"oasisbot/internal/api"
	"oasisbot/internal/bot"
	"oasisbot/internal/common"
	"oasisbot/internal/common/endpoints"
	"oasisbot/internal/web"

	"github.com/jessevdk/go-flags"
)

var args = struct {
	Addr  string `long:"addr" env:"OASISBOT_ADDR" description:"Address to listen at"`
	Prod  bool   `long:"prod" env:"OASISBOT_PROD" description:"Enables production mode"`
	Debug bool   `long:"debug" env:"OASISBOT_DEBUG" description:"Enables debug mode"`
}{
	Addr: ":5000",
}

func Init() {
	// Parse flags and set up runtime environment
	if _, err := flags.Parse(&args); err != nil {
		os.Exit(1)
	}

	log.SetFormatter(&log.TextFormatter{
		ForceColors: true,
	})

	if !args.Prod && !args.Debug {
		log.Fatal("specify --prod or --debug to run")
	} else if args.Prod && args.Debug {
		log.Fatal("must specify either --prod or --debug")
	}

	mode := "production"
	if args.Debug {
		mode = "debug"
		log.SetLevel(log.TraceLevel)
	} else {
		log.SetLevel(log.InfoLevel)
	}
	log.WithFields(log.Fields{
		"mode": mode,
	}).Info("Starting OasisBot...")

	common.RegisterOptions()
	err := common.LoadConfig()
	if err != nil {
		log.Fatalln(err)
	}

	endpoints.SetupEndpoints()

	api.Create()
	bot.Init()
	common.InitDB()
}

func Run() {
	bot.Run()
	web.Run(args.Addr)
}
