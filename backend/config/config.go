package config

import (
	"fmt"

	"github.com/spf13/viper"
)

type Config struct {
	Port            string `mapstructure:"PORT"`
	AviasalesToken  string `mapstructure:"AVIASALES_TOKEN"`
	AviasalesMarker string `mapstructure:"AVIASALES_MARKER"`
	AviasalesHost   string `mapstructure:"AVIASALES_HOST"`
	InitSearchURL   string `mapstructure:"INIT_SEARCH_URL"`
	ResultSearchURL string `mapstructure:"RESULT_SEARCH_URL"`
}

func LoadConfig() (*Config, error) {
	// Set default port
	viper.SetDefault("PORT", "8080")

	// Read from environment variables
	viper.AutomaticEnv()

	var config Config
	if err := viper.Unmarshal(&config); err != nil {
		return nil, fmt.Errorf("unable to decode config: %w", err)
	}

	// Validate required variables
	if config.AviasalesToken == "" {
		return nil, fmt.Errorf("AVIASALES_TOKEN is required")
	}
	if config.AviasalesHost == "" {
		return nil, fmt.Errorf("AVIASALES_HOST is required")
	}
	if config.InitSearchURL == "" {
		return nil, fmt.Errorf("INIT_SEARCH_URL is required")
	}
	if config.ResultSearchURL == "" {
		return nil, fmt.Errorf("RESULT_SEARCH_URL is required")
	}

	return &config, nil
}
