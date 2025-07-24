package main

import (
	"bytes"
	"compress/gzip"
	"context"
	"encoding/json"
	"fmt"
	"io"
	"log"
	"net/http"
	"time"
)

const (
	initSearchURL   = "https://api.travelpayouts.com/v1/flight_search"
	resultSearchURL = "https://api.travelpayouts.com/v1/flight_search_results?uuid=%s"
)

type Client struct {
	Token  string
	Marker string
	Host   string
	HTTP   *http.Client
}

func NewClient(token, marker, host string) *Client {
	return &Client{
		Token:  token,
		Marker: marker,
		Host:   host,
		HTTP:   &http.Client{Timeout: 15 * time.Second},
	}
}

func (c *Client) InitSearch(ctx context.Context, req FlightSearchRequest) (*FlightSearchInitResponse, error) {
	log.Println("[InitSearch] Preparing request")

	// Prepare map for signature
	signParams := map[string]string{
		"host":       req.Host,
		"locale":     req.Locale,
		"trip_class": req.TripClass,
		"user_ip":    req.UserIP,
	}

	// Flatten passengers
	signParams["passengers.adults"] = fmt.Sprintf("%d", req.Passengers.Adults)
	signParams["passengers.children"] = fmt.Sprintf("%d", req.Passengers.Children)
	signParams["passengers.infants"] = fmt.Sprintf("%d", req.Passengers.Infants)

	// Flatten segments
	for i, s := range req.Segments {
		signParams[fmt.Sprintf("segments[%d].date", i)] = s.Date
		signParams[fmt.Sprintf("segments[%d].origin", i)] = s.Origin
		signParams[fmt.Sprintf("segments[%d].destination", i)] = s.Destination
	}

	// Generate signature
	//	req.Signature = GenerateSignature(c.Token, c.Marker, signParams)
	req.Signature = GenerateSignature(
		c.Token,
		c.Marker,
		req.Host,
		req.Locale,
		req.TripClass,
		req.UserIP,
		req.Passengers,
		req.Segments,
	)
	log.Printf("[InitSearch] Generated signature: %s", req.Signature)

	req.Marker = c.Marker
	req.Host = c.Host

	// Marshal body
	bodyBytes, err := json.Marshal(req)
	if err != nil {
		log.Printf("[InitSearch] Error marshaling body: %v", err)
		return nil, fmt.Errorf("marshal init request: %w", err)
	}
	log.Printf("[InitSearch] Request body: %s", string(bodyBytes))

	// Send POST request
	httpReq, _ := http.NewRequestWithContext(ctx, "POST", initSearchURL, bytes.NewReader(bodyBytes))
	httpReq.Header.Set("Content-Type", "application/json")

	resp, err := c.HTTP.Do(httpReq)
	if err != nil {
		log.Printf("[InitSearch] HTTP request failed: %v", err)
		return nil, fmt.Errorf("flight search init request failed: %w", err)
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Printf("[InitSearch] Failed to close response body: %v", err)
		}
	}(resp.Body)

	respBody, _ := io.ReadAll(resp.Body)

	if resp.StatusCode != http.StatusOK {
		log.Printf("[InitSearch] Non-200 status: %d\nBody: %s", resp.StatusCode, string(respBody))
		return nil, fmt.Errorf("flight search init HTTP %d: %s", resp.StatusCode, string(respBody))
	}

	log.Printf("[InitSearch] Response body: %s", string(respBody))

	var result FlightSearchInitResponse
	if err := json.Unmarshal(respBody, &result); err != nil {
		log.Printf("[InitSearch] Failed to unmarshal response: %v", err)
		return nil, fmt.Errorf("unmarshal init response: %w", err)
	}

	log.Printf("[InitSearch] Search initialized with ID: %s", result.SearchID)
	return &result, nil
}

// GetSearchResults fetches search results for a given search ID with a single request
func (c *Client) GetSearchResults(ctx context.Context, searchID string) (*FlightSearchResponseWrapper, error) {
	url := fmt.Sprintf(resultSearchURL, searchID)
	log.Printf("[GetSearchResults] Fetching results from URL: %s", url)

	httpReq, _ := http.NewRequestWithContext(ctx, "GET", url, nil)
	httpReq.Header.Set("Accept-Encoding", "gzip,deflate")

	resp, err := c.HTTP.Do(httpReq)
	if err != nil {
		log.Printf("[GetSearchResults] HTTP request failed: %v", err)
		return nil, fmt.Errorf("get search result failed: %w", err)
	}
	defer func(Body io.ReadCloser) {
		err := Body.Close()
		if err != nil {
			log.Printf("[GetSearchResults] Failed to close response body: %v", err)
		}
	}(resp.Body)

	var reader io.Reader = resp.Body
	if resp.Header.Get("Content-Encoding") == "gzip" {
		gzipReader, err := gzip.NewReader(resp.Body)
		if err != nil {
			log.Printf("[GetSearchResults] Failed to create gzip reader: %v", err)
			return nil, err
		}
		defer func(gzipReader *gzip.Reader) {
			err := gzipReader.Close()
			if err != nil {
				log.Printf("[GetSearchResults] Failed to close gzip reader: %v", err)
			}
		}(gzipReader)
		reader = gzipReader
	}

	respBody, err := io.ReadAll(reader)
	if err != nil {
		log.Printf("[GetSearchResults] Failed to read response body: %v", err)
		return nil, err
	}
	if resp.StatusCode != http.StatusOK {
		log.Printf("[GetSearchResults] Non-200 status: %d\nBody: %s", resp.StatusCode, string(respBody))
		return nil, fmt.Errorf("search result HTTP %d: %s", resp.StatusCode, string(respBody))
	}

	log.Printf("[GetSearchResults] Response body: %s", string(respBody))

	var results []FlightSearchResponseWrapper
	if err := json.Unmarshal(respBody, &results); err != nil {
		log.Printf("[GetSearchResults] Failed to unmarshal response: %v", err)
		return nil, err
	}

	if len(results) == 0 {
		log.Printf("[GetSearchResults] Empty result array")
		return nil, fmt.Errorf("no results returned")
	}

	log.Printf("Result Object: %v", results)
	// Log the search ID and count of proposals
	log.Printf("[GetSearchResults] Search ID: %s, Offers: %d", results[0].SearchID, len(results[0].Proposals))

	return &results[0], nil
}

// GetSearchResultsWithPolling fetches search results with polling until proposals are found or timeout is reached
func (c *Client) GetSearchResultsWithPolling(ctx context.Context, searchID string, maxAttempts int, pollInterval time.Duration) (*FlightSearchResponseWrapper, error) {
	log.Printf("[GetSearchResultsWithPolling] Starting polling for search ID: %s", searchID)

	for attempt := 1; attempt <= maxAttempts; attempt++ {
		log.Printf("[GetSearchResultsWithPolling] Attempt %d of %d", attempt, maxAttempts)

		result, err := c.GetSearchResults(ctx, searchID)
		if err != nil {
			log.Printf("[GetSearchResultsWithPolling] Error on attempt %d: %v", attempt, err)
			// If this is the last attempt, return the error
			if attempt == maxAttempts {
				return nil, err
			}
			// Otherwise, continue to the next attempt after waiting
		} else if len(result.Proposals) > 0 {
			// We found proposals, return the result
			log.Printf("[GetSearchResultsWithPolling] Found %d proposals on attempt %d", len(result.Proposals), attempt)
			return result, nil
		} else {
			log.Printf("[GetSearchResultsWithPolling] No proposals found on attempt %d, continuing polling", attempt)
		}

		// Wait before the next attempt, but check if context is done first
		select {
		case <-ctx.Done():
			return nil, ctx.Err()
		case <-time.After(pollInterval):
			// Continue to next attempt
		}
	}

	// If we get here, we've exhausted all attempts without finding proposals
	log.Printf("[GetSearchResultsWithPolling] No proposals found after %d attempts", maxAttempts)

	// Get the final result to return, even if it has no proposals
	return c.GetSearchResults(ctx, searchID)
}
