package web

import (
	"context"
	"net/http"

	"oasisbot/internal/common"
	"oasisbot/internal/util"
)

func SessionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		c, err := r.Cookie("session_token")
		if err != nil {
			if err == http.ErrNoCookie {
				w.WriteHeader(http.StatusUnauthorized)
				return
			}
			// Status bad request is acceptable for an error here
			w.WriteHeader(http.StatusBadRequest)
			return
		}
		sessionToken := c.Value

		client, ok := clients[sessionToken]
		if !ok { // Session token not present, return unauthorized
			w.WriteHeader(http.StatusUnauthorized)
			return
		}

		ctx := context.WithValue(r.Context(), "token", client.Token)
		ctx = context.WithValue(ctx, "userID", client.UserID)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func JSONMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Add("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func QueryPermissionMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var userID string = r.Context().Value("userID").(string)

		id := r.URL.Query().Get("id")
		if len(id) < 1 {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		// Add a new guildID value to the context
		ctx := context.WithValue(r.Context(), "guildID", id)

		guild, err := common.BotSession.State.Guild(id)
		member, err := common.BotSession.State.Member(id, userID)
		if err != nil {
			w.WriteHeader(http.StatusLocked)
			return
		}
		if canModify, authorityLevel := util.CanModifyGuild(guild, member, userID); canModify {
			ctx = context.WithValue(ctx, "guild", guild)
			ctx = context.WithValue(ctx, "member", member)
			ctx = context.WithValue(ctx, "authorityLevel", authorityLevel)
			next.ServeHTTP(w, r.WithContext(ctx))
			return
		}

		w.WriteHeader(http.StatusUnauthorized)
	})
}
