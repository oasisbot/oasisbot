package config

var Singleton = NewStore()

func AddSource(src Source) {
	Singleton.AddSource(src)
}

func RegisterOption(name, desc string, defaultValue interface{}) *Option {
	return Singleton.RegisterOption(name, desc, defaultValue)
}

func LoadAll() {
	Singleton.LoadAll()
}
