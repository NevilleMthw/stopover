package main

import (
	"aviasales/aviasales"
	"context"
	"log"
	"os"
	"time"

	"github.com/joho/godotenv"
)

func main() {
	aviasales.InitLogger("aviasales.log")

	log.Println("Starting Aviasales API client")

	// Load .env file
	err := godotenv.Load()
	if err != nil {
		log.Fatalf("Error loading .env file: %v", err)
	}

	ctx := context.Background()

	// Get values from environment variables
	token := os.Getenv("AVIASALES_TOKEN")
	marker := os.Getenv("AVIASALES_MARKER")
	host := os.Getenv("AVIASALES_HOST")

	log.Printf("Token: %s\nMarker: %s\nHost: %s", token, marker, host)

	// Initialize client with your token, marker, host
	client := aviasales.NewClient(token, marker, host)

	// Prepare your search request (populate with real data)
	req := aviasales.FlightSearchRequest{
		Marker:    marker,           // Your partner marker
		Host:      host,             // The host from which the search is performed
		UserIP:    "73.115.209.223", // User's IP address
		Locale:    "en",             // Language for the search results
		TripClass: "Y",              // Economy class. Use "B" for Business, "F" for First Class
		Passengers: aviasales.PassengerInfo{
			Adults:   1,
			Children: 0,
			Infants:  0,
		},
		Segments: []aviasales.Segment{
			{
				Origin:      "DEL",        // Example: John F. Kennedy International Airport
				Destination: "COK",        // Example: Los Angeles International Airport
				Date:        "2025-07-23", // Date of the flight in YYYY-MM-DD format
			},
		},
	}

	log.Printf("Request provided: %+v", req)

	// Generate the signature and add it to the request
	req.Signature = aviasales.GenerateSignature(
		token,
		req.Marker,
		req.Host,
		req.Locale,
		req.TripClass,
		req.UserIP,
		req.Passengers,
		req.Segments,
	)

	log.Printf("Request with signature: %+v", req)

	// Call InitSearch
	initResp, err := client.InitSearch(ctx, req)
	if err != nil {
		log.Fatalf("Failed to initialize search: %v", err)
	}

	log.Printf("Search initialized with ID: %s", initResp.SearchID)

	// Fetch results using the search ID with polling
	// Configure polling parameters: 10 attempts with 2 second intervals
	results, err := client.GetSearchResultsWithPolling(ctx, initResp.SearchID, 10, 2*time.Second)
	if err != nil {
		log.Fatalf("Failed to get search results: %v", err)
	}

	// Process results
	log.Printf("Search results: %+v", results)
}
