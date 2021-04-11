package util

import (
	"regexp"
	"testing"
)

const r = `^[a-z0-9\-]+$`

func TestRegex(t *testing.T) {
	_, err := regexp.Compile(r)
	if err != nil {
		t.Error(err)
	}

	Assert("new-command", true, t)
	Assert("ALLCAPS", false, t)
	Assert("command-348293", true, t)
	Assert("#*)%@", false, t)
	Assert("command", true, t)
	Assert("3491203-CAPS", false, t)
	Assert("white space nono", false, t)
	Assert("-", true, t)
	Assert(" 4M BR3AKInG-4LL-RU1L35", false, t)
	Assert("$command", false, t)
}

func Assert(test string, expect bool, t *testing.T) {
	match, _ := regexp.MatchString(r, test)
	if match != expect {
		if expect == true {
			t.Errorf("Expected %s to pass, but failed", test)
		} else {
			t.Errorf("Expected %s to fail, but passed", test)
		}
	}
}
