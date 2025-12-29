package api

import (
	"net/http"

	"stopover.backend/config"
	"stopover.backend/internal/api/handler"
	"stopover.backend/internal/api/route"
	"stopover.backend/pkg/aviasales"
)

func Handler(w http.ResponseWriter, r *http.Request) {
	// Initialize on each request (serverless)
	config.LoadConfig()
	cfg := config.AppConfig

	fClient := aviasales.NewFlightIntegrationClient(
		cfg.AviaSalesConfig.AviaSalesToken,
		cfg.AviaSalesConfig.AviaSalesMarker,
		cfg.AviaSalesConfig.AviaSalesHost,
		&cfg,
	)

	fHandler := handler.NewFlightHandler(fClient, &cfg)
	router := route.SetupRouter(fHandler)

	router.ServeHTTP(w, r)
}
