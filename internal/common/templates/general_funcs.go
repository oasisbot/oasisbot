package templates

import (
	"encoding/json"
	"errors"
	"fmt"
	"math"
	"strconv"
	"strings"

	"github.com/bwmarrin/discordgo"
)

type Slice []interface{}
type SDict map[string]interface{}

func CreateSlice(values ...interface{}) Slice {
	slice := make([]interface{}, len(values))
	for i := 0; i < len(values); i++ {
		slice[i] = values[i]
	}
	return Slice(slice)
}

func StringDictionary(values ...interface{}) (SDict, error) {
	if len(values)%2 != 0 {
		return nil, errors.New("Not a proper dictionary!")
	}
	d := make(map[string]interface{}, len(values)/2)
	for i := 0; i < len(values); i += 2 {
		// In for loop wll be 0, 2, 4, ...
		key := values[i]
		s, ok := key.(string)
		if !ok {
			return nil, errors.New("Only string keys are allowed in an sdict!")
		}
		d[s] = values[i+1]
	}

	return SDict(d), nil
}

func CreateEmbed(values ...interface{}) (*discordgo.MessageEmbed, error) {
	if len(values) < 1 {
		return &discordgo.MessageEmbed{}, nil
	}

	var m map[string]interface{}
	switch t := values[0].(type) {
	case *discordgo.MessageEmbed:
		return t, nil
	case map[string]interface{}:
		m = t
	default:
		d, err := StringDictionary(values...)
		if err != nil {
			return nil, err
		}
		m = d
	}

	encoded, err := json.Marshal(m)
	if err != nil {
		return nil, err
	}

	var embed *discordgo.MessageEmbed
	err = json.Unmarshal(encoded, &embed)
	if err != nil {
		return nil, err
	}

	return embed, nil
}

func inc(arg interface{}) interface{} {
	switch arg.(type) {
	case int, int8, int16, int32, int64, uint8, uint16, uint32, uint64, float32, float64:
		return templateToInt(arg) + 1
	case string:
		res, err := strconv.Atoi(arg.(string))
		if err != nil {
			return "N/A"
		}
		return res + 1
	default:
		return "N/A"
	}
}

func itr(arg interface{}) (interface{}, error) {
	cap := templateToInt(arg)
	if cap < 1 {
		return nil, errors.New("Cannot iterate over a value less than 1")
	}
	if cap > 10000 {
		return nil, errors.New("Cannot iterate over a value greater than 10000")
	}
	items := make([]int, cap)
	for i := 0; i < cap; i++ {
		items[i] = i
	}
	return items, nil
}

func joinStrings(sep string, args ...interface{}) (string, error) {
	var builder strings.Builder
	for _, v := range args {
		if builder.Len() != 0 {
			builder.WriteString(sep)
		}

		switch t := v.(type) {
		case string:
			builder.WriteString(t)
		case []string:
			for j, s := range t {
				if j != 0 {
					builder.WriteString(sep)
				}
				builder.WriteString(s)
				if builder.Len() > 1000000 {
					return "", errors.New("String too long")
				}
			}

		case int, uint, int32, uint32, int64, uint64:
			builder.WriteString(ToString(v))
		case float64:
			builder.WriteString(fmt.Sprintf("%g", v))
		case fmt.Stringer:
			builder.WriteString(t.String())
		}

		if builder.Len() > 1000000 {
			return "", errors.New("String too long")
		}
	}

	return builder.String(), nil
}

func ord(arg interface{}) string {
	var suffix string
	val := ToInt64(arg)
	end := val % 10
	switch end {
	case 1:
		suffix = "st"
	case 2:
		suffix = "nd"
	case 3:
		suffix = "rd"
	default:
		suffix = "th"
	}
	return fmt.Sprintf("%v%s", val, suffix)
}

func add(args ...interface{}) interface{} {
	if len(args) < 1 {
		return 0
	}

	first := args[0]
	switch first.(type) {
	case float64, float32:
		floatSum := float64(0)
		for _, value := range args {
			floatSum += ToFloat64(value)
		}
		return floatSum
	default:
		intSum := int(0)
		for _, value := range args {
			intSum += templateToInt(value)
		}
		return intSum
	}
}

func sub(args ...interface{}) interface{} {
	if len(args) < 1 {
		return 0
	}

	first := args[0]
	switch first.(type) {
	case float64, float32:
		floatSub := ToFloat64(first)
		for i, value := range args {
			if i == 0 {
				continue
			}
			floatSub -= ToFloat64(value)
		}
		return floatSub
	default:
		intSub := templateToInt(first)
		for i, value := range args {
			if i == 0 {
				continue
			}
			intSub -= templateToInt(value)
		}
		return intSub
	}
}

func mult(args ...interface{}) interface{} {
	if len(args) < 1 {
		return 0
	}

	first := args[0]
	switch first.(type) {
	case float64, float32:
		floatSub := ToFloat64(first)
		for i, value := range args {
			if i == 0 {
				continue
			}
			floatSub *= ToFloat64(value)
		}
		return floatSub
	default:
		intSub := templateToInt(first)
		for i, value := range args {
			if i == 0 {
				continue
			}
			intSub *= templateToInt(value)
		}
		return intSub
	}
}

func div(args ...interface{}) interface{} {
	if len(args) < 1 {
		return 0
	}

	first := args[0]
	switch first.(type) {
	case float64, float32:
		floatSub := ToFloat64(first)
		for i, value := range args {
			if i == 0 {
				continue
			}
			floatSub /= ToFloat64(value)
		}
		return floatSub
	default:
		intSub := templateToInt(first)
		for i, value := range args {
			if i == 0 {
				continue
			}
			intSub /= templateToInt(value)
		}
		return intSub
	}
}

func mod(args ...interface{}) float64 {
	if len(args) != 2 {
		return math.NaN()
	}

	return math.Mod(ToFloat64(args[0]), ToFloat64(args[1]))
}

func pow(argX, argY interface{}) float64 {
	var xyValue float64
	var xySlice []float64

	sl := []interface{}{argX, argY}
	for _, v := range sl {
		switch v.(type) {
		case int, int8, int16, int32, int64, uint8, uint16, uint32, uint64, float32, float64:
			xyValue = ToFloat64(v)
		default:
			xyValue = math.NaN()
		}
		xySlice = append(xySlice, xyValue)
	}
	return math.Pow(xySlice[0], xySlice[1])
}

func sqrt(arg interface{}) float64 {
	switch arg.(type) {
	case int, int8, int16, int32, int64, uint8, uint16, uint32, uint64, float32, float64:
		return math.Sqrt(ToFloat64(arg))
	default:
		return math.Sqrt(-1)
	}
}

func round(args ...interface{}) float64 {
	if len(args) < 1 {
		return 0
	}
	return math.Round(ToFloat64(args[0]))
}

func roundCeil(args ...interface{}) float64 {
	if len(args) < 1 {
		return 0
	}
	return math.Ceil(ToFloat64(args[0]))
}

func roundFloor(args ...interface{}) float64 {
	if len(args) < 1 {
		return 0
	}
	return math.Floor(ToFloat64(args[0]))
}

func roundEven(args ...interface{}) float64 {
	if len(args) < 1 {
		return 0
	}
	return math.RoundToEven(ToFloat64(args[0]))
}
