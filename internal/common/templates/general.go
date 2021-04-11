package templates

import (
	"fmt"
	"reflect"
	"strconv"
	"time"
)

func templateToInt(of interface{}) int {
	t := reflect.ValueOf(of).Kind()
	if t == reflect.Int ||
		t == reflect.Int16 ||
		t == reflect.Int32 ||
		t == reflect.Int64 ||
		t == reflect.Float32 ||
		t == reflect.Float64 ||
		t == reflect.Uint ||
		t == reflect.Uint8 ||
		t == reflect.Uint16 ||
		t == reflect.Uint32 ||
		t == reflect.Uint64 {
		return int(reflect.ValueOf(of).Int())
	} else if t == reflect.String {
		result, _ := strconv.ParseInt(of.(string), 10, 64)
		return int(reflect.ValueOf(result).Int())
	} else {
		return 0
	}
}

func ToInt64(from interface{}) int64 {
	switch t := from.(type) {
	case int:
		return int64(t)
	case int8:
		return int64(t)
	case int16:
		return int64(t)
	case int32:
		return int64(t)
	case int64:
		return int64(t)
	case float32:
		return int64(t)
	case float64:
		return int64(t)
	case uint:
		return int64(t)
	case uint32:
		return int64(t)
	case uint64:
		return int64(t)
	case string:
		parsed, _ := strconv.ParseInt(t, 10, 64)
		return parsed
	case time.Duration:
		return int64(t)
	default:
		return 0
	}
}

func ToFloat64(from interface{}) float64 {
	switch t := from.(type) {
	case int:
		return float64(t)
	case int32:
		return float64(t)
	case int64:
		return float64(t)
	case float32:
		return float64(t)
	case float64:
		return float64(t)
	case uint:
		return float64(t)
	case uint32:
		return float64(t)
	case uint64:
		return float64(t)
	case string:
		parsed, _ := strconv.ParseFloat(t, 64)
		return parsed
	case time.Duration:
		return float64(t)
	default:
		return 0
	}
}

func ToString(from interface{}) string {
	switch t := from.(type) {
	case int:
		return strconv.Itoa(t)
	case int8:
		return strconv.FormatInt(int64(t), 10)
	case int16:
		return strconv.FormatInt(int64(t), 10)
	case int32:
		return strconv.FormatInt(int64(t), 10)
	case int64:
		return strconv.FormatInt(t, 10)
	case float32:
		return strconv.FormatFloat(float64(t), 'e', -1, 32)
	case float64:
		return strconv.FormatFloat(t, 'e', -1, 64)
	case uint:
		return strconv.FormatUint(uint64(t), 10)
	case uint8:
		return strconv.FormatUint(uint64(t), 10)
	case uint32:
		return strconv.FormatUint(uint64(t), 10)
	case uint64:
		return strconv.FormatUint(uint64(t), 10)
	case []rune:
		return string(t)
	case []byte:
		return string(t)
	case fmt.Stringer:
		return t.String()
	case string:
		return t
	default:
		return ""
	}
}
