package util

import (
	"bytes"
	"encoding/json"
)

// https://stackoverflow.com/a/52395589
func UnorderedEqual(first, second []string) bool {
	if len(first) != len(second) {
		return false
	}
	exists := make(map[string]bool)
	for _, value := range first {
		exists[value] = true
	}
	for _, value := range second {
		if !exists[value] {
			return false
		}
	}
	return true
}

// https://stackoverflow.com/a/60508928
func GetRealSizeOf(v interface{}) (int, error) {
	b := new(bytes.Buffer)
	if err := json.NewEncoder(b).Encode(v); err != nil {
		return 0, err
	}
	return b.Len(), nil
}
