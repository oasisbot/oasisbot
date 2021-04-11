package web

import (
	"context"
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"oasisbot/internal/api"
	"oasisbot/internal/cache"
	"oasisbot/internal/common"
	"oasisbot/internal/common/endpoints"
	"oasisbot/internal/customcommands"
	"oasisbot/internal/util"
	"os"
	"time"

	"github.com/bwmarrin/discordgo"
	"github.com/go-chi/chi/v5"
	"github.com/go-chi/chi/v5/middleware"
	"github.com/google/uuid"
	"golang.org/x/oauth2"
	"golang.org/x/sync/errgroup"
)

type Client struct {
	Token  *oauth2.Token
	UserID string
}

var clients map[string]*Client

func Run(address string) {
	ctx := context.Background()
	g, ctx := errgroup.WithContext(ctx)
	r := chi.NewRouter()

	clients = map[string]*Client{}

	fileServer(r)
	r.Group(func(r chi.Router) {
		r.Use(middleware.NoCache)

		r.Get("/auth/callback", func(w http.ResponseWriter, r *http.Request) {
			code := r.URL.Query().Get("code")

			token, err := api.OauthConf.Exchange(oauth2.NoContext, code)
			if err != nil {
				fmt.Println(err)
				w.WriteHeader(http.StatusInternalServerError)
				w.Write([]byte(err.Error()))
				return
			}

			res, err := api.OauthConf.Client(oauth2.NoContext, token).Get(endpoints.EndpointDiscordAPIUsersMe)
			if err != nil || res.StatusCode != 200 {
				w.WriteHeader(http.StatusInternalServerError)
				return
			}

			defer res.Body.Close()
			body, _ := ioutil.ReadAll(res.Body)
			var user discordgo.User
			json.Unmarshal(body, &user)

			sessionToken := uuid.New().String()
			clients[sessionToken] = &Client{
				Token:  token,
				UserID: user.ID,
			}

			http.SetCookie(w, &http.Cookie{
				Name:    "session_token",
				Value:   sessionToken,
				Expires: time.Now().Add(315360000 * time.Second),
				Path:    "/",
			})

			http.Redirect(w, r, "/dashboard", http.StatusSeeOther)
		})

		r.Group(func(r chi.Router) {
			r.Use(SessionMiddleware)

			// Used for getting the bot to join server
			r.Get("/guild-oauth", func(w http.ResponseWriter, r *http.Request) {
				var _ *oauth2.Token = r.Context().Value("token").(*oauth2.Token)
				// TODO: use token to validate that user has permission to use dashboard

				code := r.URL.Query().Get("code")
				guildID := r.URL.Query().Get("guild_id")

				if len(code) < 1 || len(guildID) < 1 {
					w.WriteHeader(http.StatusBadRequest)
					return
				}

				_, err := api.OauthConfBot.Exchange(oauth2.NoContext, code)
				if err != nil {
					fmt.Println(err)
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				}

				http.Redirect(w, r, fmt.Sprintf("/d/%s", guildID), http.StatusSeeOther)
			})

			r.Get("/api/users/@me", func(w http.ResponseWriter, r *http.Request) {
				user, err := api.GetMe(r)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					return
				}

				if userJson, err := json.Marshal(common.CreateUser(user.ID, user.Username, user.Avatar)); err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					w.Write([]byte(err.Error()))
					return
				} else {
					w.Write(userJson)
				}
			})

			r.Get("/api/users/@me/guilds", func(w http.ResponseWriter, r *http.Request) {
				guilds, err := api.GetMeGuilds(r)
				if err != nil {
					w.WriteHeader(http.StatusInternalServerError)
					return
				}

				var newGuilds []discordgo.UserGuild
				var user *discordgo.User = nil
			OUTER:
				for _, guild := range *guilds {
					if guild.Permissions&0x00000020 == 0x00000020 { // User has permission to manage server
						newGuilds = append(newGuilds, guild)
					} else if data, _ := cache.GuildData.Fetch(guild.ID, false); data != nil {
						if user == nil {
							user, err = api.GetMe(r)
							if err != nil {
								continue OUTER
							}
						}
						member, _ := common.BotSession.State.Member(data.GuildID, user.ID)
						for _, role := range member.Roles {
							for _, master := range data.Masters {
								if role == master {
									newGuilds = append(newGuilds, guild)
								}
							}
						}
					}
				}

				var sendGuilds = make([]common.GuildPreviewSend, len(newGuilds))
				foundGuilds, err := common.GetAllGuilds()
				if err != nil {
					fmt.Println(err)
					return
				}
				for i, guild := range newGuilds {
					hasGuild := false
					for _, v := range foundGuilds {
						if v.GuildID == guild.ID {
							hasGuild = true
							break
						}
					}
					sendGuilds[i] = common.CreatePreviewGuild(guild.ID, guild.Name, guild.Icon, hasGuild)
				}

				w.Header().Set("Content-Type", "application/json")
				json.NewEncoder(w).Encode(sendGuilds)
			})

			r.Group(func(r chi.Router) {
				r.Use(QueryPermissionMiddleware)
				r.Use(JSONMiddleware)

				r.Get("/api/guild_data", func(w http.ResponseWriter, r *http.Request) {
					id := r.Context().Value("guildID").(string)
					authorityLevel := r.Context().Value("authorityLevel").(common.AuthorityLevel)

					guildChan := make(chan *discordgo.Guild, 1)
					guildDataChan := make(chan *common.Guild, 1)

					g, _ := errgroup.WithContext(r.Context())
					g.Go(func() error {
						result, err := common.BotSession.State.Guild(id)
						if result != nil {
							guildChan <- result
						}
						return err
					})

					g.Go(func() error {
						result, err := cache.GuildData.Fetch(id, true)
						if result != nil {
							guildDataChan <- result
						}
						return err
					})

					guild := <-guildChan
					guildData := <-guildDataChan
					err := g.Wait()
					if err != nil {
						w.WriteHeader(http.StatusInternalServerError)
						return
					}

					var roles []discordgo.Role
					var channels []discordgo.Channel
					for _, role := range guild.Roles {
						roles = append(roles, *role)
					}
					for _, channel := range guild.Channels {
						channels = append(channels, *channel)
					}

					sendGuild := common.GuildSend{
						ID:             guild.ID,
						Name:           guild.Name,
						Icon:           guild.Icon,
						Prefix:         guildData.Prefix,
						Masters:        guildData.Masters,
						Roles:          roles,
						Channels:       channels,
						AuthorityLevel: authorityLevel,
					}

					json.NewEncoder(w).Encode(sendGuild)
				})

				r.Patch("/api/dashboard/settings", func(w http.ResponseWriter, r *http.Request) {
					guild := r.Context().Value("guild").(*discordgo.Guild)
					member := r.Context().Value("member").(*discordgo.Member)
					authorityLevel := r.Context().Value("authorityLevel").(common.AuthorityLevel)
					// At this point, we already know that they have access, but if they are a bot master and don't
					// have the manage server permission, they shouldn't be able to edit the bot masters
					hasHighAuthority := util.HasPermission(guild, member, discordgo.PermissionManageServer)
					body, _ := ioutil.ReadAll(r.Body)
					var settings common.SettingsRequest
					json.Unmarshal(body, &settings)
					if !common.ValidateSettings(guild.ID, &settings) {
						w.WriteHeader(http.StatusBadRequest)
						return
					}

					currentData, _ := cache.GuildData.Fetch(guild.ID, true)
					if !hasHighAuthority {
						if len(currentData.Masters) != len(settings.BotMasters) {
							w.WriteHeader(http.StatusUnauthorized)
							return
						}
						for i, master := range currentData.Masters {
							if settings.BotMasters[i] != master {
								w.WriteHeader(http.StatusUnauthorized)
								return
							}
						}
					}

					updated := &common.Guild{
						GuildID: guild.ID,
						Masters: settings.BotMasters,
						Prefix:  settings.Prefix,
					}
					if err := cache.GuildData.Update(updated); err == nil {
						var roles []discordgo.Role
						var channels []discordgo.Channel
						for _, role := range guild.Roles {
							roles = append(roles, *role)
						}
						for _, channel := range guild.Channels {
							channels = append(channels, *channel)
						}
						json.NewEncoder(w).Encode(common.GuildSend{
							ID:             guild.ID,
							Name:           guild.Name,
							Icon:           guild.Icon,
							Prefix:         updated.Prefix,
							Masters:        updated.Masters,
							Roles:          roles,
							Channels:       channels,
							AuthorityLevel: authorityLevel,
						})
					} else {
						w.WriteHeader(http.StatusInternalServerError)
					}
				})

				r.Get("/api/plugins/commands", func(w http.ResponseWriter, r *http.Request) {
					id := r.Context().Value("guildID")
					commands := customcommands.GetAllCommandsInGuild(id.(string))
					a := []customcommands.Command{}
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
					var command customcommands.Command
					json.Unmarshal(body, &command)
					if !customcommands.ValidateCommand(id.(string), &command) {
						w.WriteHeader(http.StatusNotAcceptable)
						return
					}

					if err := customcommands.AddCommand(id.(string), &command); err == nil {
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
					var command customcommands.Command
					json.Unmarshal(body, &command)
					if !customcommands.ValidateCommand(id.(string), &command) {
						w.WriteHeader(http.StatusNotAcceptable)
						return
					}

					if err := customcommands.UpdateCommand(id.(string), commandName, &command); err == nil {
						json.NewEncoder(w).Encode(command)
					} else {
						w.WriteHeader(http.StatusBadRequest)
						return
					}
				})

				r.Delete("/api/plugins/commands/{commandName}", func(w http.ResponseWriter, r *http.Request) {
					id := r.Context().Value("guildID")
					commandName := chi.URLParam(r, "commandName")

					if err := customcommands.DeleteCommand(id.(string), commandName); err != nil {
						w.WriteHeader(http.StatusBadRequest)
					} else {
						w.WriteHeader(http.StatusOK)
					}
				})
			})
		})
	})

	runServer(ctx, g, address, r)
	exitErr := g.Wait()
	log.Fatal("Server exited:", exitErr)
}

func fileServer(router *chi.Mux) {
	root := "../../frontend/build"
	fs := http.FileServer(http.Dir(root))

	router.Get("/*", func(w http.ResponseWriter, r *http.Request) {
		if _, err := os.Stat(root + r.RequestURI); os.IsNotExist(err) {
			http.StripPrefix(r.RequestURI, fs).ServeHTTP(w, r)
		} else {
			fs.ServeHTTP(w, r)
		}
	})
}

func runServer(ctx context.Context, g *errgroup.Group, addr string, handler http.Handler) {
	httpSrv := http.Server{
		Addr:        addr,
		Handler:     handler,
		BaseContext: func(_ net.Listener) context.Context { return ctx },
	}

	g.Go(func() error {
		<-ctx.Done()

		ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
		defer cancel()

		return httpSrv.Shutdown(ctx)
	})

	g.Go(httpSrv.ListenAndServe)

	log.Println(fmt.Sprintf("Web server running on port %s", addr))
}
