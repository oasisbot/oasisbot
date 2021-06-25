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
			fmt.Println(len(polls))
			landing := CreateFrontendLanding(polls)
			fmt.Println(len(landing.Polls))
			json.NewEncoder(w).Encode(landing)
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
			var poll PollCreate
			json.Unmarshal(body, &poll)
			if !ValidPoll(id.(string), &poll) {
				w.WriteHeader(http.StatusNotAcceptable)
				return
			}
			
			reactions := reactionsToStrings(poll.Reactions)
			err := NewPoll(id.(string), poll.ChannelID, poll.Content, poll.ReactionMessages, poll.EndsAt, reactions)
			if err != nil {
				fmt.Println(err)
			}
		})
	})
}