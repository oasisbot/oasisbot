package polls

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"oasisbot/common"
	"oasisbot/web"

	"github.com/go-chi/chi/v5"
)


func (p *Plugin) WebInit() {
	r := common.Mux;

	r.Group(func(r chi.Router) {
		r.Use(web.SessionMiddleware)
		r.Use(web.QueryPermissionMiddleware)
		r.Use(web.JSONMiddleware)

		// Get all polls
		r.Get("/api/plugins/polls", func(w http.ResponseWriter, r *http.Request) {
			id := r.Context().Value("guildID")
			polls := GetAllPollsInGuild(id.(string))
			newPolls := []FrontendPoll{}
			for _, poll := range polls {
				newPolls = append(newPolls, *poll.ToFrontend())
			}

			fmt.Println(newPolls);
			json.NewEncoder(w).Encode(newPolls)
		})

		// New poll
		r.Post("/api/plugins/polls", func(w http.ResponseWriter, r *http.Request) {
			id := r.Context().Value("guildID")
			if !CanCreatePoll(id.(string)) {
				w.WriteHeader(http.StatusMethodNotAllowed)
				return
			}

			defer r.Body.Close()
			body, _ := ioutil.ReadAll(r.Body)
			var poll Poll
			json.Unmarshal(body, &poll)
			if !ValidateCommand(id.(string), &poll) {
				w.WriteHeader(http.StatusNotAcceptable)
				return
			}
		})
	})
}