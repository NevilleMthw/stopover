package aviasales

import (
	"encoding/json"
	"log"
	"net/http"
	"time"
)

const (
	// Exchange API settings
	exchangeAPIURL      = "https://api.exchangerate-api.com/v4/latest/RUB"
	defaultRubToUSDRate = 0.011 // Approximately 1 RUB = 0.011 USD
)

// Get live exchange rate with fallback to static rate
func getCurrentRubToUSDRate() float64 {
	// Try to get live rate
	client := &http.Client{Timeout: 5 * time.Second}
	resp, err := client.Get(exchangeAPIURL)
	if err != nil {
		log.Printf("Failed to fetch exchange rate (network error): %v, using default rate", err)
		return defaultRubToUSDRate
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		log.Printf("Exchange rate API returned status %d, using default rate", resp.StatusCode)
		return defaultRubToUSDRate
	}

	var result struct {
		Rates map[string]float64 `json:"rates"`
	}

	if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
		log.Printf("Failed to decode exchange rate response: %v, using default rate", err)
		return defaultRubToUSDRate
	}

	if rate, exists := result.Rates["USD"]; exists && rate > 0 {
		log.Printf("Successfully fetched exchange rate: 1 RUB = %.4f USD", rate)
		return rate
	}

	log.Printf("USD rate not found in API response, using default rate")
	return defaultRubToUSDRate
}

// Get live exchange rate with fallback to static rate
//func getCurrentRubToINRRate() float64 {
//
//    // Try to get live rate
//    client := &http.Client{Timeout: 5 * time.Second}
//    resp, err := client.Get(exchangeAPIURL)
//    if err != nil {
//
//       return defaultRubToINRRate
//    }
//    defer resp.Body.Close()
//
//    if resp.StatusCode != http.StatusOK {
//
//       return defaultRubToINRRate
//    }
//
//    var result struct {
//       Rates map[string]float64 `json:"rates"`
//    }
//
//    if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
//
//       return defaultRubToINRRate
//    }
//
//    if rate, exists := result.Rates["INR"]; exists {
//
//       return rate
//    }
//
//func convertPricesToINR(response *FlightSearchResponseWrapper) {
//
//
//    // Get exchange rate once for all conversions
//    rate := getCurrentRubToINRRate()
//
//    for i := range response.Proposals {
//       for termKey, termData := range response.Proposals[i].Terms {
//          // Log detailed currency information before conversion
//
//
//          // Convert unified_price from RUB to INR using the fetched rate (this is the actual flight price)
//          unifiedPriceINR := termData.UnifiedPrice * rate
//
//
//          // Update the term data with INR price
//          response.Proposals[i].Terms[termKey] = TermData{
//             Currency:     "INR",
//             Price:        termData.Price,  // Keep original price field as-is
//             UnifiedPrice: unifiedPriceINR, // Convert the unified price (actual flight cost)
//             URL:          termData.URL,
//          }
//
//       }
//    }

// Convert all prices in flight response to USD
func (c *Client) ConvertPricesToUSD(response *FlightSearchResponseWrapper) {
	if response == nil {
		log.Printf("Warning: Received nil response for currency conversion")
		return
	}

	// Get exchange rate once for all conversions
	rate := getCurrentRubToUSDRate()
	log.Printf("Converting %d flight proposals using rate: 1 RUB = %.4f USD", len(response.Proposals), rate)

	for i := range response.Proposals {
		for termKey, termData := range response.Proposals[i].Terms {
			// Convert unified_price from RUB to USD
			unifiedPriceUSD := termData.UnifiedPrice * rate

			// Round to 2 decimal places for cleaner display
			unifiedPriceUSD = roundToTwoDecimals(unifiedPriceUSD)

			// Store original values before conversion
			originalPrice := termData.Price
			originalCurrency := termData.Currency

			// Update the term data with USD conversion
			termData.Currency = "USD"
			termData.Price = unifiedPriceUSD        // Display price in USD
			termData.UnifiedPrice = unifiedPriceUSD // Both same now

			// Update back to the map
			response.Proposals[i].Terms[termKey] = termData

			log.Printf("Converted flight %s: Original %.2f %s -> Display $%.2f",
				termKey, originalPrice, originalCurrency, unifiedPriceUSD)
		}
	}

	// Update the response currency indicator
	response.Currency = "USD"
	log.Printf("Successfully converted all prices to USD")
}

// roundToTwoDecimals rounds a float64 to 2 decimal places
func roundToTwoDecimals(value float64) float64 {
	return float64(int(value*100+0.5)) / 100
}
