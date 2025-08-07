package route

import (
	"stopover-go/config"
	"stopover-go/internal/api/handler"

	"github.com/gin-gonic/gin"
)

// func SetupRouter(handler *handler.Handler, cfg config.Config, authMiddleware gin.HandlerFunc) *gin.Engine {
func SetupRouter(fhandler *handler.FlightHandler, cfg *config.Config) *gin.Engine {
	router := gin.Default()

	// endpoints
	// rg := router.Group("/api")
	//rg.Use(authMiddleware)

	// rg.POST("/users/all", handler.GetAllUsers)
	// rg.DELETE("/users/:id", handler.DeleteUser)

	// // public endpoints
	// pub := router.Group("/account")
	// pub.POST("/users", handler.CreateUser)
	// pub.POST("/login", handler.Login)

	flt := router.Group("/flight")
	flt.POST("/search", fhandler.SearchFlight)
	return router
}
