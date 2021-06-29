package customcommands

import (
	"encoding/json"
	"io/ioutil"
	"net/http"
	"oasisbot/common"
	"oasisbot/web"

	"github.com/go-chi/chi/v5"
)

func (p *Plugin) WebInit() {
	r := common.Mux

	r.Group(func(r chi.Router) {
		r.Use(web.SessionMiddleware)
		r.Use(web.QueryPermissionMiddleware)
		r.Use(web.JSONMiddleware)

		r.Get("/api/plugins/commands", func(w http.ResponseWriter, r *http.Request) {
			id := r.Context().Value("guildID")
			commands := GetAllCommandsInGuild(id.(string))
			a := []Command{}
			for _, c := range commands {
				a = append(a, *c)
			}
			json.NewEncoder(w).Encode(a)
		})

		r.Post("/api/plugins/commands", func(w http.ResponseWriter, r *http.Request) {
			// TODO: Permission checking to see if user has permission to add a command
			id := r.Context().Value("guildID")

			defer r.Body.Close()
			body, _ := ioutil.ReadAll(r.Body)
			var command Command
			json.Unmarshal(body, &command)
			if !ValidateCommand(id.(string), &command) {
				w.WriteHeader(http.StatusNotAcceptable)
				return
			}

			if err := AddCommand(id.(string), &command); err == nil {
				json.NewEncoder(w).Encode(command)
			} else {
				w.WriteHeader(http.StatusBadRequest)
			}
		})

		r.Patch("/api/plugins/commands/{commandName}", func(w http.ResponseWriter, r *http.Request) {
			id := r.Context().Value("guildID")
			commandName := chi.URLParam(r, "commandName")

			defer r.Body.Close()
			body, _ := ioutil.ReadAll(r.Body)
			var command Command
			json.Unmarshal(body, &command)
			if !ValidateCommand(id.(string), &command) {
				w.WriteHeader(http.StatusNotAcceptable)
				return
			}

			if err := UpdateCommand(id.(string), commandName, &command); err == nil {
				json.NewEncoder(w).Encode(command)
			} else {
				w.WriteHeader(http.StatusBadRequest)
				return
			}
		})

		r.Delete("/api/plugins/commands/{commandName}", func(w http.ResponseWriter, r *http.Request) {
			id := r.Context().Value("guildID")
			commandName := chi.URLParam(r, "commandName")

			if err := DeleteCommand(id.(string), commandName); err != nil {
				w.WriteHeader(http.StatusBadRequest)
			} else {
				w.WriteHeader(http.StatusOK)
			}
		})
	})
}
