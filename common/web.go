package common

import "github.com/go-chi/chi/v5"

var Mux *chi.Mux

func CreateMux() *chi.Mux {
	Mux = chi.NewMux()
	return Mux
}

func WebInit() {
	for _, plugin := range Plugins {
		if p, ok := plugin.(WebInitHandler); ok {
			p.WebInit()
		}
	}
}

type WebInitHandler interface {
	WebInit()
}
