package main

import (
	"stopover-go/config"
	"stopover-go/internal/api"
)

func main() {
	config.LoadConfig()
	api.StartServer()
}
