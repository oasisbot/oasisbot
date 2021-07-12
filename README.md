# OasisBot

The current state of the project is... well I don't really have that much motivation to work on this since there are a ton of general-purpose Discord bots already out there.
I also decided that I don't really like working with Go so this is especially difficult.

Perhaps if there is some sort of feature suggestion that I find very interesting and a good idea I may resume progress.

### Running Locally

Requirements:
- Go
- npm
- MongoDB remote database
- Discord bot application (https://discord.com/developers/applications)

#### How to set up the Discord application

Follow the steps at https://discordpy.readthedocs.io/en/stable/discord.html or any other online resource and once you are done, 
make sure to add the following endpoints in the redirects section of the oauth2 tab on the left:

- `http://localhost:3000/auth/callback`
- `http://localhost:3000/guild-oauth`
- `http://localhost:5000/auth/callback`
- `http://localhost:5000/guild-oauth`

Ideally, the bot should not be able to be invited to a server without receiving permission to do so from the backend.
For this reason, head over to the bot section on the left, and under "REQUIRES OAUTH2 CODE GRANT" make sure the toggle is enabled.

#### Running the bot

For config setup, all you need is some environment variables set, and there are a lot of ways to do this. I would recommend navigating to `/common/config` 
and creating a file called `setup.go` in which you set the environment variables. It might look something like this:
```go
package config

import "os"

func init() {
  os.Setenv("ENVIRONMENT_VARIABLE_ONE", "VALUE_ONE")
  os.Setenv("ENVIRONMENT_VARIABLE_TWO", "VALUE_TWO")
  // etc.
}
```
The following environment variables are required and must be set:
- `OASISBOT_BOT_OWNER` (copy your Discord user ID if you have developer mode enabled for Discord)
- `OASISBOT_CLIENT_ID` (follow the steps in the application portal and once you have your application, copy the application ID)
- `OASISBOT_CLIENT_SECRET` (once you have your application head over to the oauth2 tab in the left and click copy under client secret)
- `OASISBOT_BOT_TOKEN` (once you have your application head over to the bot tab and click copy under token)
- `OASISBOT_MONGODB_URI` (you will need to create a mMngoDB application on mongodb.com and get the URI to it)
- `OASISBOT_DOMAIN` (for running locally you can just set this to `http://localhost:5000`)
- `OASISBOT_DEVELOPER_SERVER_ID` (create a server in which you will be primarily testing the bot and copy its ID)

The following environment variables are optional:
- `OASISBOT_PLUGINS_POLLS_INTERVAL`
- `OASISBOT_PLUGINS_POLLS_GUILD_POLL_LIMIT`

One everything has been defined, install all of the dependencies with
```
go get -d ./...
```
Finally, you can start the backend with
```
go run . --debug
```
From there, navigate to `/frontend` in the root directory and run
```
npm run build
```
Now you should be able to see the application at `localhost:5000`

If something isn't working please let me know! I'd be more than happy to help troubleshoot.
