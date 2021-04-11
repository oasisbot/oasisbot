package config

import (
	"strconv"
	"strings"
)

type Store struct {
	Options map[string]*Option
	sources []Source
}

type Source interface {
	GetValue(key string) interface{}
}

type Option struct {
	Name         string
	Description  string
	DefaultValue interface{}
	Value        interface{}

	Store  *Store
	Source Source
}

func NewStore() *Store {
	return &Store{
		Options: make(map[string]*Option),
	}
}

func (s *Store) AddSource(src Source) {
	s.sources = append(s.sources, src)
}

func (s *Store) RegisterOption(name, desc string, defaultValue interface{}) *Option {
	opt := &Option{
		Name:         name,
		Description:  desc,
		DefaultValue: defaultValue,
		Store:        s,
	}
	s.Options[name] = opt
	return opt
}

func (s *Store) LoadAll() {
	for _, opt := range s.Options {
		opt.LoadValue()
	}
}

func (o *Option) LoadValue() {
	val := o.DefaultValue
	o.Source = nil

	for i := len(o.Store.sources) - 1; i >= 0; i-- {
		src := o.Store.sources[i]
		value := src.GetValue(o.Name)
		if value != nil {
			val = value
			o.Source = src

			break
		}
	}

	// Use defaultValue to parse loaded value
	if o.DefaultValue != nil {
		if _, ok := o.DefaultValue.(int); ok {
			val = interface{}(int(val.(int)))
		} else if _, ok := o.DefaultValue.(bool); ok {
			val = interface{}(bool(val.(bool)))
		}
	}

	o.Value = val
}

func (opt *Option) GetString() string {
	return strVal(opt.Value)
}

func (opt *Option) GetInt() int {
	return intVal(opt.Value)
}

func (opt *Option) GetBool() bool {
	return boolVal(opt.Value)
}

func strVal(i interface{}) string {
	switch t := i.(type) {
	case string:
		return t
	case int:
		return strconv.FormatInt(int64(t), 10)
	case Stringer:
		return t.String()
	}

	return ""
}

type Stringer interface {
	String() string
}

func intVal(i interface{}) int {
	switch t := i.(type) {
	case string:
		n, _ := strconv.ParseInt(t, 10, 64)
		return int(n)
	case int:
		return t
	}

	return 0
}

func boolVal(i interface{}) bool {
	switch t := i.(type) {
	case string:
		lower := strings.ToLower(strings.TrimSpace(t))
		if lower == "true" || lower == "yes" || lower == "on" || lower == "enabled" || lower == "1" {
			return true
		}

		return false
	case int:
		return t > 0
	case bool:
		return t
	}
	return false
}
