package templates

import (
	"fmt"
	"strings"
)

func ParseAndExecuteSimple(template string, left string, right string, context map[string]interface{}) string {
	var formatted string = template
	for i, c := range template {
		ch := fmt.Sprintf("%c", c)
		if ch == left {
			var term int
			for j := i; j < len(template); j++ {
				p := fmt.Sprintf("%c", template[j])
				if p == right { // Terminator character found
					term = j
					break
				} else if j == len(template)-1 { // End of response, no success
					return formatted // Return as is
				}
			}

			substr := template[i+1 : term]
			if context[substr] != nil {
				formatted = strings.ReplaceAll(formatted, fmt.Sprintf("%s%s%s", left, substr, right), fmt.Sprintf("%v", context[substr]))
			}
		}
	}
	return formatted
}
