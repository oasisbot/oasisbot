package customcommands

import (
	"errors"
	"fmt"
	"oasisbot/internal/common"
	"oasisbot/internal/common/templates"
	"strconv"
	"strings"

	"github.com/bwmarrin/discordgo"
)

func init() {
	templates.RegisterSetupFuncs(func(ctx *templates.Context) {
		ctx.CtxFuncs["parseArgs"] = expectArgs(ctx)
		ctx.CtxFuncs["arg"] = templateArg
	})
}

func expectArgs(ctx *templates.Context) interface{} {
	return func(required int, failMessage string, args ...*ArgDef) (*ParsedArgs, error) {
		finalParse := &ParsedArgs{}
		// Make sure provided message can be parsed for args
		if len(args) == 0 || ctx.Message == nil || ctx.Data["StrippedMsg"] == nil {
			return finalParse, nil
		}
		// Populate the struct with the argument definitions
		finalParse.defs = args
		// Get the stripped message from the command text
		stripped := ctx.Data["StrippedMsg"].(string)
		split := strings.Fields(stripped)
		err := ParseArgDefs(args, required, ctx, split[1:])
		if err != nil {
			if failMessage != "" {
				ctx.FixedOutput = err.Error() + "\n" + failMessage
			} else {
				ctx.FixedOutput = err.Error()
			}
		}

		if err == nil {
			finalParse.parsed = ctx.Data["Args"].([]*ParsedArg)
		}
		return finalParse, err
	}
}

func ParseArgDefs(defs []*ArgDef, required int, ctx *templates.Context, fields []string) error {
	if len(fields) < required {
		return errors.New("Not enough aruments!")
	}
	parsedArgs := NewParsedArgs(defs)

	var high int
	if len(fields) < len(defs) {
		high = len(fields)
	} else {
		high = len(defs)
	}

	for i := 0; i < high; i++ {
		d := defs[i]
		if !d.Type.Matches(d, fields[i]) {
			return errors.New("Invalid value " + fields[i] + "!")
		}
		val, err := d.Type.Parse(d, fields[i], ctx)
		if err != nil {
			return err
		}
		parsedArgs[i].Value = val
	}

	ctx.Data["Args"] = parsedArgs
	return nil
}

func templateArg(typ string, name string, options ...interface{}) (*ArgDef, error) {
	d := &ArgDef{Name: name}
	switch typ {
	case "int":
		if len(options) >= 2 {
			d.Type = &IntArg{Min: templates.ToInt64(options[0]), Max: templates.ToInt64(options[1])}
		} else {
			d.Type = &IntArg{}
		}
	case "float":
		if len(options) >= 2 {
			d.Type = &FloatArg{Min: templates.ToFloat64(options[0]), Max: templates.ToFloat64(options[1])}
		} else {
			d.Type = &FloatArg{}
		}
	case "string":
		d.Type = &StringArg{}
	case "user":
		if len(options) > 0 {
			val, ok := options[0].(bool)
			if !ok {
				val = false
			}
			d.Type = &UserArg{RequireMention: val}
		} else {
			d.Type = &UserArg{}
		}
	case "userid":
		d.Type = &UserIDArg{}
	case "channel":
		d.Type = &ChannelArg{}
	default:
		return nil, errors.New("Unknown type!")
	}
	return d, nil
}

func NewParsedArgs(defs []*ArgDef) []*ParsedArg {
	out := make([]*ParsedArg, len(defs))
	for k := range out {
		out[k] = &ParsedArg{
			Def: defs[k],
		}
	}
	return out
}

type ParsedArgs struct {
	defs   []*ArgDef
	parsed []*ParsedArg
}

func (pa *ParsedArgs) Get(index int) interface{} {
	if len(pa.parsed) <= index {
		return nil
	}
	return pa.parsed[index].Value
}

type ArgDef struct {
	Name string
	Type ArgType
}

type ArgType interface {
	Matches(def *ArgDef, part string) bool
	Parse(def *ArgDef, part string, ctx *templates.Context) (v interface{}, err error)
}

type ParsedArg struct {
	Def   *ArgDef
	Value interface{}
}

type IntArg struct {
	Max, Min int64
}

func (i *IntArg) Matches(def *ArgDef, part string) bool {
	_, err := strconv.ParseInt(part, 10, 64)
	return err == nil
}
func (i *IntArg) Parse(def *ArgDef, part string, ctx *templates.Context) (v interface{}, err error) {
	value, err := strconv.ParseInt(part, 10, 64)
	if err != nil {
		return nil, errors.New("Invalid int!")
	}

	if i.Max != i.Min {
		if value < i.Min || value > i.Max {
			return nil, &OutOfRangeError{ArgName: def.Name, Got: value, Min: i.Min, Max: i.Max, Float: false}
		}
	}

	return value, nil
}

type FloatArg struct {
	Min, Max float64
}

func (f *FloatArg) Matches(def *ArgDef, part string) bool {
	_, err := strconv.ParseFloat(part, 64)
	return err == nil
}
func (f *FloatArg) Parse(def *ArgDef, part string, ctx *templates.Context) (v interface{}, err error) {
	value, err := strconv.ParseFloat(part, 64)
	if err != nil {
		return nil, errors.New("Invalid float!")
	}

	if f.Max != f.Min {
		if value < f.Min || value > f.Max {
			return nil, &OutOfRangeError{ArgName: def.Name, Got: value, Min: f.Min, Max: f.Max, Float: true}
		}
	}

	return value, nil
}

type StringArg struct{}

func (s *StringArg) Matches(def *ArgDef, part string) bool { return true }
func (s *StringArg) Parse(def *ArgDef, part string, ctx *templates.Context) (interface{}, error) {
	return part, nil
}

type UserArg struct {
	RequireMention bool
}

func (u *UserArg) Matches(def *ArgDef, part string) bool { return true }
func (u *UserArg) Parse(def *ArgDef, part string, ctx *templates.Context) (interface{}, error) {
	if strings.HasPrefix(part, "<@") && len(part) > 3 {
		userID := part[2 : len(part)-1] // <@|userID|>
		if userID[0] == '!' {           // Nickname mentions start with '!'
			userID = userID[1:] // !|userID
		}
		for _, mentioned := range ctx.Message.Mentions {
			if userID == mentioned.ID {
				return *mentioned, nil
			}
		}
		return nil, errors.New("Invalid mention!")
	} else if !u.RequireMention {
		member, err := MemberByName(ctx.Guild, part)
		if err != nil {
			return nil, err
		}
		return *(member.User), nil
	}

	return nil, errors.New("Invalid mention!")
}

type UserIDArg struct{}

func (u *UserIDArg) Matches(def *ArgDef, part string) bool { return true }
func (u *UserIDArg) Parse(def *ArgDef, part string, ctx *templates.Context) (interface{}, error) {
	member, err := common.BotSession.State.Member(ctx.Guild.ID, part)
	if err != nil {
		return nil, errors.New("Invalid userID!")
	}
	return *member, nil
}

type ChannelArg struct{}

func (c *ChannelArg) Matches(def *ArgDef, part string) bool {
	// Since channel can be a string, we have to assume it matches for now
	return true
}
func (c *ChannelArg) Parse(def *ArgDef, part string, ctx *templates.Context) (interface{}, error) {
	var cid = part // Start with assuming provided *is* the channel ID
	if strings.HasPrefix(part, "<#") && len(part) > 3 {
		cid = part[2 : len(part)-1] // <#|channelID|>
	}

	for _, ch := range ctx.Guild.Channels {
		if ch.ID == cid {
			return *ch, nil
		}
	}
	return nil, errors.New("Invalid channel!")
}

func MemberByName(guild *discordgo.Guild, str string) (*discordgo.Member, error) {
	lowered := strings.ToLower(str)
	partialMatches := make([]*discordgo.Member, 0, 5)
	fullMatches := make([]*discordgo.Member, 0, 5)

	for _, v := range guild.Members {
		if v == nil {
			continue
		}
		if v.User.Username == "" {
			continue
		}
		if strings.EqualFold(str, v.User.Username) || strings.EqualFold(str, v.Nick) {
			fullMatches = append(fullMatches, &(*v))
			if len(fullMatches) >= 5 {
				break
			}
		} else if len(partialMatches) < 5 {
			if strings.Contains(strings.ToLower(v.User.Username), lowered) {
				partialMatches = append(partialMatches, v)
			}
		}
	}

	if len(fullMatches) == 1 {
		return &(*fullMatches[0]), nil
	}

	if len(fullMatches) == 0 && len(partialMatches) == 0 {
		return nil, errors.New("User not found!")
	}

	out := ""
	for _, v := range fullMatches {
		if out != "" {
			out += ", "
		}
		out += "`" + v.User.Username + "`"
	}
	for _, v := range partialMatches {
		if out != "" {
			out += ", "
		}
		out += "`" + v.User.Username + "`"
	}

	if len(fullMatches) > 1 {
		return nil, errors.New("Too many users have the name " + out + "! Try rerunning with a more narrow search.")
	}

	return nil, errors.New("Match not found, perhaps one of these? " + out)
}

type OutOfRangeError struct {
	Min, Max interface{}
	Got      interface{}
	Float    bool
	ArgName  string
}

func (e *OutOfRangeError) Error() string {
	pre := "too big"
	switch e.Got.(type) {
	case int64:
		if e.Got.(int64) < e.Min.(int64) {
			pre = "too small"
		}
	case float64:
		if e.Got.(float64) < e.Min.(float64) {
			pre = "too small"
		}
	}

	const floatFormat = "%s is %s (has to be within %f - %f)"
	const intFormat = "%s is %s (has to be within %d - %d)"

	if e.Float {
		return fmt.Sprintf(floatFormat, e.ArgName, pre, e.Min, e.Max)
	}

	return fmt.Sprintf(intFormat, e.ArgName, pre, e.Min, e.Max)
}
