package config

import (
	"log"
	"os"
)

type Config struct {
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
	// Read from environment variables
	AppConfig = Config{
		AviaSalesConfig: AviaSalesConfig{
			InitSearchURL:   getEnv("INIT_SEARCH_URL", ""),
			ResultSearchURL: getEnv("RESULT_SEARCH_URL", ""),
			AviaSalesToken:  getEnv("AVIASALES_TOKEN", ""),
			AviaSalesMarker: getEnv("AVIASALES_MARKER", ""),
			AviaSalesHost:   getEnv("AVIASALES_HOST", ""),
		},
	}

	// Validate required fields
	if AppConfig.AviaSalesConfig.InitSearchURL == "" {
		log.Println("Warning: INIT_SEARCH_URL not set")
	}
	if AppConfig.AviaSalesConfig.ResultSearchURL == "" {
		log.Println("Warning: RESULT_SEARCH_URL not set")
	}
	if AppConfig.AviaSalesConfig.AviaSalesToken == "" {
		log.Println("Warning: AVIASALES_TOKEN not set")
	}
	if AppConfig.AviaSalesConfig.AviaSalesMarker == "" {
		log.Println("Warning: AVIASALES_MARKER not set")
	}
	if AppConfig.AviaSalesConfig.AviaSalesHost == "" {
		log.Println("Warning: AVIASALES_HOST not set")
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
