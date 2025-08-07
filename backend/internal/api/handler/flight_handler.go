package handler

import (
	"log"
	"net/http"
	"stopover-go/config"
	"stopover-go/pkg/aviasales"
	"time"

	"github.com/gin-gonic/gin"
)

type FlightHandler struct {
	FlightApi aviasales.FlightIntegrationAPI
	Config    *config.Config
}

func NewFlightHandler(flightApi aviasales.FlightIntegrationAPI, config *config.Config) *FlightHandler {
	return &FlightHandler{
		FlightApi: flightApi,
		Config:    config,
	}
}

func (f *FlightHandler) SearchFlight(c *gin.Context) {
	ctx := c.Request.Context()
	ip := c.ClientIP()

	// If behind proxy and IP looks empty, fallback to RemoteAddr
	// if ip == "" {
	// 	ip, _, _ = net.SplitHostPort(c.Request.RemoteAddr)
	// }

	log.Printf("Received request from IP: %s", ip)

	// TODO: optionally bind user input from JSON
	// var userInput YourInputStruct
	// if err := c.ShouldBindJSON(&userInput); err != nil {
	//     c.JSON(http.StatusBadRequest, gin.H{"error": "invalid input"})
	//     return
	// }

	// Build request
	req := aviasales.FlightSearchRequest{
		Marker:    f.Config.AviaSalesConfig.AviaSalesMarker,
		Host:      f.Config.AviaSalesConfig.AviaSalesHost,
		UserIP:    ip,
		Locale:    "en",
		TripClass: "Y", // Economy

		Passengers: aviasales.PassengerInfo{
			Adults:   1,
			Children: 0,
			Infants:  0,
		},

		Segments: []aviasales.Segment{
			{
				Origin:      "DEL",
				Destination: "COK",
				Date:        "2025-10-01", // Should be validated or set from user input
			},
		},
	}

	// Generate signature
	req.Signature = aviasales.GenerateSignature(
		f.Config.AviaSalesConfig.AviaSalesToken,
		req.Marker,
		req.Host,
		req.Locale,
		req.TripClass,
		req.UserIP,
		req.Passengers,
		req.Segments,
	)

	log.Printf("[InitSearch] Request: %+v", req)

	// Initialize search
	initResp, err := f.FlightApi.InitSearch(ctx, req)
	if err != nil {
		log.Printf("InitSearch error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to initialize flight search"})
		return
	}

	log.Printf("[InitSearch] Success. Search ID: %s", initResp.SearchID)

	// Poll for results
	results, err := f.FlightApi.GetSearchResultsWithPolling(ctx, initResp.SearchID, 10, 2*time.Second)
	if err != nil {
		log.Printf("Polling error: %v", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to get search results"})
		return
	}

	log.Printf("[Polling] Success. Found %d results.", len(results.Proposals))
	c.JSON(http.StatusOK, results)
}
