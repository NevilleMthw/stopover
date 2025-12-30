package route

import (
	"stopover.backend/internal/api/handler"

	"github.com/gin-gonic/gin"
)

func SetupRouter(handler *handler.FlightHandler) *gin.Engine {
	router := gin.Default()

	// Enhanced CORS middleware
	router.Use(func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		// Allow your production and development domains
		if origin == "https://stopover.in" {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
		} else {
			c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		}
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Origin, Content-Type, Accept, Authorization, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Max-Age", "86400")

		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}
		c.Next()
	})

	// API group
	api := router.Group("/api")
	{
		api.GET("/airports/autocomplete", handler.AirportsAutocomplete)
		api.GET("/flights", handler.SearchFlightsAPI)
	}

	// legacy flight group
	flt := router.Group("/flight")
	flt.POST("/search", handler.SearchFlight)

	return router
}
