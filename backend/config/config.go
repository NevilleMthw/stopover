package config

import (
	"log"
	"os"

	"github.com/joho/godotenv"
)

type Config struct {
	Port            string
	AviaSalesConfig AviaSalesConfig
}

type AviaSalesConfig struct {
	InitSearchURL   string
	ResultSearchURL string
	AviaSalesToken  string
	AviaSalesMarker string
	AviaSalesHost   string
}

var AppConfig Config

func LoadConfig() {
	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Printf("Error reading .env file: %s", err)
		log.Println("Using environment variables only")
	}

	// Load configuration from environment variables
	AppConfig = Config{
		Port: getEnv("PORT", "8080"),
		AviaSalesConfig: AviaSalesConfig{
			InitSearchURL:   getEnv("INIT_SEARCH_URL", ""),
			ResultSearchURL: getEnv("RESULT_SEARCH_URL", ""),
			AviaSalesToken:  getEnv("AVIASALES_TOKEN", ""),
			AviaSalesMarker: getEnv("AVIASALES_MARKER", ""),
			AviaSalesHost:   getEnv("AVIASALES_HOST", ""),
		},
	}
}

func getEnv(key, defaultValue string) string {
	value := os.Getenv(key)
	if value == "" {
		return defaultValue
	}
	return value
}
